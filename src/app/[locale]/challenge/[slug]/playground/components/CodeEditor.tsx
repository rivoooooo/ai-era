'use client';

import { ChallengeFile } from '../utils';

interface CodeEditorProps {
  files: ChallengeFile[];
  activeFileIndex: number;
  onFileSelect: (index: number) => void;
  onChange: (content: string) => void;
}

export default function CodeEditor({ files, activeFileIndex, onFileSelect, onChange }: CodeEditorProps) {
  const activeFile = files[activeFileIndex];

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--card)] border border-[var(--border)]">
      <div className="flex border-b border-[var(--border)] overflow-x-auto">
        {files.map((file, idx) => (
          <button
            key={idx}
            onClick={() => onFileSelect(idx)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeFileIndex === idx
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {file.filename}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        {activeFile ? (
          <textarea
            value={activeFile.content}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full p-4 bg-[var(--card)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
            placeholder={`Enter ${activeFile.language} code...`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted-foreground)]">
            No files available
          </div>
        )}
      </div>
    </div>
  );
}
