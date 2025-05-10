import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "react-simple-wysiwyg";
import { toast } from "sonner";
import {
  BookOpen,
  Video,
  FileText,
  Image as ImageIcon,
  FileIcon,
  Clock,
  Tag,
  Save,
  X,
  ChevronDown,
  Loader2,
  LayoutDashboard,
  Plus,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";

import { serverURL_COURSES, serverURL_MODULES } from "../assets/data";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useSelector } from "react-redux";

const AddCours = () => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [courseData, setCourseData] = useState({
    titre: "Cours 1",
    description: "<p>Décrivez le contenu et les objectifs de ce cours...</p>",
    formatContenu: "texte",
    contenu: "",
    duree: 30,
    ordrePublication: 1,
    module: "",
    statut: "Brouillon",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [modules, setModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const formatOptions = [
    { value: "video", label: "Vidéo", icon: <Video className="w-5 h-5" /> },
    { value: "texte", label: "Texte", icon: <FileText className="w-5 h-5" /> },
    { value: "image", label: "Image", icon: <ImageIcon className="w-5 h-5" /> },
    { value: "pdf", label: "PDF", icon: <FileIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    setCourseData((prev) => ({
      ...prev,
      contenu: "",
    }));
  }, [courseData.formatContenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormTouched(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type based on formatContenu
    if (courseData.formatContenu === "pdf" && !file.type.includes("pdf")) {
      toast.error("Veuillez sélectionner un fichier PDF", {
        action: { label: "✖️" },
      });
      return;
    }

    if (courseData.formatContenu === "image" && !file.type.includes("image")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, JPEG)", {
        action: { label: "✖️" },
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCourseData((prev) => ({
        ...prev,
        contenu: event.target.result, // This will be the base64 string
      }));
      setFormTouched(true);
    };

    if (file.type.includes("image") || file.type.includes("pdf")) {
      reader.readAsDataURL(file);
    } else if (file.type.includes("video")) {
      setCourseData((prev) => ({
        ...prev,
        contenu: file,
      }));
      setFormTouched(true);
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !courseData.tags.includes(tagInput.trim())) {
      setCourseData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setCourseData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare form data based on content type
      let formData;

      if (
        courseData.formatContenu === "video" &&
        courseData.contenu instanceof File
      ) {
        // For video files, use FormData
        formData = new FormData();

        // Add the video file
        formData.append("video", courseData.contenu);

        // Append all other fields (except contenu which we've handled separately)
        Object.keys(courseData).forEach((key) => {
          if (key !== "contenu") {
            // Handle special cases for objects and arrays
            if (
              typeof courseData[key] === "object" &&
              courseData[key] !== null &&
              !(courseData[key] instanceof File)
            ) {
              formData.append(key, JSON.stringify(courseData[key]));
            } else {
              formData.append(key, courseData[key]);
            }
          }
        });
        formData = courseData;
      } else {
        // For other formats, send as JSON with base64 content
        formData = courseData;
      }

      const { data } = await axios.post(serverURL_COURSES, formData, {
        headers: {
          "Content-Type":
            courseData.formatContenu === "video" &&
            courseData.contenu instanceof File
              ? undefined
              : "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (data.success) {
        toast.success("Cours créé avec succès", { action: { label: "✖️" } });
        navigate("/dashboard");
      } else {
        toast.error("Erreur lors de la création du cours", {
          action: { label: "✖️" },
        });
      }
    } catch (error) {
      console.error("handleSubmit error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { action: { label: "✖️" } });
      } else {
        toast.error("Une erreur est survenue lors de la création du cours", {
          action: { label: "✖️" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    setIsLoadingModules(true);
    try {
      const { data } = await axios.get(serverURL_MODULES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setModules(data?.data || []);
    } catch (error) {
      toast.error("Impossible de charger les modules", {
        action: { label: "✖️" },
      });
    } finally {
      setIsLoadingModules(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Calculate progress percentage
  const calculateProgress = () => {
    let filledFields = 0;
    let totalRequiredFields = 6; // titre, description, formatContenu, contenu, duree, ordrePublication

    if (courseData.titre) filledFields++;
    if (courseData.description) filledFields++;
    if (courseData.formatContenu) filledFields++;
    if (courseData.contenu) filledFields++;
    if (courseData.duree > 0) filledFields++;
    if (courseData.ordrePublication > 0) filledFields++;

    return Math.floor((filledFields / totalRequiredFields) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with progress */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-indigo-600 p-3 rounded-lg mr-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Création d'un cours
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Remplissez les informations pour créer votre nouveau cours
              </p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300">
                Complété à {progress}%
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="hidden md:flex justify-center mb-8">
          <div className="flex items-center w-full max-w-3xl">
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveStep(1)}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep >= 1
                    ? "border-indigo-600 bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-900/30"
                    : "border-gray-300 dark:border-gray-600"
                } mb-2 cursor-pointer`}
              >
                <span className="text-lg font-semibold">1</span>
              </div>
              <span className="text-sm font-medium">Informations</span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 ${
                activeStep >= 2
                  ? "bg-indigo-600 dark:bg-indigo-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep >= 2
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400"
              }`}
              onClick={() =>
                courseData.titre && courseData.description
                  ? setActiveStep(2)
                  : null
              }
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep >= 2
                    ? "border-indigo-600 bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-900/30"
                    : "border-gray-300 dark:border-gray-600"
                } mb-2 cursor-pointer ${
                  courseData.titre && courseData.description ? "" : "opacity-50"
                }`}
              >
                <span className="text-lg font-semibold">2</span>
              </div>
              <span className="text-sm font-medium">Contenu</span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 ${
                activeStep >= 3
                  ? "bg-indigo-600 dark:bg-indigo-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep >= 3
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400"
              }`}
              onClick={() => (courseData.contenu ? setActiveStep(3) : null)}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  activeStep >= 3
                    ? "border-indigo-600 bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-900/30"
                    : "border-gray-300 dark:border-gray-600"
                } mb-2 cursor-pointer ${
                  courseData.contenu ? "" : "opacity-50"
                }`}
              >
                <span className="text-lg font-semibold">3</span>
              </div>
              <span className="text-sm font-medium">Organisation</span>
            </div>
          </div>
        </div>

        {/* Main form card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            <div className={`${activeStep === 1 ? "block" : "hidden"} p-8`}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                  Informations générales
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Définissez les caractéristiques principales de votre cours
                </p>
              </div>

              {/* Titre */}
              <div className="mb-6">
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Titre du cours *
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={courseData.titre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Ex: Introduction à React"
                />
              </div>

              {/* Description */}
              <div className="mb-8">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description *
                </label>
                <Editor
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  className="w-full min-h-[200px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Décrivez le contenu et les objectifs de ce cours..."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Une bonne description aide les étudiants à comprendre ce
                  qu'ils vont apprendre
                </p>
                {/* WYSIWYG */}
                {/* <RichTextEditorDemo
                  setCourseData={setCourseData}
                  courseData={courseData}
                /> */}
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tags{" "}
                  <span className="text-gray-500 dark:text-gray-400 font-normal">
                    (optionnel)
                  </span>
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleTagAdd())
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                      placeholder="Ajouter des tags..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {courseData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-sm transition-all duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {courseData.tags.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Ajoutez des tags pour améliorer la découvrabilité de votre
                      cours
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  disabled={!courseData.titre || !courseData.description}
                  className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Suivant
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 2: Content */}
            <div className={`${activeStep === 2 ? "block" : "hidden"} p-8`}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                  Contenu du cours
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Définissez le type et le contenu de votre cours
                </p>
              </div>

              {/* Format du contenu */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Format du contenu *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formatOptions.map((format) => (
                    <div
                      key={format.value}
                      onClick={() =>
                        setCourseData((prev) => ({
                          ...prev,
                          formatContenu: format.value, // ["pdf", "image", "video", "text"]
                        }))
                      }
                      className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        courseData.formatContenu === format.value
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 transform scale-[1.02] shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="formatContenu"
                        value={format.value}
                        checked={courseData.formatContenu === format.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          courseData.formatContenu === format.value
                            ? "bg-indigo-100 dark:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {format.icon}
                      </div>
                      <span
                        className={`font-medium ${
                          courseData.formatContenu === format.value
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {format.label}
                      </span>
                      {courseData.formatContenu === format.value && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 absolute top-2 right-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu spécifique au format */}
              <div className="mb-6">
                <label
                  htmlFor="contenu"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {courseData.formatContenu === "video" && "Lien de la vidéo"}
                  {courseData.formatContenu === "texte" && "Contenu textuel"}
                  {courseData.formatContenu === "image" && "URL de l'image"}
                  {courseData.formatContenu === "pdf" && "Fichier PDF"} *
                </label>
                {courseData.formatContenu === "texte" ? (
                  <textarea
                    id="contenu"
                    name="contenu"
                    value={courseData.contenu}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="Entrez le contenu détaillé de votre cours..."
                  />
                ) : courseData.formatContenu === "video" ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Video className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="videoUrl"
                        name="videoUrl"
                        value={
                          typeof courseData.contenu === "string"
                            ? courseData.contenu
                            : ""
                        }
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            contenu: e.target.value,
                          }))
                        }
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      OU
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="videoFile"
                        name="videoFile"
                        onChange={handleFileChange}
                        accept="video/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-white dark:hover:file:bg-gray-500"
                      />
                      {courseData.contenu instanceof File && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Fichier sélectionné: {courseData.contenu.name}
                        </p>
                      )}
                    </div>
                  </div>
                ) : courseData.formatContenu === "image" ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={
                          typeof courseData.contenu === "string"
                            ? courseData.contenu
                            : ""
                        }
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            contenu: e.target.value,
                          }))
                        }
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      OU
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-white dark:hover:file:bg-gray-500"
                      />
                      {courseData.contenu &&
                        typeof courseData.contenu === "string" &&
                        courseData.contenu.startsWith("data:image") && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              Aperçu:
                            </p>
                            <img
                              src={courseData.contenu}
                              alt="Preview"
                              className="max-h-40 rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="pdfUrl"
                        name="pdfUrl"
                        value={
                          typeof courseData.contenu === "string" &&
                          !courseData.contenu.startsWith("data:")
                            ? courseData.contenu
                            : ""
                        }
                        onChange={(e) =>
                          setCourseData((prev) => ({
                            ...prev,
                            contenu: e.target.value,
                          }))
                        }
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>

                    <div className="text-center text-gray-500 dark:text-gray-400">
                      OU
                    </div>

                    <div className="relative">
                      <input
                        type="file"
                        id="pdfFile"
                        name="pdfFile"
                        onChange={handleFileChange}
                        accept=".pdf,application/pdf"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-white dark:hover:file:bg-gray-500"
                      />
                      {courseData.contenu instanceof File && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Fichier sélectionné : {courseData?.contenu?.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {courseData.formatContenu === "video" && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="w-4 h-4 mr-1" /> Supporté: YouTube, Vimeo,
                    ou lien direct MP4
                  </p>
                )}
              </div>

              <div className="pt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  disabled={!courseData.contenu}
                  className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Suivant
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 3: Organization */}
            <div className={`${activeStep === 3 ? "block" : "hidden"} p-8`}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                  Organisation et paramètres
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Définissez comment votre cours sera organisé et publié
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Durée */}
                <div>
                  <label
                    htmlFor="duree"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Durée estimée (minutes) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="duree"
                      name="duree"
                      min="1"
                      value={courseData.duree}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Temps estimé pour compléter ce cours
                  </p>
                </div>

                {/* Ordre de publication */}
                <div>
                  <label
                    htmlFor="ordrePublication"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Ordre de publication *
                  </label>
                  <input
                    type="number"
                    id="ordrePublication"
                    name="ordrePublication"
                    min="1"
                    value={courseData.ordrePublication}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Position dans la liste des cours (1 = premier)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Module */}
                <div>
                  <label
                    htmlFor="module"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Module{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      (optionnel)
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="module"
                      name="module"
                      value={courseData.module}
                      onChange={handleChange}
                      className="appearance-none w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    >
                      <option value="">Sélectionner un module</option>
                      {isLoadingModules ? (
                        <option disabled>Chargement des modules...</option>
                      ) : (
                        modules.map((module) => (
                          <option key={module._id} value={module._id}>
                            {module.titre}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Regrouper ce cours dans un module spécifique
                  </p>
                </div>

                {/* Statut */}
                <div>
                  <label
                    htmlFor="statut"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Statut de publication *
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        courseData.statut === "Brouillon"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="statut"
                        value="Brouillon"
                        checked={courseData.statut === "Brouillon"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Brouillon</span>
                    </label>

                    <label
                      className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        courseData.statut === "Publié"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="statut"
                        value="Publié"
                        checked={courseData.statut === "Publié"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Publié</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {courseData.statut === "Brouillon"
                      ? "Le cours ne sera pas visible par les étudiants"
                      : "Le cours sera visible par les étudiants"}
                  </p>
                </div>
              </div>{" "}
              <div className="pt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200"
                >
                  Retour
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCourseData({
                        titre: "",
                        description: "",
                        formatContenu: "video",
                        contenu: "",
                        duree: 30,
                        ordrePublication: 1,
                        module: "",
                        statut: "Brouillon",
                        tags: [],
                      });
                      setActiveStep(1);
                    }}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || progress < 100}
                    className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer le cours
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCours;
