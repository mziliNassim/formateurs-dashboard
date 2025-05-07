import { BookMarked, Clock, Layers, TrendingUp } from "lucide-react";

const StatsCards = ({ courses }) => {
  const statCards = [
    {
      title: "Total des cours",
      value: courses.length,
      icon: <BookMarked className="h-6 w-6 text-blue-600" />,
      color:
        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
    },
    {
      title: "Durée cumulée",
      value: `${courses.reduce((acc, course) => acc + course.duree, 0)} min`,
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      color:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
    },
    {
      title: "Formats différents",
      value: new Set(courses.map((c) => c.formatContenu)).size,
      icon: <Layers className="h-6 w-6 text-rose-600" />,
      color:
        "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50",
    },
    {
      title: "Popularité",
      value: "98%",
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      color:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl border ${card.color} transition-all duration-300 hover:shadow-md flex items-center`}
        >
          <div className="mr-4 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            {card.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
