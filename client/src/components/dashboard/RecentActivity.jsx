import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  FilePlus2,
  RefreshCw,
  ChevronRight,
  Calendar,
  Trash2,
} from "lucide-react";

import { serverURL_ACTIVITIES } from "../../assets/data";
import { useSelector } from "react-redux";

function formatTimeSince(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Calculate time differences
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Get remaining time after higher units
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = diffInSeconds % 60;

  // Build the output string
  let output = "Il y a ";

  if (days > 0) {
    output += `${days} jour${days > 1 ? "s" : ""}`;
    if (remainingHours > 0 || remainingMinutes > 0) {
      output += " ";
    }
  }

  if (remainingHours > 0) {
    output += `${remainingHours}h`;
    if (remainingMinutes > 0) {
      output += ` et ${remainingMinutes} min`;
    }
  } else if (minutes > 0) {
    output += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    output += `${remainingSeconds} seconde${remainingSeconds !== 1 ? "s" : ""}`;
  }

  return output;
}

const RecentActivity = () => {
  const { user } = useSelector((state) => state.user);

  const [activities, setActivities] = useState([]);
  const [activitiesNums, setActivitiesNums] = useState(3);
  const [loading, setLoading] = useState(true);

  // fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(serverURL_ACTIVITIES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const activitiesUI = data?.data
          ?.slice(-activitiesNums)
          .reverse()
          .map((activity) => {
            activity.icon =
              activity.type === "Create"
                ? FilePlus2
                : activity.type === "Update"
                ? RefreshCw
                : Trash2;
            activity.color =
              activity.type === "Create"
                ? "text-green-500"
                : activity.type === "Update"
                ? "text-blue-500"
                : "text-red-500";
            activity.time = formatTimeSince(activity.createdAt);
            return activity;
          });
        setActivities(activitiesUI);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Erreur lors de la récupération des activités",
          { action: { label: "✖️" } }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activitiesNums]);

  return (
    <div className="w-full h-full dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          les dernières activités récentes
        </h3>
        <select
          defaultValue={3}
          onChange={(e) => setActivitiesNums(e.target.value)}
          className="border border-gray-200 dark:border-gray-800 text-gray-700 rounded-md p-2 outline-0 flex"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {loading ? (
        <>
          <div className="flex justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </>
      ) : (
        <div className="overflow-y-auto max-h-[250px]">
          {activities?.map((item, i) => (
            <div key={i}>
              <div className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full ${item.color.replace(
                      "text",
                      "bg"
                    )}/10 ${item.color} mr-3`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.time}
                  </span>
                  {item.type !== "Delete" && (
                    <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
