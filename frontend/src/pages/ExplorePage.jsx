import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function ExplorePage() {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await api.get("/users");

      const data =
        response.data?.data || response.data;

      const otherUsers = Array.isArray(data)
        ? data.filter(
            (user) =>
              Number(user.id) !==
              Number(currentUser?.id)
          )
        : [];

      setUsers(otherUsers);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error.response?.data || error
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.username
        ?.toLowerCase()
        .includes(searchText) ||
      user.email
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">

        <h1 className="text-2xl font-bold text-slate-900">
          Explore
        </h1>

        <p className="mt-1 text-slate-500">
          Discover people on Socially.
        </p>

        <div className="mt-6">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by username or email..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 space-y-3">

          {loading ? (
            <p className="text-center text-slate-500">
              Loading users...
            </p>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">
                🔍
              </div>

              <p className="mt-3 font-medium text-slate-700">
                No users found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try searching for another username.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {user.username
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {user.username}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>

                </div>

                <span className="text-sm text-slate-400">
                  User
                </span>

              </div>
            ))
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default ExplorePage;