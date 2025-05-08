import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { LayoutDashboard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverURL_COURSES } from "../assets/data";
import { toast } from "sonner";
import LoadingPage from "../components/LoadingPage";
import { useSelector } from "react-redux";

const CoursDelete = () => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const deleteCours = async () => {
      try {
        setLoadingPage(true);
        const { data } = await axios.delete(`${serverURL_COURSES}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        toast.success(data?.message || "Cours est bien supprimer", {
          action: { label: "✖️" },
        });
        navigate("/dashboard?tab=courses");
      } catch (error) {
        toast.error("Impossible de supprimer le cours", {
          action: { label: "✖️" },
        });
      } finally {
        setLoadingPage(false);
      }
    };
    deleteCours();
  }, []);

  if (loadingPage) return <LoadingPage />;

  return (
    <>
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />
    </>
  );
};

export default CoursDelete;
