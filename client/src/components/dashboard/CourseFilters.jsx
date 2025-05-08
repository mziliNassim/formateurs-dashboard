import { useState } from "react";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Grid2X2,
  List,
  Table,
} from "lucide-react";

const CourseFilters = ({
  searchTerm,
  setSearchTerm,
  filterFormat,
  setFilterFormat,
  sortOrder,
  toggleSortOrder,
  refreshData,
  viewMode = "table",
  setViewMode,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-grow w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Rechercher par titre, description ou tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 w-full">
        <div className="relative w-full">
          <select
            className="appearance-none block cursor-pointer w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
          >
            <option value="">Tous les formats</option>
            <option value="video">Vidéo</option>
            <option value="texte">Texte</option>
            <option value="image">Image</option>
            <option value="pdf">PDF</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/*  view mode  */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            className={`p-1.5 cursor-pointer rounded-md ${
              viewMode === "grid"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>

          <button
            className={`p-1.5 cursor-pointer rounded-md ${
              viewMode === "table"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setViewMode("table")}
            title="Table view"
          >
            <Table className="h-4 w-4" />
          </button>
        </div>

        {/* Sort toggle */}
        <button
          className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Ordre</span>
        </button>

        {/* Refresh button */}
        <button
          className="cursor-pointer flex items-center justify-center gap-1 px-3 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
          onClick={refreshData}
        >
          <div className="flex items-center justify-center">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </div>
        </button>
      </div>
    </div>
  </div>
);

export default CourseFilters;
