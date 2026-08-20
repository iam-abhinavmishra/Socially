import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function ConnectionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = location.pathname.includes("followers")
    ? "followers"
    : "following";

  useEffect(() => {
    if (user?.id) {
      loadConnections();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadConnections() {
    try {
      const response = await api.get(
        `/follows/${type}/${user.id}`
      );

      const data = response.data?.data || response.data;

      setConnections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load connections:",
        error.response?.data || error
      );

      setConnections([]);
    } finally {
      setLoading(false);
    }
  }

  function getConnectionUser(follow) {
    return type === "followers"
      ? follow.follower
      : follow.following;
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6">
          Please log in first.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <button
          onClick={() => navigate("/profile")}
          className="mb-5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Profile
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          {type === "followers" ? "Followers" : "Following"}
        </h1>

        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="text-center text-slate-500">
              Loading...
            </p>
          ) : connections.length === 0 ? (
            <p className="text-center text-slate-500">
              No {type} yet.
            </p>
          ) : (
            connections.map((follow) => {
              const connectionUser =
                getConnectionUser(follow);

              if (!connectionUser) return null;

              return (
                <div
                  key={follow.id}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {connectionUser.username
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {connectionUser.username}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {connectionUser.email}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ConnectionsPage;