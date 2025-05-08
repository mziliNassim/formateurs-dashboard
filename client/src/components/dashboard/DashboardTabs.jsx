import {
  PieChart as PieChartIcon,
  BookOpen,
  Layers,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex mb-8">
      <button
        className={`flex-1 cursor-pointer py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
          activeTab === "overview"
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => navigate("/dashboard?tab=overview")}
      >
        <PieChartIcon className="w-4 h-4 mr-2" />
        Vue d'ensemble
      </button>
      <button
        className={`flex-1 cursor-pointer py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
          activeTab === "courses"
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => navigate("/dashboard?tab=courses")}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Cours
      </button>
      <button
        className={`flex-1 cursor-pointer py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
          activeTab === "modules"
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => navigate("/dashboard?tab=modules")}
      >
        <Layers className="w-4 h-4 mr-2" />
        Modules
      </button>
    </div>
  );
};

export default DashboardTabs;
