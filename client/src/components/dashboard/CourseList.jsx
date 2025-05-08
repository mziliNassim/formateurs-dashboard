import { Loader2, BookOpen, Grid2X2, List, Table } from "lucide-react";
import { CourseCard } from "./CourseCard";
import CourseTable from "./CourseTable"; // We'll create this

const CourseList = ({ loadingCourses, filteredCourses, viewMode }) => {
  if (loadingCourses) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-indigo-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Aucun cours trouvé
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Essayez de modifier vos critères de recherche ou de filtrage
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      {viewMode === "table" && <CourseTable courses={filteredCourses} />}
    </div>
  );
};

export default CourseList;
