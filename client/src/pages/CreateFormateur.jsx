import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  Globe,
  Github,
  Linkedin,
  LayoutDashboard,
  ChevronDown,
  Shield,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CreateFormateur = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    adresse: "",
    role: "formateur", // Default role
    socials: {
      website: "",
      github: "",
      linkedin: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    if (!user || user?.role !== "admin") navigate("/dashboard");
  }, []);

  const roles = [
    {
      value: "admin",
      label: "Administrateur",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      value: "formateur",
      label: "Formateur",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("socials.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setShowRoleDropdown(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fName.trim()) newErrors.fName = "Prénom requis";
    if (!formData.lName.trim()) newErrors.lName = "Nom requis";
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      toast.success("Formateur créé avec succès", {
        description: "Le formateur sera créé dans quelques secondes",
        action: { label: "✖️" },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating formateur:", error);
      toast.error(
        "Une erreur s'est produite lors de la création du formateur",
        {
          description: "Veuillez réessayer plus tard",
          action: { label: "✖️" },
        }
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 4000);
    }
  };

  const selectedRole = roles.find((role) => role.value === formData.role);

  // Form field styling utility
  const getInputStyles = (fieldName) => {
    return errors[fieldName]
      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
      : "border-gray-200 focus:border-violet-500 focus:ring-violet-500";
  };

  const progressPercentage =
    Object.entries({
      fName: formData.fName,
      lName: formData.lName,
      email: formData.email,
      password: formData.password,
    }).filter(([_, value]) => value.length > 0).length * 25;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <DashboardHeader
          action="/dashboard"
          Icon={LayoutDashboard}
          title="Dashboard"
        />

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 group flex items-center text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-8 text-white relative">
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      Créer un nouveau compte
                    </h1>
                    <p className="text-indigo-200 mt-1">
                      Remplissez les informations pour créer un nouvel
                      utilisateur
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="md:w-48">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progression</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Main Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <User className="h-5 w-5 text-violet-600" />
                  <h2 className="text-lg font-medium text-gray-800">
                    Informations principales
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="fName"
                        value={formData.fName}
                        onChange={handleChange}
                        className={`pl-10 w-full rounded-lg border-2 ${getInputStyles(
                          "fName"
                        )} py-2.5 bg-white hover:border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Prénom"
                      />
                    </div>
                    {errors.fName && (
                      <div className="flex items-center mt-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <p>{errors.fName}</p>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="lName"
                        value={formData.lName}
                        onChange={handleChange}
                        className={`pl-10 w-full rounded-lg border-2 ${getInputStyles(
                          "lName"
                        )} py-2.5 bg-white hover:border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-opacity-50`}
                        placeholder="Nom"
                      />
                    </div>
                    {errors.lName && (
                      <div className="flex items-center mt-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <p>{errors.lName}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 w-full rounded-lg border-2 ${getInputStyles(
                          "email"
                        )} py-2.5 bg-white hover:border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-opacity-50`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center mt-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <p>{errors.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 w-full rounded-lg border-2 ${getInputStyles(
                          "password"
                        )} py-2.5 bg-white hover:border-gray-300 transition-all duration-300 focus:ring-2 focus:ring-opacity-50`}
                        placeholder="••••••"
                      />
                    </div>
                    {errors.password && (
                      <div className="flex items-center mt-1.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1.5" />
                        <p>{errors.password}</p>
                      </div>
                    )}
                    {formData.password && formData.password.length >= 6 && (
                      <div className="flex items-center mt-1.5 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        <p>Mot de passe valide</p>
                      </div>
                    )}
                  </div>

                  {/* Role Select */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full flex items-center justify-between pl-3 pr-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 bg-white transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <div className="p-1.5 bg-violet-100 rounded-md mr-3">
                            {selectedRole.icon}
                          </div>
                          <div className="text-left">
                            <span className="block font-medium">
                              {selectedRole.label}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                            showRoleDropdown ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      {showRoleDropdown && (
                        <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-lg py-1 border border-gray-100 animation-fade-in">
                          {roles.map((role) => (
                            <div
                              key={role.value}
                              onClick={() => selectRole(role.value)}
                              className={`flex items-center px-4 py-3 hover:bg-violet-50 cursor-pointer transition-colors ${
                                formData.role === role.value
                                  ? "bg-violet-50"
                                  : ""
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-md mr-3 ${
                                  formData.role === role.value
                                    ? "bg-violet-200"
                                    : "bg-gray-100"
                                }`}
                              >
                                {role.icon}
                              </div>
                              <div className="text-left">
                                <span className="block font-medium">
                                  {role.label}
                                </span>
                              </div>
                              {formData.role === role.value && (
                                <CheckCircle className="h-4 w-4 text-violet-600 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-2 border-gray-200 py-2.5 bg-white hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300"
                        placeholder="Adresse"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Globe className="h-5 w-5 text-violet-600" />
                  <h2 className="text-lg font-medium text-gray-800">
                    Réseaux sociaux
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Website */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site web
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                        </div>
                        <input
                          type="url"
                          name="socials.website"
                          value={formData.socials.website}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-lg border-2 border-gray-200 py-2.5 bg-white hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300"
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                        </div>
                        <input
                          type="url"
                          name="socials.github"
                          value={formData.socials.github}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-lg border-2 border-gray-200 py-2.5 bg-white hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300"
                          placeholder="https://github.com/"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                        </div>
                        <input
                          type="url"
                          name="socials.linkedin"
                          value={formData.socials.linkedin}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-lg border-2 border-gray-200 py-2.5 bg-white hover:border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300"
                          placeholder="https://linkedin.com/in/"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 cursor-pointer border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 cursor-pointer py-3 rounded-lg font-medium text-white ${
                    isSubmitting
                      ? "bg-violet-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Création en cours...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Créer l'utilisateur
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animation-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default CreateFormateur;
