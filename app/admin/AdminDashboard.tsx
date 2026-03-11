'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';
import { BlogContentRenderer } from '@/app/components/BlogRenderer';
import { extractBodyContent, reconstructHtml } from './html-utils';

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
  html_content: string;
  created_at: string;
  visit_count: number;
  last_visited_at: string | null;
  is_active: boolean;
  recipient_name: string | null;
  recipient_type: 'person' | 'project' | 'business' | null;
}

interface SharedPageEditorState {
  id?: string;
  slug: string;
  title: string;
  html_content: string;
  is_active: boolean;
  recipient_name: string;
  recipient_type: 'person' | 'project' | 'business' | '';
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  visit_count: number;
  last_visited_at: string | null;
}

interface EditorState {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  is_published: boolean;
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

const emptyEditor: EditorState = {
  slug: '',
  title: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0],
  read_time: '5 min read',
  category: 'AI & Building',
  content: '',
  is_published: false,
};

const emptySharedEditor: SharedPageEditorState = {
  slug: '',
  title: '',
  html_content: '',
  is_active: true,
  recipient_name: '',
  recipient_type: '',
};

export default function AdminDashboard({
  contacts: initialContacts,
  comments: initialComments,
  sharedPages: initialSharedPages,
  blogPosts: initialBlogPosts,
  commentCountMap,
  userEmail,
}: {
  contacts: Contact[];
  comments: Comment[];
  sharedPages: SharedPage[];
  blogPosts: BlogPostRow[];
  commentCountMap: Record<string, number>;
  userEmail: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'contacts' | 'comments' | 'notify' | 'shared' | 'blog'>('blog');
  const [contacts, setContacts] = useState(initialContacts);
  const [comments, setComments] = useState(initialComments);
  const [sharedPages, setSharedPages] = useState(initialSharedPages);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [deleting, setDeleting] = useState<number | string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notifySlug, setNotifySlug] = useState(initialBlogPosts.find(p => p.is_published)?.slug || '');
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);

  const [sharedEditor, setSharedEditor] = useState<SharedPageEditorState | null>(null);
  const [sharedEditorMode, setSharedEditorMode] = useState<'edit' | 'preview'>('edit');
  const [sharedBodyContent, setSharedBodyContent] = useState('');
  const sharedHtmlWrapper = useRef({ headWrapper: '', tailWrapper: '' });
  const [sharedSaving, setSharedSaving] = useState(false);
  const [sharedSaveResult, setSharedSaveResult] = useState<string | null>(null);

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

  async function toggleBlogPost(id: string, currentPublished: boolean) {
    setToggling(id);
    const res = await fetch(`/api/admin/blog-posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !currentPublished }),
    });
    if (res.ok) {
      setBlogPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: !currentPublished } : p))
      );
    }
    setToggling(null);
  }

  async function deleteBlogPost(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE' });
    if (res.ok) setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  async function savePost() {
    if (!editor) return;
    setSaving(true);
    setSaveResult(null);

    try {
      const payload = {
        slug: editor.slug,
        title: editor.title,
        excerpt: editor.excerpt,
        content: editor.content,
        date: editor.date,
        read_time: editor.read_time,
        category: editor.category,
        is_published: editor.is_published,
      };

      let res: Response;
      if (editor.id) {
        res = await fetch(`/api/admin/blog-posts/${editor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blog-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (editor.id) {
          setBlogPosts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
        } else {
          setBlogPosts((prev) => [data, ...prev]);
        }
        setSaveResult('Saved!');
        setTimeout(() => {
          setEditor(null);
          setSaveResult(null);
        }, 1000);
      } else {
        const err = await res.json();
        setSaveResult(err.error || 'Failed to save');
      }
    } catch {
      setSaveResult('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function openEditor(post?: BlogPostRow) {
    if (post) {
      setEditor({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        read_time: post.read_time,
        category: post.category,
        content: post.content,
        is_published: post.is_published,
      });
    } else {
      setEditor({ ...emptyEditor });
    }
    setShowPreview(false);
    setSaveResult(null);
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`https://www.brettchereskin.com/shared/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  function openSharedEditor(page?: SharedPage) {
    if (page) {
      const { headWrapper, bodyContent, tailWrapper } = extractBodyContent(page.html_content);
      sharedHtmlWrapper.current = { headWrapper, tailWrapper };
      setSharedBodyContent(bodyContent);
      setSharedEditor({
        id: page.id,
        slug: page.slug,
        title: page.title,
        html_content: page.html_content,
        is_active: page.is_active,
        recipient_name: page.recipient_name || '',
        recipient_type: page.recipient_type || '',
      });
    } else {
      sharedHtmlWrapper.current = { headWrapper: '', tailWrapper: '' };
      setSharedBodyContent('');
      setSharedEditor({ ...emptySharedEditor });
    }
    setSharedEditorMode('edit');
    setSharedSaveResult(null);
  }

  async function saveSharedPage() {
    if (!sharedEditor) return;
    setSharedSaving(true);
    setSharedSaveResult(null);

    try {
      const fullHtml = sharedHtmlWrapper.current.headWrapper
        ? reconstructHtml(sharedHtmlWrapper.current.headWrapper, sharedBodyContent, sharedHtmlWrapper.current.tailWrapper)
        : sharedBodyContent;

      const payload = {
        slug: sharedEditor.slug,
        title: sharedEditor.title,
        html_content: fullHtml,
        is_active: sharedEditor.is_active,
        recipient_name: sharedEditor.recipient_name || null,
        recipient_type: sharedEditor.recipient_type || null,
      };

      let res: Response;
      if (sharedEditor.id) {
        res = await fetch(`/api/admin/shared-pages/${sharedEditor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/shared-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (sharedEditor.id) {
          setSharedPages((prev) => prev.map((p) => (p.id === data.id ? data : p)));
        } else {
          setSharedPages((prev) => [data, ...prev]);
        }
        setSharedSaveResult('Saved!');
        setTimeout(() => {
          setSharedEditor(null);
          setSharedSaveResult(null);
        }, 1000);
      } else {
        const err = await res.json();
        setSharedSaveResult(err.error || 'Failed to save');
      }
    } catch {
      setSharedSaveResult('Failed to save');
    } finally {
      setSharedSaving(false);
    }
  }

  async function deleteSharedPage(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/admin/shared-pages/${id}`, { method: 'DELETE' });
    if (res.ok) setSharedPages((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  const activePages = sharedPages.filter((p) => p.is_active);
  const totalVisits = sharedPages.reduce((sum, p) => sum + p.visit_count, 0);
  const publishedPosts = blogPosts.filter((p) => p.is_published);
  const totalBlogViews = blogPosts.reduce((sum, p) => sum + p.visit_count, 0);

  const tabClass = (active: boolean) =>
    `px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-[var(--primary)] text-[var(--background)]'
        : 'text-[var(--neutral-400)] hover:text-[var(--neutral-100)]'
    }`;

  if (sharedEditor) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="border-b border-[var(--neutral-700)] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setSharedEditor(null)}
              className="text-sm text-[var(--neutral-400)] hover:text-[var(--neutral-100)] transition-colors"
            >
              ← Back to dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex border border-[var(--neutral-600)] rounded-lg overflow-hidden">
                {(['edit', 'preview'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSharedEditorMode(mode)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      sharedEditorMode === mode
                        ? 'bg-[var(--neutral-600)] text-[var(--neutral-100)]'
                        : 'text-[var(--neutral-400)] hover:text-[var(--neutral-100)]'
                    }`}
                  >
                    {mode === 'edit' ? 'Edit' : 'Preview'}
                  </button>
                ))}
              </div>
              <button
                onClick={saveSharedPage}
                disabled={sharedSaving || !sharedEditor.title || !sharedEditor.slug}
                className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sharedSaving ? 'Saving…' : sharedEditor.id ? 'Update Page' : 'Create Page'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {sharedSaveResult && (
            <div className={`mb-4 text-sm ${sharedSaveResult === 'Saved!' ? 'text-[var(--primary)]' : 'text-[var(--accent)]'}`}>
              {sharedSaveResult}
            </div>
          )}

          {sharedEditorMode === 'preview' ? (
            <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl p-4 overflow-hidden">
              <iframe
                srcDoc={
                  sharedHtmlWrapper.current.headWrapper
                    ? reconstructHtml(sharedHtmlWrapper.current.headWrapper, sharedBodyContent, sharedHtmlWrapper.current.tailWrapper)
                    : sharedBodyContent
                }
                sandbox="allow-same-origin"
                className="w-full border border-[var(--neutral-700)] rounded-xl bg-white"
                style={{ height: '80vh' }}
                title="Page preview"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Title</label>
                  <input
                    value={sharedEditor.title}
                    onChange={(e) => setSharedEditor({ ...sharedEditor, title: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Slug</label>
                  <input
                    value={sharedEditor.slug}
                    onChange={(e) => setSharedEditor({ ...sharedEditor, slug: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    placeholder="my-page-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Recipient Name</label>
                  <input
                    value={sharedEditor.recipient_name}
                    onChange={(e) => setSharedEditor({ ...sharedEditor, recipient_name: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    placeholder="e.g. Michael Camhi"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Recipient Type</label>
                  <select
                    value={sharedEditor.recipient_type}
                    onChange={(e) => setSharedEditor({ ...sharedEditor, recipient_type: e.target.value as SharedPageEditorState['recipient_type'] })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">None</option>
                    <option value="person">Person</option>
                    <option value="project">Project</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-sm text-[var(--neutral-300)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharedEditor.is_active}
                      onChange={(e) => setSharedEditor({ ...sharedEditor, is_active: e.target.checked })}
                      className="rounded border-[var(--neutral-600)]"
                    />
                    Active (publicly accessible)
                  </label>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Body HTML</label>
                  <div className="text-xs text-[var(--neutral-500)] mb-2">
                    Editing the body content only. The document head, styles, and fonts are preserved automatically.
                  </div>
                  <textarea
                    value={sharedBodyContent}
                    onChange={(e) => setSharedBodyContent(e.target.value)}
                    rows={20}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--primary)] resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-2">Live Preview</label>
                  <iframe
                    srcDoc={
                      sharedHtmlWrapper.current.headWrapper
                        ? reconstructHtml(sharedHtmlWrapper.current.headWrapper, sharedBodyContent, sharedHtmlWrapper.current.tailWrapper)
                        : sharedBodyContent
                    }
                    sandbox="allow-same-origin"
                    className="w-full border border-[var(--neutral-700)] rounded-xl bg-white"
                    style={{ height: '50vh' }}
                    title="Live preview"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (editor) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="border-b border-[var(--neutral-700)] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setEditor(null)}
              className="text-sm text-[var(--neutral-400)] hover:text-[var(--neutral-100)] transition-colors"
            >
              ← Back to dashboard
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--neutral-600)] text-[var(--neutral-300)] hover:text-[var(--neutral-100)] transition-colors"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={savePost}
                disabled={saving || !editor.title || !editor.slug || !editor.content}
                className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving…' : editor.id ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {saveResult && (
            <div className={`mb-4 text-sm ${saveResult === 'Saved!' ? 'text-[var(--primary)]' : 'text-[var(--accent)]'}`}>
              {saveResult}
            </div>
          )}

          {showPreview ? (
            <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl p-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 text-sm text-[var(--neutral-500)] mb-5">
                  <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
                    {editor.category}
                  </span>
                  <span>{editor.date}</span>
                  <span>·</span>
                  <span>{editor.read_time}</span>
                </div>
                <h1 className="text-4xl font-bold text-[var(--neutral-50)] leading-[1.15] mb-8">
                  {editor.title || 'Untitled Post'}
                </h1>
                <BlogContentRenderer content={editor.content} isPreview />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Title</label>
                  <input
                    value={editor.title}
                    onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Slug</label>
                  <input
                    value={editor.slug}
                    onChange={(e) => setEditor({ ...editor, slug: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    placeholder="my-post-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Excerpt</label>
                  <textarea
                    value={editor.excerpt}
                    onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })}
                    rows={3}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--neutral-400)] mb-1">Date</label>
                    <input
                      type="date"
                      value={editor.date}
                      onChange={(e) => setEditor({ ...editor, date: e.target.value })}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--neutral-400)] mb-1">Read Time</label>
                    <input
                      value={editor.read_time}
                      onChange={(e) => setEditor({ ...editor, read_time: e.target.value })}
                      className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--neutral-400)] mb-1">Category</label>
                  <input
                    value={editor.category}
                    onChange={(e) => setEditor({ ...editor, category: e.target.value })}
                    className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-2.5 text-[var(--neutral-100)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-sm text-[var(--neutral-300)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editor.is_published}
                      onChange={(e) => setEditor({ ...editor, is_published: e.target.checked })}
                      className="rounded border-[var(--neutral-600)]"
                    />
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm text-[var(--neutral-400)] mb-1">Content</label>
                <div className="text-xs text-[var(--neutral-500)] mb-2">
                  Supports: ## Heading, ### Subheading, **bold**, - bullets, [CALLOUT] text, [MODEL] Name | Description
                </div>
                <textarea
                  value={editor.content}
                  onChange={(e) => setEditor({ ...editor, content: e.target.value })}
                  rows={30}
                  className="w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--primary)] resize-y"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard label="Published posts" value={publishedPosts.length} />
          <StatCard label="Total blog views" value={totalBlogViews} />
          <StatCard label="Total contacts" value={contacts.length} />
          <StatCard label="Total comments" value={comments.length} />
          <StatCard label="Active shared pages" value={activePages.length} />
          <StatCard label="Total page visits" value={totalVisits} />
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button className={tabClass(tab === 'blog')} onClick={() => setTab('blog')}>
            Blog Posts ({blogPosts.length})
          </button>
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

        {tab === 'blog' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => openEditor()}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] transition-colors"
              >
                + New Post
              </button>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl overflow-hidden">
              {blogPosts.length === 0 ? (
                <p className="text-[var(--neutral-500)] text-sm p-8 text-center">No blog posts yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--neutral-700)]">
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Post</th>
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Stats</th>
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Status</th>
                        <th className="px-4 py-3 text-[var(--neutral-400)] font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((p) => (
                        <tr key={p.id} className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)]">
                          <td className="px-4 py-3 min-w-0 max-w-sm">
                            <p className="text-[var(--neutral-100)] font-medium truncate">{p.title}</p>
                            <p className="text-xs text-[var(--neutral-500)] mt-0.5">
                              {formatDate(p.date)} · <span className="text-[var(--primary)]">{p.category}</span>
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[var(--neutral-300)]">{p.visit_count} views</p>
                            <p className="text-xs text-[var(--neutral-500)] mt-0.5">{commentCountMap[p.slug] || 0} comments</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              p.is_published
                                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                : 'bg-[var(--neutral-600)]/30 text-[var(--neutral-400)]'
                            }`}>
                              {p.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <a href={`/blog/${p.slug}`} target="_blank" className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors">View</a>
                              <button onClick={() => openEditor(p)} className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors">Edit</button>
                              <button
                                onClick={() => toggleBlogPost(p.id, p.is_published)}
                                disabled={toggling === p.id}
                                className={`text-xs transition-colors disabled:opacity-40 ${p.is_published ? 'text-[var(--neutral-500)] hover:text-[var(--accent)]' : 'text-[var(--neutral-500)] hover:text-[var(--primary)]'}`}
                              >
                                {toggling === p.id ? '…' : p.is_published ? 'Unpublish' : 'Publish'}
                              </button>
                              <button
                                onClick={() => deleteBlogPost(p.id)}
                                disabled={deleting === p.id}
                                className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
                              >
                                {deleting === p.id ? '…' : 'Delete'}
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
          </div>
        )}

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
                        <tr key={c.id} className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)] cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                          <td className="px-5 py-4 text-[var(--neutral-100)] font-medium">{c.name}</td>
                          <td className="px-5 py-4 text-[var(--neutral-300)]">{c.email}</td>
                          <td className="px-5 py-4"><span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-full">{c.subject}</span></td>
                          <td className="px-5 py-4 text-[var(--neutral-500)]">{formatDate(c.created_at)}</td>
                          <td className="px-5 py-4 text-right">
                            <button onClick={(e) => { e.stopPropagation(); deleteContact(c.id); }} disabled={deleting === c.id} className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40">
                              {deleting === c.id ? '…' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                        {expanded === c.id && (
                          <tr key={`${c.id}-expanded`} className="bg-[var(--neutral-800)] border-b border-[var(--neutral-700)]">
                            <td colSpan={5} className="px-5 py-4">
                              <p className="text-[var(--neutral-300)] text-sm whitespace-pre-wrap">{c.message}</p>
                              <a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`} className="inline-block mt-3 text-xs text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors">Reply to {c.email} →</a>
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
                        <td className="px-5 py-4"><a href={`/blog/${c.slug}`} target="_blank" className="text-[var(--primary)] hover:text-[var(--primary-light)] text-xs transition-colors">{c.slug}</a></td>
                        <td className="px-5 py-4 text-[var(--neutral-300)] max-w-xs"><p className="truncate">{c.body}</p></td>
                        <td className="px-5 py-4 text-[var(--neutral-500)]">{formatDate(c.created_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => deleteComment(c.id)} disabled={deleting === c.id} className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40">
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

        {tab === 'shared' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => openSharedEditor()}
                className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] transition-colors"
              >
                + New Page
              </button>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-2xl overflow-hidden">
              {sharedPages.length === 0 ? (
                <p className="text-[var(--neutral-500)] text-sm p-8 text-center">No shared pages yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--neutral-700)]">
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Page</th>
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Recipient</th>
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Visits</th>
                        <th className="text-left px-4 py-3 text-[var(--neutral-400)] font-medium">Status</th>
                        <th className="px-4 py-3 text-[var(--neutral-400)] font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedPages.map((p) => (
                        <tr key={p.id} className="border-b border-[var(--neutral-700)] last:border-0 hover:bg-[var(--neutral-800)]">
                          <td className="px-4 py-3 min-w-0">
                            <p className="text-[var(--neutral-100)] font-medium truncate">{p.title}</p>
                            <p className="text-xs text-[var(--neutral-500)] mt-0.5">{formatDate(p.created_at)}</p>
                          </td>
                          <td className="px-4 py-3">
                            {p.recipient_name ? (
                              <div>
                                <p className="text-[var(--neutral-200)] text-sm">{p.recipient_name}</p>
                                {p.recipient_type && (
                                  <span className="text-xs text-[var(--neutral-500)] capitalize">{p.recipient_type}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[var(--neutral-600)]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[var(--neutral-300)]">{p.visit_count}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                              {p.is_active ? 'Active' : 'Dehosted'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => copyLink(p.slug)} className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors">{copied === p.slug ? 'Copied!' : 'Copy link'}</button>
                              {p.is_active && <a href={`/shared/${p.slug}`} target="_blank" className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors">View</a>}
                              <button onClick={() => openSharedEditor(p)} className="text-xs text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors">Edit</button>
                              <button onClick={() => toggleSharedPage(p.id, p.is_active)} disabled={toggling === p.id} className={`text-xs transition-colors disabled:opacity-40 ${p.is_active ? 'text-[var(--neutral-500)] hover:text-[var(--accent)]' : 'text-[var(--neutral-500)] hover:text-[var(--primary)]'}`}>
                                {toggling === p.id ? '…' : p.is_active ? 'Dehost' : 'Rehost'}
                              </button>
                              <button
                                onClick={() => deleteSharedPage(p.id)}
                                disabled={deleting === p.id}
                                className="text-xs text-[var(--neutral-500)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
                              >
                                {deleting === p.id ? '…' : 'Delete'}
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
          </div>
        )}

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
              {blogPosts.filter(p => p.is_published).map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
            <button onClick={notifySubscribers} disabled={notifying || !notifySlug} className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {notifying ? 'Sending…' : 'Send notification'}
            </button>
            {notifyResult && (
              <p className={`mt-4 text-sm ${notifyResult.startsWith('Sent') ? 'text-[var(--primary)]' : 'text-[var(--accent)]'}`}>{notifyResult}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
