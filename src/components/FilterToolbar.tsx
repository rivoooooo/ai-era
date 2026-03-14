'use client';

import React from 'react';

interface FilterToolbarProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedDifficulty: string | null;
  onDifficultyChange: (difficulty: string | null) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const STATUSES = ['ALL', 'AVAILABLE', 'COMPLETED', 'LOCKED'];

export default function FilterToolbar({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: FilterToolbarProps) {
  return (
    <div className="filter-toolbar">
      <div className="flex items-center gap-2">
        <label className="text-xs opacity-60">category:</label>
        <select
          className="filter-select"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
        >
          <option value="">ALL</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs opacity-60">difficulty:</label>
        <select
          className="filter-select"
          value={selectedDifficulty || ''}
          onChange={(e) => onDifficultyChange(e.target.value || null)}
        >
          <option value="">ALL</option>
          {DIFFICULTIES.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs opacity-60">status:</label>
        <select
          className="filter-select"
          value={selectedStatus || ''}
          onChange={(e) => onStatusChange(e.target.value || null)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status === 'ALL' ? '' : status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">&gt;</span>
          <input
            type="text"
            className="filter-select bg-transparent border-b border-border focus:border-primary outline-none px-2 py-1 w-40"
            placeholder="search_"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
