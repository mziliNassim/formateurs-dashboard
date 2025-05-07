import {
  PieChart as PieChartIcon,
  BookOpen,
  Layers,
  Users,
} from "lucide-react";

const DashboardTabs = ({ activeTab, setActiveTab }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex mb-8">
    <button
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
        activeTab === "overview"
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
      onClick={() => setActiveTab("overview")}
    >
      <PieChartIcon className="w-4 h-4 mr-2" />
      Vue d'ensemble
    </button>
    <button
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
        activeTab === "courses"
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
      onClick={() => setActiveTab("courses")}
    >
      <BookOpen className="w-4 h-4 mr-2" />
      Cours
    </button>
    <button
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
        activeTab === "modules"
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
      onClick={() => setActiveTab("modules")}
    >
      <Layers className="w-4 h-4 mr-2" />
      Modules
    </button>
    <button
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex justify-center items-center transition-all ${
        activeTab === "users"
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
      onClick={() => setActiveTab("users")}
    >
      <Users className="w-4 h-4 mr-2" />
      Utilisateurs
    </button>
  </div>
);

export default DashboardTabs;
