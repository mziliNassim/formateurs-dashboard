import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { compressImage, encodeToBase64 } from "../utils/Base64.js";

import {
  Camera,
  Upload,
  Github,
  User,
  Mail,
  MapPin,
  Loader,
  LinkIcon,
  Lock,
  Linkedin,
  Globe,
  FileText,
  LayoutDashboard,
} from "lucide-react";

import { serverURL_AUTH } from "../assets/data.js";

import { setUser } from "../features/UserSlice.js";
import Sidebar from "../components/Sidebar.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";

const ProfileEditPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    profilePic: user?.profilePic || "",
    fName: user?.fName || "",
    lName: user?.lName || "",
    email: user?.email || "",
    adresse: user?.adresse || "",
    socials: {
      linkedin: user?.socials?.linkedin || "",
      website: user?.socials?.website || "",
      github: user?.socials?.github || "",
      bio: user?.socials?.bio || "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Authentification Required
  useEffect(() => {
    if (!user) {
      toast.error("Accès refusé", {
        description: "Vous devez être connecté pour accéder à cette page",
        action: { label: "✖️" },
      });
      window.location.href = "/";
    }
  }, [user]);

  // fetch user infos
  const fetchUserInfos = async () => {
    setLoading(true);
    try {
      const { data } = await axios(`${serverURL_AUTH}/infos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setFormData({
        fName: data?.data?.fName || "",
        lName: data?.data?.lName || "",
        email: data?.data?.email || "",
        adresse: data?.data?.adresse || "",
        socials: {
          linkedin: data?.data?.socials?.linkedin || "",
          website: data?.data?.socials?.website || "",
          github: data?.data?.socials?.github || "",
          bio: data?.data?.socials?.bio || "",
        },
      });

      dispatch(setUser({ ...data?.data, token: user?.token }));
    } catch (error) {
      toast.error("Erreur", {
        description:
          error?.response?.data?.message ||
          "Impossible de récupérer vos informations",
        action: { label: "✖️" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfos();
  }, []);

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Social Form Change
  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      socials: {
        ...formData.socials,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileBase64 = await encodeToBase64(file);
      setFormData({ ...formData, profilePic: fileBase64 });
      toast.success("Image chargée", {
        description: "L'image a été chargée avec succès",
        action: { label: "✖️" },
      });
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de charger l'image",
        action: { label: "✖️" },
      });
    }
  };

  // handle profile form submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Ensure formData only contains allowed fields
      const allowedUpdates = [
        "profilePic", // base64
        "fName",
        "lName",
        "email",
        "adresse",
        "socials",
      ];

      const filteredData = {};
      Object.keys(formData).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          filteredData[key] = formData[key];
        }
      });

      // Compress profile picture if it exists
      if (formData.profilePic && formData.profilePic.startsWith("data:image")) {
        filteredData.profilePic = await compressImage(formData.profilePic);
      }

      // Send the PUT request with the filtered data
      const { data } = await axios.put(
        `${serverURL_AUTH}/profile`,
        filteredData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success(data?.message || "Mise à jour réussie", {
        description: "Votre profil a été mis à jour avec succès",
        action: { label: "✖️" },
      });

      fetchUserInfos();
    } catch (error) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Une erreur est survenue lors de la mise à jour du profil",
        action: { label: "✖️" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // handle password form submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning("Alert", {
        description: "Les mots de passe ne correspondent pas",
        action: { label: "✖️" },
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 8 caractères",
        action: { label: "✖️" },
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const { data } = await axios.put(
        `${serverURL_AUTH}/password`,
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été mis à jour avec succès",
        action: { label: "✖️" },
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Erreur", {
        description:
          error.response?.data?.message ||
          "Impossible de mettre à jour votre mot de passe",
        action: { label: "✖️" },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render profile form
  const renderProfileForm = () => (
    <form className="p-6 space-y-6" onSubmit={handleProfileSubmit}>
      {/* name */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prénom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={formData?.fName}
              name="fName"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              onChange={handleChange}
              name="lName"
              value={formData?.lName}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-gray-400" size={20} />
          </div>
          <input
            type="email"
            onChange={handleChange}
            name="email"
            value={formData?.email}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
          />
        </div>
      </div>

      {/* adresse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={formData?.adresse}
            onChange={handleChange}
            name="adresse"
            placeholder="Votre adresse"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <LinkIcon className="mr-2 text-blue-500" size={20} />
          Réseaux sociaux et bio
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Linkedin className="text-gray-400" size={20} />
              </div>
              <input
                type="url"
                value={formData.socials.linkedin}
                name="linkedin"
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/in/votre-profile"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Web
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="text-gray-400" size={20} />
              </div>
              <input
                type="url"
                value={formData.socials.website}
                name="website"
                onChange={handleSocialChange}
                placeholder="https://votre-site.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="text-gray-400" size={20} />
              </div>
              <input
                type="url"
                value={formData.socials.github}
                name="github"
                onChange={handleSocialChange}
                placeholder="https://github.com/votre-username"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="text-gray-400" size={20} />
            </div>
            <textarea
              value={formData.socials.bio}
              name="bio"
              onChange={handleSocialChange}
              placeholder="Parlez-nous un peu de vous..."
              rows="4"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
            />
          </div>
        </div>
      </div>

      {/* picture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Photo de profil
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-400 to-blue-500 p-1">
            <img
              src={
                formData?.profilePic ||
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${user?.nom}&background=random`
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".png, .jpg, jpeg, .ico"
              onChange={(e) => handleImageUpload(e)}
              name="profilePic"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md"
            >
              <Upload className="mr-2" size={20} />
              Télécharger
            </button>
          </div>
        </div>
      </div>

      {/* submit button */}
      <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
        <button
          disabled={submitLoading}
          type="submit"
          className="w-fit px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
        >
          {submitLoading ? (
            <div className="flex justify-center items-center">
              <Loader className="h-5 w-5 text-white animate-spin" />
            </div>
          ) : (
            <>
              <Camera size={20} />
              <span>Mettre à jour le profil</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  // Render password form
  const renderPasswordForm = () => (
    <form className="p-6 space-y-6" onSubmit={handlePasswordSubmit}>
      <div className="space-y-4 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Lock className="mr-2 text-blue-500" size={20} />
          Mettre à jour le mot de passe
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400" size={20} />
            </div>
            <input
              type="password"
              value={passwordData.oldPassword}
              name="oldPassword"
              onChange={handlePasswordChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                value={passwordData.newPassword}
                name="newPassword"
                onChange={handlePasswordChange}
                required
                minLength="8"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Au moins 8 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                value={passwordData.confirmPassword}
                name="confirmPassword"
                onChange={handlePasswordChange}
                required
                minLength="8"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* submit button */}
      <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
        <button
          disabled={submitLoading}
          type="submit"
          className="w-fit px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
        >
          {submitLoading ? (
            <div className="flex justify-center items-center">
              <Loader className="h-5 w-5 text-white animate-spin" />
            </div>
          ) : (
            <>
              <Lock size={20} />
              <span>Mettre à jour le mot de passe</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="md:w-3/4 h-fit bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                <User className="mr-3 text-blue-500" size={24} />
                Éditer le profil
              </h2>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  setActiveTab("profile");
                }}
                className={`px-6 py-3 font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === "profile"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <User size={18} />
                <span>Informations du profil</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("password");
                }}
                className={`px-6 py-3 font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === "password"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Lock size={18} />
                <span>Mot de passe</span>
              </button>
            </div>

            {/* content */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "profile" && renderProfileForm()}
                {activeTab === "password" && renderPasswordForm()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
