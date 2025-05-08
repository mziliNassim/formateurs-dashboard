import React, { useEffect, useState } from "react";
import { BookOpen, FilePlus2 } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import DashboardTabs from "../components/dashboard/DashboardTabs.jsx";
import StatsCards from "../components/dashboard/StatsCards.jsx";
import ChartsSection from "../components/dashboard/ChartsSection.jsx";
import RecentActivity from "../components/dashboard/RecentActivity.jsx";
import CourseFilters from "../components/dashboard/CourseFilters.jsx";
import CourseList from "../components/dashboard/CourseList.jsx";
import Pagination from "../components/dashboard/Pagination.jsx";
import PlaceholderSection from "../components/dashboard/PlaceholderSection.jsx";
import ModulesSection from "../components/dashboard/ModulesSection.jsx";

import { serverURL_COURSES, serverURL_MODULES } from "../assets/data";
import LoadingPage from "../components/LoadingPage.jsx";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFormat, setFilterFormat] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    totalCourses: 0,
    formatDistribution: [],
    coursesByStatus: [],
    recentActivity: [],
    moduleData: [],
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/auth");
  }, []);

  // set active tab
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "courses" || tab === "modules") {
      setActiveTab(tab);
      return;
    }
    setActiveTab("overview");
  }, [searchParams, location]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingPage(true);
        setLoadingCourses(true);
        const { data } = await axios.get(
          `${serverURL_COURSES}?page=${currentPage}&sortBy=ordrePublication&order=${sortOrder}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (data.success) {
          setCourses(data.data);
          setFilteredCourses(data.data);
          setTotalPages(data.totalPages);
          calculateStats(data.data, data.total);
        } else {
          toast.error("Erreur lors du chargement des cours", {
            action: { label: "✖️" },
          });
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des cours", {
          description: error?.response?.data?.message || "",
          action: {
            label: "Réessayer",
            onClick: () => setRefreshKey((prev) => prev + 1),
          },
        });
      } finally {
        setLoadingPage(false);
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [currentPage, sortOrder, refreshKey]);

  // Calculate stats for charts
  const calculateStats = (coursesData, totalCount) => {
    // Format distribution
    const formatCounts = coursesData.reduce((acc, course) => {
      acc[course.formatContenu] = (acc[course.formatContenu] || 0) + 1;
      return acc;
    }, {});

    const formatDistribution = Object.entries(formatCounts).map(
      ([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })
    );

    // Status distribution
    const statusCounts = coursesData.reduce((acc, course) => {
      acc[course.statut] = (acc[course.statut] || 0) + 1;
      return acc;
    }, {});

    const coursesByStatus = Object.entries(statusCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Recent activity (mock data for demo)
    const recentActivity = [
      { date: "2025-05-01", count: 12 },
      { date: "2025-05-02", count: 8 },
      { date: "2025-05-03", count: 15 },
      { date: "2025-05-04", count: 10 },
      { date: "2025-05-05", count: 18 },
      { date: "2025-05-06", count: 23 },
    ];

    // Module distribution (mock data for demo)
    const moduleData = [
      { name: "JavaScript", value: 24 },
      { name: "Python", value: 18 },
      { name: "React", value: 16 },
      { name: "Node.js", value: 22 },
      { name: "HTML/CSS", value: 14 },
    ];

    setStats({
      totalCourses: totalCount || coursesData.length,
      formatDistribution,
      coursesByStatus,
      recentActivity,
      moduleData,
    });
  };

  // Filter courses based on search term and format filter
  useEffect(() => {
    if (!courses.length) return;

    let filtered = [...courses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.tags &&
            course.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Apply format filter
    if (filterFormat) {
      filtered = filtered.filter(
        (course) => course.formatContenu === filterFormat
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, filterFormat, courses]);

  // Handle sort order change
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle page change
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle refresh data
  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("Données actualisées", { action: { label: "✖️" } });
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <StatsCards courses={courses} />
            <ChartsSection stats={stats} />
            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
              <RecentActivity />

              <div className="w-full min-h-[320px]">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                      Cours populaires
                    </h3>
                  </div>
                  <div className="p-6">
                    {courses.slice(0, 4).map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-medium mr-3">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.titre}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {course.formatContenu}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "courses":
        return (
          <>
            <CourseFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterFormat={filterFormat}
              setFilterFormat={setFilterFormat}
              sortOrder={sortOrder}
              toggleSortOrder={toggleSortOrder}
              refreshData={refreshData}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <CourseList
              loadingCourses={loadingCourses}
              filteredCourses={filteredCourses}
              viewMode={viewMode}
            />
            {filteredCourses.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                changePage={changePage}
              />
            )}
          </>
        );
      case "modules":
        return <ModulesSection />;
      default:
        return null;
    }
  };

  if (loadingPage) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        action="/dashboard/courses/new"
        Icon={FilePlus2}
        title="Nouveau cours"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
