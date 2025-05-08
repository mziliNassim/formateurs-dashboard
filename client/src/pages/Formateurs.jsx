import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import {
  ArrowLeft,
  LayoutDashboard,
  UserPlus,
  Users,
  Grid,
  List,
  Loader2,
  Trash2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { toast } from "sonner";
import axios from "axios";
import { serverURL_USERS } from "../assets/data";

const Formateurs = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'rows'

  useEffect(() => {
    if (!user || user?.role !== "admin") navigate("/dashboard");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${serverURL_USERS}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUsers(data?.data);
        toast.success("Utilisateurs chargés avec succès !");
      } catch (error) {
        console.error("useEffect ~ error:", error);
        toast.error("Erreur lors du chargement des utilisateurs !");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get initials from first and last name
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Handle delete formateur
  const handleDeleteFormateur = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce formateur ?")) {
      try {
        await axios.delete(`${serverURL_USERS}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
        toast.success("Formateur supprimé avec succès !");
      } catch (error) {
        console.log("Delete error:", error);
        toast.error("Erreur lors de la suppression du formateur");
      }
    }
  };

  // Social media icon selector
  const getSocialIcon = (platform) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 group flex items-center text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Retour au tableau de bord
        </button>

        <div className="flex flex-col md:flex-row items-start justify-center gap-5">
          <Sidebar />

          <div className="w-full md:w-8/12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-8 text-white relative">
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Formateurs</h1>
                    <p className="text-indigo-200 mt-1">
                      {users.length - 1} formateur
                      {users.length - 1 !== 1 ? "s" : ""} disponible
                      {users.length - 1 !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`cursor-pointer p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-white/30 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    } transition-all`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("rows")}
                    className={`cursor-pointer p-2 rounded-lg ${
                      viewMode === "rows"
                        ? "bg-white/30 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    } transition-all`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/create-formateur")}
                    className="cursor-pointer ml-2 bg-white text-violet-700 hover:bg-violet-50 flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des formateurs */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
                  <span className="ml-2 text-gray-600 font-medium">
                    Chargement des formateurs...
                  </span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Aucun formateur trouvé.
                  </p>
                  <button
                    onClick={() => navigate("/dashboard/create-formateur")}
                    className="mt-4 cursor-pointer bg-violet-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-violet-700 transition-colors inline-flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un formateur
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                // Grid View (Cards)
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {users?.map((formateur) => {
                    if (formateur?._id !== user?._id)
                      return (
                        <>
                          <div
                            key={formateur._id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-center relative">
                              <span
                                className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                                  formateur.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {formateur.active ? "Actif" : "Inactif"}
                              </span>
                              {formateur.profilePic ? (
                                <img
                                  src={formateur.profilePic}
                                  alt={`${formateur.fName} ${formateur.lName}`}
                                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-indigo-600">
                                  {getInitials(
                                    formateur.fName,
                                    formateur.lName
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="p-6 h-full">
                              <div className="space-y-3 text-sm">
                                <h3 className="font-semibold text-xl text-center text-gray-800 mb-3">
                                  {formateur.fName} {formateur.lName}
                                </h3>
                                <div className="flex items-start">
                                  <Mail className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                  <p className="text-gray-600 break-all">
                                    {formateur.email}
                                  </p>
                                </div>

                                {formateur.adresse && (
                                  <div className="flex items-start">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <p className="text-gray-600">
                                      {formateur.adresse}
                                    </p>
                                  </div>
                                )}

                                {/* Social Media Links */}
                                {formateur.socials &&
                                  Object.entries(formateur.socials).filter(
                                    ([key, value]) =>
                                      key !== "bio" &&
                                      value &&
                                      value.trim() !== ""
                                  ).length > 0 && (
                                    <div className="flex items-center justify-center space-x-2 pt-2">
                                      {Object.entries(formateur.socials).map(
                                        ([platform, link]) =>
                                          platform !== "bio" &&
                                          link &&
                                          link.trim() !== "" ? (
                                            <a
                                              key={platform}
                                              href={
                                                link.startsWith("http")
                                                  ? link
                                                  : `https://${link}`
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                              title={platform}
                                            >
                                              {getSocialIcon(platform)}
                                            </a>
                                          ) : null
                                      )}
                                    </div>
                                  )}
                              </div>

                              <div className="mt-6 mb-0 flex justify-center space-x-2">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/update-formateur/${formateur._id}`
                                    )
                                  }
                                  className="cursor-pointer px-3 py-1.5 flex items-center text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteFormateur(formateur._id)
                                  }
                                  className="cursor-pointer px-3 py-1.5 flex items-center text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    else return null;
                  })}
                </div>
              ) : (
                // Rows View (Table)
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Formateur
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Réseaux
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((formateur) => {
                        if (formateur?._id !== user?._id)
                          return (
                            <tr
                              key={formateur._id}
                              className="hover:bg-gray-50"
                            >
                              {/* Formateur Info */}
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  {formateur.profilePic ? (
                                    <img
                                      src={formateur.profilePic}
                                      alt={`${formateur.fName} ${formateur.lName}`}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
                                      {getInitials(
                                        formateur.fName,
                                        formateur.lName
                                      )}
                                    </div>
                                  )}
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {formateur.fName} {formateur.lName}
                                    </div>
                                    {formateur.socials?.bio && (
                                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                        {formateur.socials.bio}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Contact Info */}
                              <td className="py-4 px-4">
                                <div className="text-sm">
                                  <div className="flex items-center text-gray-500 mb-1">
                                    <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                    <a
                                      href={`mailto:${formateur.email}`}
                                      className="hover:text-indigo-600"
                                    >
                                      {formateur.email}
                                    </a>
                                  </div>
                                </div>
                              </td>

                              {/* Social Networks */}
                              <td className="py-4 px-4">
                                {formateur.socials &&
                                Object.entries(formateur.socials).filter(
                                  ([key, value]) =>
                                    key !== "bio" &&
                                    value &&
                                    value.trim() !== ""
                                ).length > 0 ? (
                                  <div className="flex items-center space-x-2">
                                    {Object.entries(formateur.socials).map(
                                      ([platform, link]) =>
                                        platform !== "bio" &&
                                        link &&
                                        link.trim() !== "" ? (
                                          <a
                                            key={platform}
                                            href={
                                              link.startsWith("http")
                                                ? link
                                                : `https://${link}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                            title={platform}
                                          >
                                            {getSocialIcon(platform)}
                                          </a>
                                        ) : null
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 italic">
                                    Aucun
                                  </span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    formateur.active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {formateur.active ? "Actif" : "Inactif"}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 text-right text-sm font-medium">
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/update-formateur//${formateur._id}`
                                      )
                                    }
                                    className="cursor-pointer text-blue-600 hover:text-blue-900 flex items-center"
                                  >
                                    <Edit className="h-3.5 w-3.5 mr-1" />
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteFormateur(formateur._id)
                                    }
                                    className="cursor-pointer text-red-600 hover:text-red-900 flex items-center"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Supprimer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        else return null;
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formateurs;
