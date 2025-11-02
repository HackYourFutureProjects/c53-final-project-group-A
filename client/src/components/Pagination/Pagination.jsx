import "./Pagination.css";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // normalize totalPages to an integer >= 0
  const safeTotal = Number.isFinite(totalPages)
    ? Math.max(0, Math.floor(totalPages))
    : 0;

  const pagesToShow =
    safeTotal > 3 ? [1, 2, 3] : [...Array(safeTotal)].map((_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || safeTotal === 0}
        className="pagination-btn"
      >
        ← Prev
      </button>

      <div className="page-numbers">
        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`page-number-btn ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        ))}

        {safeTotal > 3 && (
          <span className="ellipsis" aria-hidden="true">
            ...
          </span>
        )}
      </div>

      <button
        // always go to next page (clamped to safeTotal)
        onClick={() => onPageChange(Math.min(currentPage + 1, safeTotal))}
        disabled={currentPage >= safeTotal || safeTotal === 0}
        className="pagination-btn"
      >
        Next →
      </button>
    </div>
  );
}
