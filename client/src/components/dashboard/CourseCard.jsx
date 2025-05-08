import { Link } from "react-router-dom";
import {
  Video,
  FileText,
  Image as ImageIcon,
  FileIcon,
  Clock,
  ArrowUpRight,
  Trash2,
  Edit,
} from "lucide-react";

const FORMAT_ICONS = {
  video: <Video className="w-5 h-5" />,
  texte: <FileText className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  pdf: <FileIcon className="w-5 h-5" />,
};

const FORMAT_COLORS = {
  video: "from-blue-500 to-indigo-600",
  texte: "from-emerald-500 to-teal-600",
  image: "from-pink-500 to-rose-600",
  pdf: "from-amber-500 to-orange-600",
};

const STATUS_COLORS = {
  Brouillon:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800",
  formateur:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
  admin:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800",
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  }
  return `${mins}m`;
};

export const CourseCard = ({ course }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
    <div
      className={`h-2 bg-gradient-to-r ${FORMAT_COLORS[course.formatContenu]}`}
    ></div>
    <div className="p-5 h-full flex flex-col justify-between">
      {/* cours */}
      <div className="h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
              {FORMAT_ICONS[course.formatContenu]}
            </div>
            <div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  STATUS_COLORS[course.statut]
                }`}
              >
                {course.statut}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(course.duree)}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {course.titre}
        </h3>
        {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {course.description}
        </p> */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Link
          to={`/dashboard/courses/${course._id}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center"
        >
          Voir le cours <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>

        <div className="flex items-center justify-center gap-2">
          <Link
            to={`/dashboard/courses/edit/${course._id}`}
            className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 flex items-center"
          >
            <Edit className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to={`/dashboard/courses/delete/${course._id}`}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center"
          >
            <Trash2 className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);
