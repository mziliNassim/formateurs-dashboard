import {
  BookOpen,
  Clock,
  FileText,
  Eye,
  Users,
  Trash2,
  Edit2,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";

const CourseTable = ({ courses }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Titre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Format
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Durée
            </th>
            <th
              scope="col"
              colSpan={3}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {courses.map((course) => (
            <tr
              key={course._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.titre}
                    </div>
                    {/* <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1"> */}
                    {/* {course.description} */}
                    {/* </div> */}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.formatContenu === "video"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                      : course.formatContenu === "texte"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  }`}
                >
                  {course.formatContenu}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {course.statut}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duree || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                <Link
                  to={`/dashboard/courses/${course._id}`}
                  className="text-indigo-600  dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  <Eye className="h-5 w-5" />
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                <Link
                  to={`/dashboard/courses/edit/${course._id}`}
                  className="text-green-600  dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                >
                  <Edit className="h-5 w-5" />
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                <Link
                  to={`/dashboard/courses/delete/${course._id}`}
                  className="text-red-600  dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
