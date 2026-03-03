'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Comment } from '@/app/lib/types';

function formatCommentDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const inputClass =
  'w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm';

function ReplyForm({
  slug,
  parentId,
  onSubmitted,
  onCancel,
}: {
  slug: string;
  parentId: number;
  onSubmitted: (comment: Comment) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [notifyReplies, setNotifyReplies] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          email,
          body,
          honeypot,
          parent_id: parentId,
          notify_replies: notifyReplies,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        return;
      }

      const newComment = await res.json();
      onSubmitted(newComment);
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pl-14 space-y-3">
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name *"
          required
          maxLength={100}
          className={inputClass}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (not published) *"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a reply…"
        required
        maxLength={2000}
        rows={3}
        className={`${inputClass} resize-y`}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={notifyReplies}
          onChange={(e) => setNotifyReplies(e.target.checked)}
          className="w-4 h-4 rounded border-[var(--neutral-600)] bg-[var(--neutral-800)] accent-[var(--primary)]"
        />
        <span className="text-xs text-[var(--neutral-400)]">Notify me of replies</span>
      </label>
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !email.trim() || !body.trim()}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-xs hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Posting…' : 'Reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-[var(--neutral-700)] text-[var(--neutral-300)] text-xs hover:bg-[var(--neutral-600)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  replies,
  slug,
  onNewReply,
}: {
  comment: Comment;
  replies: Comment[];
  slug: string;
  onNewReply: (comment: Comment) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const initials = comment.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-6 border-b border-[var(--neutral-700)] last:border-0">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--neutral-700)] flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="font-semibold text-[var(--neutral-100)]">{comment.name}</span>
            <span className="text-xs text-[var(--neutral-400)]">{formatCommentDate(comment.created_at)}</span>
          </div>
          <p className="text-[var(--neutral-200)] leading-relaxed whitespace-pre-wrap break-words">{comment.body}</p>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-4 ml-14 border-l-2 border-[var(--neutral-700)] pl-4 space-y-4">
          {replies.map((reply) => {
            const replyInitials = reply.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={reply.id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center text-xs font-semibold text-[var(--primary)]">
                  {replyInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-[var(--neutral-100)] text-sm">{reply.name}</span>
                    <span className="text-xs text-[var(--neutral-400)]">{formatCommentDate(reply.created_at)}</span>
                  </div>
                  <p className="text-[var(--neutral-200)] leading-relaxed whitespace-pre-wrap break-words text-sm">{reply.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <ReplyForm
          slug={slug}
          parentId={comment.id}
          onSubmitted={(newReply) => {
            onNewReply(newReply);
            setShowReplyForm(false);
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}
    </div>
  );
}

export default function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [notifyReplies, setNotifyReplies] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.parent_id === parentId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          email,
          body,
          honeypot,
          notify_replies: notifyReplies,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const newComment = await res.json();
      if (newComment.id) {
        setComments((prev) => [...prev, newComment]);
      }
      setName('');
      setEmail('');
      setBody('');
      setNotifyReplies(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleNewReply(reply: Comment) {
    setComments((prev) => [...prev, reply]);
  }

  return (
    <section className="mt-16 pt-12 border-t border-[var(--neutral-700)]">
      <h2 className="text-2xl font-bold text-[var(--neutral-50)] mb-8">
        Comments{comments.length > 0 && <span className="ml-2 text-lg text-[var(--neutral-400)] font-normal">({comments.length})</span>}
      </h2>

      {loading ? (
        <div className="text-[var(--neutral-400)] text-sm mb-10">Loading comments…</div>
      ) : topLevelComments.length > 0 ? (
        <div className="mb-12">
          {topLevelComments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={getReplies(c.id)}
              slug={slug}
              onNewReply={handleNewReply}
            />
          ))}
        </div>
      ) : (
        <p className="text-[var(--neutral-400)] text-sm mb-10">No comments yet. Be the first to share your thoughts!</p>
      )}

      <div className="glass rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-[var(--neutral-100)] mb-6">Leave a comment</h3>

        {submitted && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-[var(--primary-dark)] text-[var(--neutral-50)] text-sm">
            Thanks for your comment!
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-[var(--accent-dark)] text-[var(--neutral-50)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 pointer-events-none w-0 h-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="comment-name" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                Name <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={100}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                Email <span className="text-[var(--accent)]">*</span>
                <span className="ml-1 text-[var(--neutral-500)]">(not published)</span>
              </label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                maxLength={200}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment-body" className="block text-sm text-[var(--neutral-300)] mb-1.5">
              Comment <span className="text-[var(--accent)]">*</span>
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts…"
              required
              maxLength={2000}
              rows={4}
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1 text-xs text-[var(--neutral-500)] text-right">{body.length}/2000</p>
          </div>

          <label className="flex items-center gap-2 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyReplies}
              onChange={(e) => setNotifyReplies(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--neutral-600)] bg-[var(--neutral-800)] accent-[var(--primary)]"
            />
            <span className="text-sm text-[var(--neutral-400)]">Notify me when someone replies</span>
          </label>

          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || !body.trim()}
            className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      </div>
    </section>
  );
}
