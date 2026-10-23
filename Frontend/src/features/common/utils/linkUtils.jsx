import React from 'react';

/**
 * Detects platform details from URL
 */
export const getLinkPlatform = (url) => {
  if (!url) return { name: 'Project Link', icon: '🔗', color: 'var(--color-electric-cyan)', bg: 'rgba(0, 217, 255, 0.15)', border: 'rgba(0, 217, 255, 0.45)' };
  const lower = url.toLowerCase();

  if (lower.includes('figma.com')) {
    return { name: 'Figma Prototype', icon: '🎨', color: '#0acf83', bg: 'rgba(10, 207, 131, 0.18)', border: 'rgba(10, 207, 131, 0.5)' };
  }
  if (lower.includes('canva.com')) {
    return { name: 'Canva Design', icon: '🖌', color: '#00c4cc', bg: 'rgba(0, 196, 204, 0.18)', border: 'rgba(0, 196, 204, 0.5)' };
  }
  if (lower.includes('adobe.com') || lower.includes('xd.adobe.com')) {
    return { name: 'Adobe XD', icon: '📐', color: '#ff61f6', bg: 'rgba(255, 97, 246, 0.18)', border: 'rgba(255, 97, 246, 0.5)' };
  }
  if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) {
    return { name: 'Google Drive', icon: '📁', color: '#ffba08', bg: 'rgba(255, 186, 8, 0.18)', border: 'rgba(255, 186, 8, 0.5)' };
  }
  if (lower.includes('github.com')) {
    return { name: 'GitHub Repo', icon: '💻', color: '#a370f7', bg: 'rgba(163, 112, 247, 0.18)', border: 'rgba(163, 112, 247, 0.5)' };
  }
  if (lower.includes('dribbble.com')) {
    return { name: 'Dribbble', icon: '🏀', color: '#ea4c89', bg: 'rgba(234, 76, 137, 0.18)', border: 'rgba(234, 76, 137, 0.5)' };
  }
  if (lower.includes('behance.net')) {
    return { name: 'Behance', icon: '🔷', color: '#0057ff', bg: 'rgba(0, 87, 255, 0.18)', border: 'rgba(0, 87, 255, 0.5)' };
  }

  return { name: 'Live Link', icon: '🔗', color: 'var(--color-electric-cyan)', bg: 'rgba(0, 217, 255, 0.15)', border: 'rgba(0, 217, 255, 0.45)' };
};

/**
 * Extracts and formats all URLs from any string or combination of fields
 */
export const extractUrls = (...texts) => {
  const combined = texts.filter(Boolean).join(' \n ');
  if (!combined.trim()) return [];

  const urlRegex = /(https?:\/\/[^\s,;<>"\']+|www\.[^\s,;<>"\']+|figma\.com\/[^\s,;<>"\']+|canva\.com\/[^\s,;<>"\']+|drive\.google\.com\/[^\s,;<>"\']+|docs\.google\.com\/[^\s,;<>"\']+|github\.com\/[^\s,;<>"\']+)/gi;

  const matches = combined.match(urlRegex) || [];
  const seen = new Set();
  const results = [];

  for (const match of matches) {
    let clean = match.trim().replace(/[.,;!?)]+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }

    if (!seen.has(clean)) {
      seen.add(clean);
      const platform = getLinkPlatform(clean);
      results.push({
        url: clean,
        raw: match,
        ...platform,
      });
    }
  }

  return results;
};

/**
 * Clickable Link Pill component
 */
export function ClickableLinkPill({ link, size = 'md' }) {
  const isSm = size === 'sm';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSm ? '3px 8px' : '6px 14px',
        backgroundColor: link.bg,
        border: `1px solid ${link.border}`,
        borderRadius: 'var(--radius-sm)',
        color: link.color,
        fontWeight: 700,
        fontFamily: 'var(--font-label)',
        fontSize: isSm ? '0.75rem' : '0.875rem',
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        boxShadow: `0 0 10px ${link.bg}`,
      }}
      title={`Open ${link.name}: ${link.url}`}
      onClick={(e) => e.stopPropagation()}
    >
      <span>{link.icon}</span>
      <span>{link.name}</span>
      <span style={{ fontSize: '0.9em', opacity: 0.8 }}>↗</span>
    </a>
  );
}

/**
 * Renders arbitrary text with URLs converted into clickable links
 */
export function LinkifiedText({ text }) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s,;<>"\']+|www\.[^\s,;<>"\']+|figma\.com\/[^\s,;<>"\']+|canva\.com\/[^\s,;<>"\']+)/gi;
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          let url = part;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
          }
          const platform = getLinkPlatform(url);
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: platform.color,
                textDecoration: 'underline',
                fontWeight: 700,
                wordBreak: 'break-all',
                margin: '0 2px',
              }}
            >
              {platform.icon} {part} ↗
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
