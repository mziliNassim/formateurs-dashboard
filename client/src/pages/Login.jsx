import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LayoutDashboard, Eye, EyeOff, Loader2 } from "lucide-react";

import { serverURL_AUTH } from "../assets/data";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/UserSlice";

const Login = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("nassimmzili9@gmail.com");
  const [password, setPassword] = useState("AZE123aze");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${serverURL_AUTH}/login`, {
        email,
        password,
      });

      if (data.success) {
        console.log("handleLogin ~ data:", data);
        toast.success("Connexion réussie", {
          description: "Bienvenue sur votre tableau de bord",
          action: { label: "✖️" },
        });

        dispatch(setUser({ ...data?.data?.user, token: data?.data?.token }));
        navigate("/dashboard");
      } else {
        toast.error("Erreur lors de la connexion", {
          description:
            error?.response?.data?.message || "Vérifiez vos identifiants",
          action: { label: "✖️" },
        });
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion", {
        description:
          error?.response?.data?.message || "Vérifiez vos identifiants",
        action: { label: "✖️" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader
        action="/dashboard"
        Icon={LayoutDashboard}
        title="Dashboard"
      />

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 border border-gray-300 p-5 rounded-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Ou{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                créez un nouveau compte
              </a>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md
                           placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white
                           bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="nom@exemple.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={visiblePassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md
                             placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white
                             bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePassword(!visiblePassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {visiblePassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md
                         text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
