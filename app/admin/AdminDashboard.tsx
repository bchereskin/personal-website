'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';

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
  userEmail,
}: {
  contacts: Contact[];
  comments: Comment[];
  userEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'contacts' | 'comments'>('contacts');
  const [contacts, setContacts] = useState(initialContacts);
  const [comments, setComments] = useState(initialComments);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

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
          <StatCard
            label="This month (contacts)"
            value={contacts.filter((c) => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
          />
          <StatCard
            label="This month (comments)"
            value={comments.filter((c) => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className={tabClass(tab === 'contacts')} onClick={() => setTab('contacts')}>
            Contacts ({contacts.length})
          </button>
          <button className={tabClass(tab === 'comments')} onClick={() => setTab('comments')}>
            Comments ({comments.length})
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
      </main>
    </div>
  );
}
