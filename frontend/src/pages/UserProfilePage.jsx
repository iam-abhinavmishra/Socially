import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile =
    Number(currentUser?.id) === Number(userId);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    try {
      setLoading(true);

      const [
        userResponse,
        postsResponse,
        followersResponse,
        followingResponse,
      ] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get("/posts"),
        api.get(`/follows/followers/${userId}`),
        api.get(`/follows/following/${userId}`),
      ]);

      const userData =
        userResponse.data?.data ||
        userResponse.data;

      const postsData =
        postsResponse.data?.data ||
        postsResponse.data;

      const followersData =
        followersResponse.data?.data ||
        followersResponse.data;

      const followingData =
        followingResponse.data?.data ||
        followingResponse.data;

      setProfileUser(userData);

      setPosts(
        Array.isArray(postsData)
          ? postsData.filter(
              (post) =>
                Number(post.user?.id) ===
                Number(userId)
            )
          : []
      );

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

      // Check whether current user follows this profile
      if (!isOwnProfile && currentUser?.id) {
        const currentFollowingResponse =
          await api.get(
            `/follows/following/${currentUser.id}`
          );

        const currentFollowing =
          currentFollowingResponse.data?.data ||
          currentFollowingResponse.data;

        const existingFollow =
          Array.isArray(currentFollowing)
            ? currentFollowing.find(
                (follow) =>
                  Number(follow.following?.id) ===
                  Number(userId)
              )
            : null;

        if (existingFollow) {
          setIsFollowing(true);
          setFollowId(existingFollow.id);
        } else {
          setIsFollowing(false);
          setFollowId(null);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow() {
    if (!currentUser?.id || isOwnProfile) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        await api.delete("/follows", {
          params: {
            followerId: Number(currentUser.id),
            followingId: Number(userId),
          },
        });

        setIsFollowing(false);
        setFollowId(null);

        setFollowers((current) =>
          current.filter(
            (follow) =>
              Number(follow.follower?.id) !==
              Number(currentUser.id)
          )
        );
      } else {
        const response = await api.post(
          "/follows",
          null,
          {
            params: {
              followerId: Number(currentUser.id),
              followingId: Number(userId),
            },
          }
        );

        const newFollow =
          response.data?.data ||
          response.data;

        setIsFollowing(true);
        setFollowId(newFollow?.id || null);

        setFollowers((current) => [
          ...current,
          newFollow,
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to update follow:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update follow"
      );
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl p-6 text-center text-slate-500">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

  if (!profileUser) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl p-6 text-center">
          <p className="text-slate-500">
            User not found.
          </p>

          <button
            onClick={() => navigate("/explore")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Explore
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">

        <button
          onClick={() => navigate(-1)}
          className="mb-5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>

        {/* Profile Header */}
        <section className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
              {profileUser.username
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">

              <h1 className="text-2xl font-bold text-slate-900">
                {profileUser.username}
              </h1>

              <p className="mt-1 text-slate-500">
                {profileUser.email}
              </p>

              <div className="mt-4 flex gap-8 text-sm">

                <div>
                  <p className="font-bold text-slate-900">
                    {posts.length}
                  </p>

                  <p className="text-slate-500">
                    Posts
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {followers.length}
                  </p>

                  <p className="text-slate-500">
                    Followers
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {following.length}
                  </p>

                  <p className="text-slate-500">
                    Following
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Follow button */}
          {!isOwnProfile && (
            <button
              type="button"
              onClick={toggleFollow}
              disabled={followLoading}
              className={
                isFollowing
                  ? "mt-5 w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  : "mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              }
            >
              {followLoading
                ? "Please wait..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
          )}

        </section>

        {/* Posts */}
        <section className="mt-6">

          <h2 className="text-xl font-bold text-slate-900">
            {isOwnProfile
              ? "Your Posts"
              : `${profileUser.username}'s Posts`}
          </h2>

          <div className="mt-4 space-y-4">

            {posts.length === 0 ? (

              <p className="text-center text-slate-500">
                No posts yet.
              </p>

            ) : (

              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >

                  {post.title && (
                    <h3 className="text-lg font-semibold text-slate-900">
                      {post.title}
                    </h3>
                  )}

                  <p className="mt-2 whitespace-pre-wrap text-slate-700">
                    {post.content}
                  </p>

                </article>
              ))

            )}

          </div>

        </section>

      </div>
    </MainLayout>
  );
}

export default UserProfilePage;