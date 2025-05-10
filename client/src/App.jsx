import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import AddCours from "./pages/AddCours.jsx";

import Profile from "./pages/Profile.jsx";
import Formateurs from "./pages/Formateurs.jsx";
import CreateFormateur from "./pages/CreateFormateur.jsx";
import UpdateFormateur from "./pages/UpdateFormateur.jsx";

import CoursDetails from "./pages/CoursDetails.jsx";
import CoursUpdate from "./pages/CoursUpdate.jsx";
import CoursDelete from "./pages/CoursDelete.jsx";

import Login from "./pages/Login.jsx";
import LoadingPage from "./components/LoadingPage.jsx";
import { serverURL_AUTH } from "./assets/data.js";
import { clearUser, setUser } from "./features/UserSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";

const App = () => {
  const [theme] = useState("light");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // check local storage (user && theme)
  useEffect(() => {
    const checkLocalStorage = async () => {
      setLoading(true);
      // check local storage for user
      const user = localStorage.getItem("user");
      if (user) {
        // Valid Token
        const parsedUser = JSON.parse(user);
        const token = parsedUser?.token;

        try {
          const response = await axios.get(
            `${serverURL_AUTH}/validToken/${token}`
          );

          if (response.data?.success) {
            const res = await axios.get(`${serverURL_AUTH}/infos`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            // set user data in global data (redux)
            dispatch(setUser({ ...res?.data?.data, token }));
          } else dispatch(clearUser());
        } catch (error) {
          // Clear local storage
          dispatch(clearUser());
        }
      }

      setLoading(false);
    };
    checkLocalStorage();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className={theme}>
        <div className="dark:bg-gray-800 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard">
              <Route path="" element={<Dashboard />} />

              <Route path="formateurs" element={<Formateurs />} />
              <Route path="create-formateur" element={<CreateFormateur />} />
              <Route
                path="update-formateur/:id"
                element={<UpdateFormateur />}
              />
              <Route path="profile" element={<Profile />} />

              <Route path="courses/new" element={<AddCours />} />

              <Route path="courses/:id" element={<CoursDetails />} />
              <Route path="courses/edit/:id" element={<CoursUpdate />} />
              <Route path="courses/delete/:id" element={<CoursDelete />} />
            </Route>

            <Route path="auth">
              <Route path="" element={<Login />} />
              <Route path="login" element={<Login />} />
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
