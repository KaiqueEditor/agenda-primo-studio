import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  maxTags?: number;
}

export const AutocompleteTagInput: React.FC<Props> = ({ tags = [], onChange, suggestions, placeholder, maxTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  const handleAddTag = (tag: string) => {
    if (maxTags && tags.length >= maxTags) return;
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim()]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="tag-input-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-main)', position: 'relative', alignItems: 'center' }}>
      {tags.map(tag => (
        <span key={tag} className="tag-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
          {tag}
          <button 
            type="button" 
            onClick={() => onChange(tags.filter(t => t !== tag))}
            style={{ background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {(!maxTags || tags.length < maxTags) && (
        <div style={{ position: 'relative', flex: 1, minWidth: '120px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--text-primary)' }}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="suggestions-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '4px', zIndex: 10, maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {filteredSuggestions.map(s => (
                <div 
                  key={s} 
                  className="suggestion-item"
                  onClick={() => handleAddTag(s)}
                  style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid var(--border)' }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
