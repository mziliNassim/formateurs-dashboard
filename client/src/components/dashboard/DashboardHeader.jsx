import axios from "axios";
import { FilePlus2, Eye, Code, LogOut, UserPlus, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { serverURL_AUTH } from "../../assets/data";
import { toast } from "sonner";
import { clearUser } from "../../features/userSlice";
import { useState } from "react";

const DashboardHeader = ({ action, Icon, title }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const { data } = await axios.post(
        `${serverURL_AUTH}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success(data?.message || "Déconnexion réussie", {
        action: { label: "✖️" },
      });
      dispatch(clearUser());
      navigate("/auth");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la déconnexion",
        { action: { label: "✖️" } }
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      <div className="absolute h-full w-full bg-gradient-to-b from-black/5 to-black/30" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Section: Avatar + Buttons */}
        {user && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            {/* User info */}
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-4 backdrop-blur-sm bg-white/10 p-3 rounded-xl"
            >
              <img
                src={
                  user?.profilePic ||
                  `https://ui-avatars.com/api/?name=${
                    user?.fName + " " + user?.lName
                  }&background=random`
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {user?.fName} {user?.lName}
                </h2>
                <p className="text-indigo-200 text-sm capitalize">
                  {user?.role}
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {user?.role === "admin" && (
                <Link
                  to="/dashboard/formateurs"
                  className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white transition-all flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Formateurs
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full sm:w-auto px-4 py-2 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium text-white transition-all flex items-center justify-center"
              >
                {logoutLoading ? (
                  <span className="w-5 h-5 border-r border-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogOut className="w-5 h-5 mr-2" />
                    Déconnexion
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Title + Main Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Tableau de bord
            </h1>
            <p className="text-lg font-medium text-indigo-200 mt-1">
              Gestion des cours et modules
            </p>
          </div>

          {user && (
            <Link
              to={action}
              className="px-5 py-2.5 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg font-medium text-gray-900 transition-all flex items-center"
            >
              <Icon className="w-5 h-5 mr-2" />
              {title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
