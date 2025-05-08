import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { serverURL_COURSES } from "../assets/data";
import { toast } from "sonner";
import {
  Clock,
  CalendarDays,
  BookOpen,
  Tag,
  FileText,
  Video,
  Image as ImageIcon,
  FileDigit,
  ArrowLeft,
  Edit2,
  ExternalLink,
  Upload,
  CheckCircle,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import LoadingPage from "../components/LoadingPage";

function getEmbeddableUrl(url) {
  if (!url) return "";

  // Cas d'un lien youtu.be
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Cas d'un lien youtube.com/watch?v=...
  if (url.includes("watch?v=")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Sinon, retourner tel quel
  return url;
}

const CoursDetails = () => {
  const { id } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [cours, setCours] = useState(null);

  useEffect(() => {
    fetchCours();
  }, [id]);

  const fetchCours = async () => {
    setLoading(true);
    setLoadingPage(true);
    try {
      const { data } = await axios.get(`${serverURL_COURSES}/${id}`);
      setCours(data.data);
      console.log(" fetchCours ~ data.data:", data.data);
    } catch (error) {
      console.log("useEffect ~ error:", error);
      toast.error("Erreur lors du chargement de cours", {
        description: error?.response?.data?.message || "",
        action: { label: "✖️" },
      });
    } finally {
      setLoading(false);
      setLoadingPage(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await axios.patch(`${serverURL_COURSES}/${id}`, {
        statut: "Publié",
      });
      toast.success("Cours publié avec succès", {
        action: { label: "✓" },
      });
      fetchCours(); // Refresh course data
    } catch (error) {
      console.log("handlePublish ~ error:", error);
      toast.error("Erreur lors de la publication", {
        description: error?.response?.data?.message || "",
        action: { label: "✖️" },
      });
    } finally {
      setPublishing(false);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "video":
        return <Video className="h-6 w-6 text-blue-500" />;
      case "texte":
        return <FileText className="h-6 w-6 text-green-500" />;
      case "image":
        return <ImageIcon className="h-6 w-6 text-purple-500" />;
      case "pdf":
        return <FileDigit className="h-6 w-6 text-red-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loadingPage) return <LoadingPage />;

  if (!cours) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 py-16">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-medium text-red-700 dark:text-red-300 mb-2">
            Cours non trouvé
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">
            Le cours que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/dashboard?tab=courses"
            className="inline-flex items-center px-4 py-2 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste des cours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />

      {loadingPage ? (
        <LoadingPage />
      ) : !cours ? (
        <div className="flex flex-col items-center justify-center min-h-96 py-16">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg max-w-lg text-center">
            <h2 className="text-xl font-medium text-red-700 dark:text-red-300 mb-2">
              Cours non trouvé
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              Le cours que vous cherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              to="/dashboard?tab=courses"
              className="inline-flex items-center px-4 py-2 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste des cours
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Back button */}
          <Link
            to="/dashboard?tab=courses"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 group transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste des cours
          </Link>

          {/* Course header section */}
          <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900 p-6 mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/5 dark:bg-black/5 backdrop-blur-3xl"></div>

            {/* Status badge */}
            <div className="relative">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  cours.statut === "Brouillon"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {cours.statut === "Brouillon" ? "Brouillon" : "Publié"}
                {cours.statut === "Brouillon" ? null : (
                  <CheckCircle className="ml-1 h-3.5 w-3.5" />
                )}
              </div>

              {/* Format badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ml-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {getFormatIcon(cours.formatContenu)}
                <span className="ml-1 capitalize">{cours.formatContenu}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 relative">
              {cours.titre}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 relative">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span>{cours.duree} minutes</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{new Date(cours.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Module: {cours?.module?.titre}</span>
              </div>
            </div>

            {/* Publish button for drafts */}
            {cours.statut === "Brouillon" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 text-white font-medium rounded-lg transition-colors relative disabled:opacity-70"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Publier ce cours
                  </>
                )}
              </button>
            )}
          </div>

          {/* Content section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Left column - Description */}
            <div className="md:col-span-2">
              {/* description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  Description
                </h2>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html:
                      cours.description ||
                      "Aucune description disponible pour ce cours.",
                  }}
                />
              </div>

              {/* Content  */}
              <div className="mt-6">
                {cours.formatContenu === "image" ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      Contenu du cours
                    </h2>
                    <div className="flex justify-center">
                      {cours.contenu ? (
                        <img
                          src={cours.contenu}
                          alt={cours.titre}
                          className="rounded-lg max-w-full h-auto shadow-md"
                        />
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          Aucune image disponible pour ce cours.
                        </div>
                      )}
                    </div>
                  </div>
                ) : cours.formatContenu === "texte" ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                      Contenu du cours
                    </h2>
                    <div
                      className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{
                        __html:
                          cours.contenu ||
                          "Aucun contenu disponible pour ce cours.",
                      }}
                    />
                  </div>
                ) : cours.formatContenu === "video" ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Video className="h-5 w-5 mr-2 text-indigo-500" />
                      Contenu du cours
                    </h2>
                    <div className="aspect-w-16 aspect-h-9">
                      {cours.contenu ? (
                        <div className="w-full">
                          <iframe
                            // src="https://player.vimeo.com/video/1017406920?h=dc40c2f818"
                            src={getEmbeddableUrl(cours.contenu)}
                            title={cours.titre}
                            allowFullScreen
                            className="w-full rounded-lg shadow-md aspect-video"
                          ></iframe>
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          Aucune vidéo disponible pour ce cours.
                        </div>
                      )}
                    </div>
                  </div>
                ) : cours.formatContenu === "pdf" ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FileDigit className="h-5 w-5 mr-2 text-indigo-500" />
                      Contenu du cours
                    </h2>
                    <div className="flex flex-col items-center">
                      {cours.contenu ? (
                        <div className="w-full h-screen">
                          <object
                            data={cours.contenu}
                            type="application/pdf"
                            width="100%"
                            // height="100%"
                            className="rounded-lg shadow-md h-full"
                          >
                            <div className="text-center py-4">
                              <p className="mb-4">
                                Le PDF ne peut pas être affiché directement.
                              </p>
                              <a
                                href={cours.contenu}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ouvrir le PDF
                              </a>
                            </div>
                          </object>
                        </div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          Aucun PDF disponible pour ce cours.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right column - Information and actions */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-indigo-500" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cours.tags && cours.tags.length > 0 ? (
                    cours.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full px-3 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      Aucun tag associé
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursDetails;
