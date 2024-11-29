import React from 'react';


const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="pagination">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          className={currentPage === number ? 'active' : ''}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
