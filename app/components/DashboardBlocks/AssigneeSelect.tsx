'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, User, X } from 'lucide-react';
import { Member, memberUser } from '../../types/join-space';

interface AssigneeSelectProps {
  members: Member[];
  /** Selected user ids. */
  value: string[];
  onChange: (ids: string[]) => void;
  label?: string;
  className?: string;
}

/**
 * Multi-select for task assignees. Renders selected people as removable chips
 * over a checkbox dropdown, so one task can be assigned to any number of
 * members of the space.
 */
const AssigneeSelect: React.FC<AssigneeSelectProps> = ({
  members,
  value,
  onChange,
  label = 'Assign to',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const options = members
    .map((member) => {
      const user = memberUser(member);
      return user && typeof user.id === 'string'
        ? { id: user.id, name: user.full_name ?? 'Unnamed Member' }
        : null;
    })
    .filter((o): o is { id: string; name: string } => o !== null);

  const nameFor = (id: string) => options.find((o) => o.id === id)?.name ?? 'Unknown';

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const summary =
    value.length === 0
      ? 'Unassigned'
      : value.length === 1
      ? nameFor(value[0])
      : `${value.length} people assigned`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="block text-white/70 text-xs sm:text-sm font-poppins mb-1">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-800 text-white font-poppins text-sm sm:text-base border border-white/10 hover:border-white/30 transition-colors"
      >
        <span className="flex items-center gap-2 truncate">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <span className={`truncate ${value.length === 0 ? 'text-white/50' : ''}`}>
            {summary}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-poppins"
            >
              {nameFor(id)}
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-label={`Remove ${nameFor(id)}`}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto rounded-lg bg-gray-800 border border-white/20 shadow-2xl"
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-white/50 text-sm font-poppins">
              No members in this space
            </p>
          ) : (
            options.map((option) => {
              const selected = value.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggle(option.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-poppins text-white hover:bg-white/10 transition-colors"
                >
                  <span
                    className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                      selected
                        ? 'bg-sky-500 border-sky-400'
                        : 'border-white/30'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="truncate">{option.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AssigneeSelect;
