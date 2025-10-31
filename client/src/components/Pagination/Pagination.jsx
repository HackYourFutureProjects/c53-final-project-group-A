import "./Pagination.css";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ← Prev
      </button>
      <div className="page-numbers">
        {[...Array(totalPages)].map((_, page) => (
          <button
            key={page + 1}
            onClick={() => onPageChange(page + 1)}
            className={`page-number-btn ${currentPage === page + 1 ? "active" : ""}`}
          >
            {page + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next →
      </button>
    </div>
  );
}
