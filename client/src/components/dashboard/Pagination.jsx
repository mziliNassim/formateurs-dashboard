const Pagination = ({ currentPage, totalPages, changePage }) => (
  <div className="flex justify-center mt-8">
    <nav className="inline-flex rounded-md shadow-sm -space-x-px">
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 ${
          currentPage === 1
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        Précédent
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 ${
            page === currentPage
              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border-indigo-500 dark:border-indigo-700"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 ${
          currentPage === totalPages
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        Suivant
      </button>
    </nav>
  </div>
);

export default Pagination;
