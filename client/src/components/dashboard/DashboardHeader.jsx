import { FilePlus2, Eye, Code } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = ({ action, Icon, title }) => {
  console.log(" DashboardHeader ~ icon:", Icon);
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px]"></div>
      <div className="absolute h-full w-full bg-gradient-to-b from-black/5 to-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Tableau de bord
            <span className="block text-lg font-medium text-indigo-200 mt-1">
              Gestion des cours et modules
            </span>
          </h1>
          <div className="mt-6 flex space-x-4">
            <Link
              to={action}
              className="px-5 py-2.5 cursor-pointer bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg font-medium text-gray-900 transition-all flex items-center"
            >
              <Icon className="w-5 h-5 mr-2" />
              {title}
            </Link>
            {/* <button className="px-5 py-2.5 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white border border-white/30 transition-all flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Aperçu
            </button> */}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
            <Code className="h-24 w-24 text-white/80" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-10 right-1/3 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
    </div>
  );
};

export default DashboardHeader;
