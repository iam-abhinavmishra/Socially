import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function ProfilePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfileData() {
    try {
      const [
        postsResponse,
        followersResponse,
        followingResponse,
      ] = await Promise.all([
        api.get("/posts"),
        api.get(`/follows/followers/${user.id}`),
        api.get(`/follows/following/${user.id}`),
      ]);

      const postsData =
        postsResponse.data?.data || postsResponse.data;

      const followersData =
        followersResponse.data?.data || followersResponse.data;

      const followingData =
        followingResponse.data?.data || followingResponse.data;

      const userPosts = Array.isArray(postsData)
        ? postsData.filter(
            (post) =>
              Number(post.user?.id) === Number(user.id)
          )
        : [];

      setPosts(userPosts);

      setFollowers(
        Array.isArray(followersData)
          ? followersData
          : []
      );

      setFollowing(
        Array.isArray(followingData)
          ? followingData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load profile data:",
        error.response?.data || error
      );

      setPosts([]);
      setFollowers([]);
      setFollowing([]);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== postId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error.response?.data || error
      );

      alert("Failed to delete post");
    }
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

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
              {user.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {user.username}
              </h1>

              <p className="mt-1 text-slate-500">
                {user.email}
              </p>

              <div className="mt-4 flex gap-8 text-sm">

                <div className="text-left">
                  <p className="font-bold text-slate-900">
                    {posts.length}
                  </p>

                  <p className="text-slate-500">
                    Posts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/followers")}
                  className="text-left"
                >
                  <p className="font-bold text-slate-900">
                    {followers.length}
                  </p>

                  <p className="text-slate-500 hover:text-blue-600">
                    Followers
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/following")}
                  className="text-left"
                >
                  <p className="font-bold text-slate-900">
                    {following.length}
                  </p>

                  <p className="text-slate-500 hover:text-blue-600">
                    Following
                  </p>
                </button>

              </div>
            </div>

          </div>
        </section>

        <section className="mt-6">

          <h2 className="text-xl font-bold text-slate-900">
            Your Posts
          </h2>

          <div className="mt-4 space-y-4">

            {loading ? (
              <p className="text-center text-slate-500">
                Loading profile...
              </p>
            ) : posts.length === 0 ? (
              <p className="text-center text-slate-500">
                You haven't created any posts yet.
              </p>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      {post.title && (
                        <h3 className="text-lg font-semibold text-slate-900">
                          {post.title}
                        </h3>
                      )}

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {post.content}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => deletePost(post.id)}
                      className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </article>
              ))
            )}

          </div>
        </section>

      </div>
    </MainLayout>
  );
}

export default ProfilePage;