'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect, useCallback } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function SharedPageRichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-xs font-medium transition-colors ${
      active
        ? 'bg-[var(--primary)] text-white'
        : 'text-[var(--neutral-300)] hover:bg-[var(--neutral-700)]'
    }`;

  return (
    <div className="tiptap-editor">
      <div className="flex flex-wrap gap-1 p-2 bg-[var(--neutral-800)] border border-[var(--neutral-600)] border-b-0 rounded-t-lg">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>
          H3
        </button>

        <div className="w-px h-6 bg-[var(--neutral-600)] mx-1 self-center" />

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
          <em>I</em>
        </button>

        <div className="w-px h-6 bg-[var(--neutral-600)] mx-1 self-center" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
          • List
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
          1. List
        </button>

        <div className="w-px h-6 bg-[var(--neutral-600)] mx-1 self-center" />

        <button type="button" onClick={setLink} className={btn(editor.isActive('link'))}>
          Link
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
          —
        </button>

        <div className="w-px h-6 bg-[var(--neutral-600)] mx-1 self-center" />

        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btn(false)} disabled:opacity-30`}>
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btn(false)} disabled:opacity-30`}>
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
