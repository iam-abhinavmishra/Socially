import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function UsersPage() {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersResponse, followingResponse] = await Promise.all([
        api.get("/users"),
        api.get(`/follows/following/${currentUser.id}`),
      ]);

      const allUsers =
        usersResponse.data?.data || usersResponse.data;

      const followingData =
        followingResponse.data?.data || followingResponse.data;

      const otherUsers = Array.isArray(allUsers)
        ? allUsers.filter(
            (user) => Number(user.id) !== Number(currentUser.id)
          )
        : [];

      setUsers(otherUsers);

      setFollowing(
        Array.isArray(followingData)
          ? followingData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load users:",
        error.response?.data || error
      );

      setUsers([]);
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  }

  function getFollowRecord(userId) {
    return following.find(
      (follow) =>
        Number(follow.following?.id) === Number(userId)
    );
  }

  async function toggleFollow(targetUser) {
    const existingFollow = getFollowRecord(targetUser.id);

    try {
      if (existingFollow) {
        await api.delete(`/follows/${existingFollow.id}`);

        setFollowing((currentFollowing) =>
          currentFollowing.filter(
            (follow) =>
              follow.id !== existingFollow.id
          )
        );
      } else {
        const response = await api.post("/follows", {
          follower: {
            id: Number(currentUser.id),
          },
          following: {
            id: Number(targetUser.id),
          },
        });

        const newFollow =
          response.data?.data || response.data;

        setFollowing((currentFollowing) => [
          ...currentFollowing,
          newFollow,
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to update follow:",
        error.response?.data || error
      );

      alert("Failed to update follow");
    }
  }

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      const username =
        user.username?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      return (
        username.includes(searchText) ||
        email.includes(searchText)
      );
    });
  }, [users, search]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Discover People
        </h1>

        <p className="mt-1 text-slate-500">
          Find people and connect with them.
        </p>

        <div className="mt-5">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by username or email..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="text-center text-slate-500">
              Loading users...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-slate-500">
              {search.trim()
                ? "No users found."
                : "No other users found."}
            </p>
          ) : (
            filteredUsers.map((user) => {
              const existingFollow =
                getFollowRecord(user.id);

              const isFollowing =
                Boolean(existingFollow);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                      {user.username
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-slate-900">
                        {user.username}
                      </h2>

                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFollow(user)
                    }
                    className={
                      isFollowing
                        ? "ml-3 shrink-0 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                        : "ml-3 shrink-0 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                    }
                  >
                    {isFollowing
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default UsersPage;