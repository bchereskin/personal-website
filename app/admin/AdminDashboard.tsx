'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';
import { posts } from '@/app/blog/posts';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface Comment {
  id: number;
  slug: string;
  name: string;
  email: string;
  body: string;
  created_at: string;
}

interface SharedPage {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  visit_count: number;
  last_visited_at: string | null;
  is_active: boolean;
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-xl p-5">
      <p className="text-3xl font-bold text-[var(--neutral-50)]">{value}</p>
      <p className="text-sm text-[var(--neutral-400)] mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard({
  contacts: initialContacts,
  comments: initialComments,
  sharedPages: initialSharedPages,
  userEmail,
}: {
  contacts: Contact[];
  comments: Comment[];
  sharedPages: SharedPage[];
  userEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'contacts' | 'comments' | 'notify' | 'shared'>('contacts');
  const [contacts, setContacts] = useState(initialContacts);
  const [comments, setComments] = useState(initialComments);
  const [sharedPages, setSharedPages] = useState(initialSharedPages);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notifySlug, setNotifySlug] = useState(posts[0]?.slug || '');
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  async function deleteContact(id: number) {
    setDeleting(id);
    const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  async function deleteComment(id: number) {
    setDeleting(id);
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  async function notifySubscribers() {
    if (!notifySlug) return;
    setNotifying(true);
    setNotifyResult(null);
    try {
      const res = await fetch('/api/admin/notify-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: notifySlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotifyResult(`Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}`);
      } else {
        setNotifyResult(data.error || 'Failed to send');
      }
    } catch {
      setNotifyResult('Failed to send');
    } finally {
      setNotifying(false);
    }
  }

  async function toggleSharedPage(id: string, currentActive: boolean) {
    setToggling(id);
    const res = await fetch(`/api/admin/shared-pages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentActive }),
    });
    if (res.ok) {
      setSharedPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
    }
    setToggling(null);
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`https://www.brettchereskin.com/shared/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  const activePages = sharedPages.filter((p) => p.is_active);
  const totalVisits = sharedPages.reduce((sum, p) => sum + p.visit_count, 0);

  const tabClass = (active: boolean) =>
    `px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-[var(--primary)] text-[var(--background)]'
        : 'text-[var(--neutral-400)] hover:text-[var(--neutral-100)]'
    }`;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top bar */}
      <header className="border-b border-[var(--neutral-700)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M20 2L4 9v10c0 9.4 6.8 18.2 16 20.4C29.2 37.2 36 28.4 36 19V9L20 2z" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="2"/>
              <path d="M14 20l4 4 8-8" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="font-semibold text-[var(--neutral-100)]">Brett Chereskin</span>
              <span className="ml-2 text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--neutral-500)] hidden sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--neutral-400)] hover:text-[var(--neutral-100)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total contacts" value={contacts.length} />
          <StatCard label="Total comments" value={comments.length} />
          <StatCard label="Active shared pages" value={activePages.length} />
          <StatCard label="Total page visits" value={totalVisits} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button className={tabClass(tab === 'contacts')} onClick={() => setTab('contacts')}>
            Contacts ({contacts.length})
          </button>
          <button className={tabClass(tab === 'comments')} onClick={() => setTab('comments')}>
            Comments ({comments.length})
          </button>
          <button className={tabClass(tab === 'shared')} onClick={() => setTab('shared')}>
            Shared Pages ({sharedPages.length})
          </button>
          <button className={tabClass(tab === 'notify')} onClick={() => setTab('notify')}>
            Notify Subscribers
          </button>
        </div>

        {/* Contacts table */}
        {tab === 'contacts' && (
          <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl overflow-hidden">
            {contacts.length === 0 ? (
              <p className="text-[var(--neutral-500)] text-sm p-8 text-center">No contacts yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--neutral-700)]">
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Name</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Email</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Subject</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Date</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <>
                        <tr
                          key={c.id}
                          className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)] cursor-pointer"
                          onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                        >
                          <td className="px-5 py-4 text-[var(--neutral-100)] font-medium">{c.name}</td>
                          <td className="px-5 py-4 text-[var(--neutral-300)]">{c.email}</td>
                          <td className="px-5 py-4">
                            <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-full">{c.subject}</span>
                          </td>
                          <td className="px-5 py-4 text-[var(--neutral-500)]">{formatDate(c.created_at)}</td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteContact(c.id); }}
                              disabled={deleting === c.id}
                              className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
                            >
                              {deleting === c.id ? '…' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                        {expanded === c.id && (
                          <tr key={`${c.id}-expanded`} className="bg-[var(--neutral-800)] border-b border-[var(--neutral-700)]">
                            <td colSpan={5} className="px-5 py-4">
                              <p className="text-[var(--neutral-300)] text-sm whitespace-pre-wrap">{c.message}</p>
                              <a
                                href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                                className="inline-block mt-3 text-xs text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                              >
                                Reply to {c.email} →
                              </a>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Comments table */}
        {tab === 'comments' && (
          <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl overflow-hidden">
            {comments.length === 0 ? (
              <p className="text-[var(--neutral-500)] text-sm p-8 text-center">No comments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--neutral-700)]">
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Name</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Post</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Comment</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Date</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((c) => (
                      <tr key={c.id} className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)]">
                        <td className="px-5 py-4">
                          <p className="text-[var(--neutral-100)] font-medium">{c.name}</p>
                          <p className="text-[var(--neutral-500)] text-xs">{c.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={`/blog/${c.slug}`}
                            target="_blank"
                            className="text-[var(--primary)] hover:text-[var(--primary-light)] text-xs transition-colors"
                          >
                            {c.slug}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-[var(--neutral-300)] max-w-xs">
                          <p className="truncate">{c.body}</p>
                        </td>
                        <td className="px-5 py-4 text-[var(--neutral-500)]">{formatDate(c.created_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => deleteComment(c.id)}
                            disabled={deleting === c.id}
                            className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
                          >
                            {deleting === c.id ? '…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Shared Pages table */}
        {tab === 'shared' && (
          <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl overflow-hidden">
            {sharedPages.length === 0 ? (
              <p className="text-[var(--neutral-500)] text-sm p-8 text-center">No shared pages yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--neutral-700)]">
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Title</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Created</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Visits</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Last Visited</th>
                      <th className="text-left px-5 py-3 text-[var(--neutral-400)] font-medium">Status</th>
                      <th className="px-5 py-3 text-[var(--neutral-400)] font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedPages.map((p) => (
                      <tr key={p.id} className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)]">
                        <td className="px-5 py-4 text-[var(--neutral-100)] font-medium">{p.title}</td>
                        <td className="px-5 py-4 text-[var(--neutral-500)]">{formatDate(p.created_at)}</td>
                        <td className="px-5 py-4 text-[var(--neutral-300)]">{p.visit_count}</td>
                        <td className="px-5 py-4 text-[var(--neutral-500)]">
                          {p.last_visited_at ? formatDate(p.last_visited_at) : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            p.is_active
                              ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                              : 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          }`}>
                            {p.is_active ? 'Active' : 'Dehosted'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => copyLink(p.slug)}
                              className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors"
                            >
                              {copied === p.slug ? 'Copied!' : 'Copy link'}
                            </button>
                            {p.is_active && (
                              <a
                                href={`/shared/${p.slug}`}
                                target="_blank"
                                className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors"
                              >
                                View
                              </a>
                            )}
                            <button
                              onClick={() => toggleSharedPage(p.id, p.is_active)}
                              disabled={toggling === p.id}
                              className={`text-xs transition-colors disabled:opacity-40 ${
                                p.is_active
                                  ? 'text-[var(--neutral-500)] hover:text-[var(--accent)]'
                                  : 'text-[var(--neutral-500)] hover:text-[var(--primary)]'
                              }`}
                            >
                              {toggling === p.id ? '…' : p.is_active ? 'Dehost' : 'Rehost'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Notify subscribers */}
        {tab === 'notify' && (
          <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl p-8 max-w-lg">
            <h3 className="text-lg font-semibold text-[var(--neutral-100)] mb-2">Notify blog subscribers</h3>
            <p className="text-sm text-[var(--neutral-400)] mb-6">Send an email to all subscribers about a new post.</p>

            <label className="block text-sm text-[var(--neutral-300)] mb-2">Select post</label>
            <select
              value={notifySlug}
              onChange={(e) => setNotifySlug(e.target.value)}
              className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] text-sm mb-6 focus:outline-none focus:border-[var(--primary)]"
            >
              {posts.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>

            <button
              onClick={notifySubscribers}
              disabled={notifying || !notifySlug}
              className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {notifying ? 'Sending…' : 'Send notification'}
            </button>

            {notifyResult && (
              <p className={`mt-4 text-sm ${notifyResult.startsWith('Sent') ? 'text-[var(--primary)]' : 'text-[var(--accent)]'}`}>
                {notifyResult}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
