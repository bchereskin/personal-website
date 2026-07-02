'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Comment } from '@/app/lib/types';

const EDIT_TOKENS_KEY = 'comment_edit_tokens';
const EDIT_WINDOW_MS = 15 * 60 * 1000;

function getEditTokens(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(EDIT_TOKENS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveEditToken(commentId: number, token: string) {
  const tokens = getEditTokens();
  tokens[commentId] = token;
  localStorage.setItem(EDIT_TOKENS_KEY, JSON.stringify(tokens));
}

function isEditable(comment: Comment): boolean {
  const tokens = getEditTokens();
  if (!tokens[comment.id]) return false;
  const created = new Date(comment.created_at).getTime();
  return Date.now() - created < EDIT_WINDOW_MS;
}

function timeRemaining(createdAt: string): string {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const remaining = EDIT_WINDOW_MS - elapsed;
  if (remaining <= 0) return '';
  const mins = Math.ceil(remaining / 60000);
  return `${mins}m left to edit`;
}

function formatCommentDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const COLLAPSE_THRESHOLD = 300;

function CollapsibleText({ body, className }: { body: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = body.length > COLLAPSE_THRESHOLD;

  return (
    <div>
      <p className={`${className || ''} leading-relaxed whitespace-pre-wrap break-words`}>
        {isLong && !expanded ? body.slice(0, COLLAPSE_THRESHOLD).trimEnd() + '…' : body}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors mt-1"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
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
      if (newComment.edit_token) {
        saveEditToken(newComment.id, newComment.edit_token);
      }
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

function ReplyItem({
  reply,
  onEdit,
  onReplyClick,
}: {
  reply: Comment;
  onEdit: (id: number, newBody: string) => Promise<boolean>;
  onReplyClick: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const editable = isEditable(reply);

  const initials = reply.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSave() {
    if (!editBody.trim() || editBody === reply.body) { setEditing(false); return; }
    setSaving(true);
    setEditError('');
    const success = await onEdit(reply.id, editBody);
    setSaving(false);
    if (success) { setEditing(false); } else { setEditError('Failed to save. Edit window may have expired.'); }
  }

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--neutral-700)] flex items-center justify-center text-xs font-semibold text-[var(--primary)]">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="font-semibold text-[var(--neutral-100)] text-sm">{reply.name}</span>
          <span className="text-xs text-[var(--neutral-400)]">{formatCommentDate(reply.created_at)}</span>
          {editable && !editing && (
            <span className="text-xs text-[var(--neutral-500)]">{timeRemaining(reply.created_at)}</span>
          )}
        </div>
        {editing ? (
          <div>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              maxLength={2000}
              rows={3}
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-3 py-2 text-[var(--neutral-100)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm resize-y"
            />
            {editError && <p className="text-xs text-[var(--accent)] mt-1">{editError}</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={handleSave} disabled={saving || !editBody.trim()} className="px-3 py-1.5 rounded-md bg-[var(--primary)] text-[var(--background)] text-xs font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => { setEditing(false); setEditBody(reply.body); setEditError(''); }} disabled={saving} className="px-3 py-1.5 rounded-md bg-[var(--neutral-700)] text-[var(--neutral-300)] text-xs hover:bg-[var(--neutral-600)] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <CollapsibleText body={reply.body} className="text-[var(--neutral-200)] text-sm" />
            <div className="flex gap-3 mt-1">
              {editable && <button onClick={() => setEditing(true)} className="text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors">Edit</button>}
              <button onClick={onReplyClick} className="text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors">Reply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  replies,
  slug,
  onNewReply,
  onEdit,
  editable,
}: {
  comment: Comment;
  replies: Comment[];
  slug: string;
  onNewReply: (comment: Comment) => void;
  onEdit: (id: number, newBody: string) => Promise<boolean>;
  editable: boolean;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [threadCollapsed, setThreadCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const initials = comment.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSave() {
    if (!editBody.trim() || editBody === comment.body) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setEditError('');
    const success = await onEdit(comment.id, editBody);
    setSaving(false);
    if (success) {
      setEditing(false);
    } else {
      setEditError('Failed to save. Edit window may have expired.');
    }
  }

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
            {editable && !editing && (
              <span className="text-xs text-[var(--neutral-500)]">{timeRemaining(comment.created_at)}</span>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                maxLength={2000}
                rows={3}
                className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm resize-y"
              />
              {editError && <p className="text-xs text-[var(--accent)] mt-1">{editError}</p>}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !editBody.trim()}
                  className="px-3 py-1.5 rounded-md bg-[var(--primary)] text-[var(--background)] text-xs font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditBody(comment.body); setEditError(''); }}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-md bg-[var(--neutral-700)] text-[var(--neutral-300)] text-xs hover:bg-[var(--neutral-600)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <CollapsibleText body={comment.body} className="text-[var(--neutral-200)]" />
              <div className="flex gap-3 mt-2">
                {editable && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="mt-4 ml-14">
          {threadCollapsed ? (
            <button
              onClick={() => setThreadCollapsed(false)}
              className="flex items-center gap-2 text-xs text-[var(--neutral-500)] hover:text-[var(--primary)] transition-colors py-1"
            >
              <span className="inline-block w-4 text-center">+</span>
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          ) : (
            <div className="flex">
              <button
                onClick={() => setThreadCollapsed(true)}
                className="flex-shrink-0 w-4 group flex justify-center"
                title="Collapse thread"
              >
                <div className="w-0.5 h-full bg-[var(--neutral-700)] group-hover:bg-[var(--primary)] transition-colors rounded-full" />
              </button>
              <div className="flex-1 pl-3 space-y-4">
                {replies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    onEdit={onEdit}
                    onReplyClick={() => setShowReplyForm(true)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
  const [, setTick] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [notifyReplies, setNotifyReplies] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

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
  const getReplies = (parentId: number) => comments.filter((c) => c.parent_id === parentId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, body, honeypot, notify_replies: notifyReplies }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const newComment = await res.json();
      if (newComment.id) {
        if (newComment.edit_token) {
          saveEditToken(newComment.id, newComment.edit_token);
        }
        const commentWithoutToken = { ...newComment };
        delete commentWithoutToken.edit_token;
        setComments((prev) => [...prev, commentWithoutToken]);
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

  async function handleEdit(commentId: number, newBody: string): Promise<boolean> {
    const tokens = getEditTokens();
    const edit_token = tokens[commentId];
    if (!edit_token) return false;

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, edit_token, body: newBody }),
      });

      if (res.ok) {
        const updated = await res.json();
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, body: updated.body } : c))
        );
        return true;
      }
    } catch {}
    return false;
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
              onEdit={handleEdit}
              editable={isEditable(c)}
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
