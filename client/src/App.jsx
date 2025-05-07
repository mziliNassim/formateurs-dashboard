import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import AddCours from "./pages/AddCours.jsx";

import LoadingPage from "./components/LoadingPage.jsx";

const App = () => {
  const [theme] = useState("light");
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);
  }, []);

  if (loadingPage) return <LoadingPage />;

  return (
    <>
      <div className={theme}>
        <div className="dark:bg-gray-800 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard">
              <Route path="" element={<Dashboard />} />
              <Route path="courses/new" element={<AddCours />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster theme={theme} />
        </div>
      </div>
    </>
  );
};

export default App;
