import './Pagination.css';

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, and current +/- 1
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ◀
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="pagination__info">
              …
            </span>
          );
        }

        const isCurrent = p === page;
        return (
          <button
            key={p}
            type="button"
            className={`pagination__btn ${isCurrent ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        ▶
      </button>
    </nav>
  );
}
