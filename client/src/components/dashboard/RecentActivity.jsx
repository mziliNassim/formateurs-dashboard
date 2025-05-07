import {
  FilePlus2,
  RefreshCw,
  Layers,
  Eye,
  ChevronRight,
  Calendar,
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      action: "Nouveau cours créé",
      title: "Introduction à React Hooks",
      time: "Il y a 2 heures",
      icon: <FilePlus2 className="w-4 h-4" />,
      color: "text-green-500",
    },
    {
      action: "Cours mis à jour",
      title: "Les bases de Node.js",
      time: "Il y a 5 heures",
      icon: <RefreshCw className="w-4 h-4" />,
      color: "text-blue-500",
    },
    {
      action: "Module créé",
      title: "Frontend Avancé",
      time: "Il y a 1 jour",
      icon: <Layers className="w-4 h-4" />,
      color: "text-purple-500",
    },
    {
      action: "Cours publié",
      title: "CSS Grid Layout",
      time: "Il y a 2 jours",
      icon: <Eye className="w-4 h-4" />,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Activité récente
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((item, i) => (
          <div
            key={i}
            className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full ${item.color.replace(
                  "text",
                  "bg"
                )}/10 ${item.color} mr-3`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.action}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.title}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.time}
              </span>
              <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
