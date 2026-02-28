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

function CommentItem({ comment }: { comment: Comment }) {
  const initials = comment.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex gap-4 py-6 border-b border-[var(--neutral-700)] last:border-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--neutral-700)] flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="font-semibold text-[var(--neutral-100)]">{comment.name}</span>
          <span className="text-xs text-[var(--neutral-400)]">{formatCommentDate(comment.created_at)}</span>
        </div>
        <p className="text-[var(--neutral-200)] leading-relaxed whitespace-pre-wrap break-words">{comment.body}</p>
      </div>
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, body, honeypot }),
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
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm';

  return (
    <section className="mt-16 pt-12 border-t border-[var(--neutral-700)]">
      <h2 className="text-2xl font-bold text-[var(--neutral-50)] mb-8">
        Comments{comments.length > 0 && <span className="ml-2 text-lg text-[var(--neutral-400)] font-normal">({comments.length})</span>}
      </h2>

      {/* Comment list */}
      {loading ? (
        <div className="text-[var(--neutral-400)] text-sm mb-10">Loading comments…</div>
      ) : comments.length > 0 ? (
        <div className="mb-12">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--neutral-400)] text-sm mb-10">No comments yet. Be the first to share your thoughts!</p>
      )}

      {/* Comment form */}
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
          {/* Honeypot — hidden from real users */}
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

          <div className="mb-6">
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
