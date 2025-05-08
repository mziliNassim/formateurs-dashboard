import { FilePlus2, Eye, Code, LogOut, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardHeader = ({ action, Icon, title }) => {
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    window.alert(" handleLogout ~ logout:");
  };

  // Fallback avatar if no profile picture
  const getAvatar = () => {
    if (user?.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
        {user?.fName?.charAt(0)}
        {user?.lName?.charAt(0)}
      </div>
    );
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      <div className="absolute h-full w-full bg-gradient-to-b from-black/5 to-black/30"></div>

      {/* Floating circles */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-10 right-1/3 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User info and actions section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4 backdrop-blur-sm bg-white/10 p-3 rounded-xl">
            {getAvatar()}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.fName} {user?.lName}
              </h2>
              <p className="text-indigo-200 text-sm capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Admin-only button */}
            {user?.role === "admin" && (
              <Link
                to="/dashboard/create-formateur"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white transition-all flex items-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Créer formateur
              </Link>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white transition-all flex items-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Dashboard title and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Tableau de bord
              <span className="block text-lg font-medium text-indigo-200 mt-1">
                Gestion des cours et modules
              </span>
            </h1>
          </div>

          <div className="flex space-x-4">
            <Link
              to={action}
              className="px-5 py-2.5 cursor-pointer bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg font-medium text-gray-900 transition-all flex items-center"
            >
              <Icon className="w-5 h-5 mr-2" />
              {title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
