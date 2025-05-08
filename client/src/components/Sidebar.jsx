import React from "react";
import { Users, LogOut, UserPlus, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-fit w-full md:w-auto  bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-violet-500 px-4 py-6 text-white text-center">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-violet-400 border-4 border-violet-300 overflow-hidden">
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${
                  user?.fName + " " + user?.lName
                }&background=random`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-2xl font-bold tracking-wide">
          {user?.fName + " " + user?.lName}
        </h2>
        <p className="text-violet-200">{user?.role}</p>
      </div>

      {/* Navigation Links */}
      <div className="py-2">
        <NavItem link="profile" icon={<User />} label="Profile" />
        <NavItem link="formateurs" icon={<Users />} label="Formateurs" />
        <NavItem
          link="create-formateur"
          icon={<UserPlus />}
          label="Ajouter Formateur"
        />

        <div className="my-2 border-t border-gray-100"></div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, link, className = "" }) => {
  return (
    <Link
      to={`/dashboard/${link}`}
      className={`flex items-center px-6 py-3 cursor-pointer text-gray-600  hover:bg-violet-50 transition-colors ${className}`}
    >
      <div className="text-violet-500 mr-3">{icon}</div>
      <span className="">{label}</span>
    </Link>
  );
};

export default Sidebar;
