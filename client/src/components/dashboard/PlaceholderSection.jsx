const PlaceholderSection = ({ icon: Icon, title, description, buttonText }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
    <Icon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
      {title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
      {buttonText}
    </button>
  </div>
);

export default PlaceholderSection;
