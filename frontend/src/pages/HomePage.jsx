import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const response = await api.get(`/feed/${user.id}`);
      const data = response.data?.data || response.data;

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function createPost(event) {
    event.preventDefault();

    if (!content.trim() || !user?.id) return;

    try {
      const response = await api.post("/posts", {
        title: title.trim(),
        content: content.trim(),
        userId: Number(user.id),
      });

      const newPost = response.data?.data || response.data;

      setPosts((currentPosts) => [
        newPost,
        ...currentPosts,
      ]);

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(
        "Failed to create post:",
        error.response?.data || error
      );

      alert("Failed to create post");
    }
  }

  async function toggleLike(postId) {
    try {
      await api.post("/likes", {
        userId: Number(user.id),
        postId: Number(postId),
      });

      loadPosts();
    } catch (error) {
      console.error(
        "Failed to like post:",
        error.response?.data || error
      );

      alert("Failed to like post");
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Home
        </h1>

        <form
          id="create-post"
          onSubmit={createPost}
          className="mt-5 rounded-xl bg-white p-5 shadow-sm"
        >
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Post title (optional)"
            className="mb-3 w-full border-b border-slate-200 p-2 text-lg font-semibold text-slate-800 outline-none"
          />

          <textarea
            id="post-content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="What is happening?"
            maxLength={500}
            className="min-h-28 w-full resize-none border-0 p-2 text-slate-800 outline-none"
          />

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-500">
              {content.length}/500
            </p>

            <button
              type="submit"
              disabled={!content.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </form>

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-center text-slate-500">
              Loading posts...
            </p>
          ) : posts.length === 0 ? (
            <p className="text-center text-slate-500">
              No posts yet.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                onLike={toggleLike}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function PostCard({ post, user, onLike }) {
  const [showComments, setShowComments] =
    useState(false);

  const [comments, setComments] =
    useState([]);

  const [commentText, setCommentText] =
    useState("");

  const [bookmarked, setBookmarked] =
    useState(false);

  const author =
    post.user?.username ||
    post.username ||
    "User";

  async function loadComments() {
    try {
      const response =
        await api.get("/comments");

      const data =
        response.data?.data ||
        response.data;

      const postComments =
        Array.isArray(data)
          ? data.filter(
              (comment) =>
                Number(
                  comment.post?.id ||
                    comment.postId
                ) === Number(post.id)
            )
          : [];

      setComments(postComments);
      setShowComments(true);
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );
    }
  }

  async function addComment(event) {
    event.preventDefault();

    if (!commentText.trim() || !user?.id) {
      return;
    }

    try {
      const response =
        await api.post("/comments", {
          content: commentText.trim(),
          userId: Number(user.id),
          postId: Number(post.id),
        });

      const newComment =
        response.data?.data ||
        response.data;

      setComments((currentComments) => [
        ...currentComments,
        newComment,
      ]);

      setCommentText("");
    } catch (error) {
      console.error(
        "Failed to add comment:",
        error.response?.data || error
      );

      alert("Failed to add comment");
    }
  }

  async function toggleBookmark() {
    if (!user?.id) return;

    try {
      if (bookmarked) {
        await api.delete("/bookmarks", {
          params: {
            userId: Number(user.id),
            postId: Number(post.id),
          },
        });

        setBookmarked(false);
      } else {
        await api.post(
          "/bookmarks",
          null,
          {
            params: {
              userId: Number(user.id),
              postId: Number(post.id),
            },
          }
        );

        setBookmarked(true);
      }
    } catch (error) {
      console.error(
        "Failed to update bookmark:",
        error.response?.data || error
      );

      alert("Failed to update bookmark");
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          {author.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900">
              {author}
            </p>

            <span className="text-sm text-slate-500">
              @{author}
            </span>
          </div>

          {post.title && (
            <h2 className="mt-3 text-lg font-semibold text-slate-900">
              {post.title}
            </h2>
          )}

          <p className="mt-3 whitespace-pre-wrap text-slate-700">
            {post.content}
          </p>

          <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">

            <button
              type="button"
              onClick={loadComments}
              className="hover:text-blue-600"
            >
              💬 Comment ({comments.length})
            </button>

            <button
              type="button"
              onClick={() => onLike(post.id)}
              className="hover:text-red-600"
            >
              ♡ Like
            </button>

            <button
              type="button"
              onClick={toggleBookmark}
              className={
                bookmarked
                  ? "font-medium text-blue-600"
                  : "hover:text-blue-600"
              }
            >
              {bookmarked
                ? "🔖 Bookmarked"
                : "🔖 Bookmark"}
            </button>

            <button
              type="button"
              className="hover:text-green-600"
            >
              ↗ Share
            </button>

          </div>

          {showComments && (
            <div className="mt-5 border-t border-slate-100 pt-4">

              <form
                onSubmit={addComment}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(
                      event.target.value
                    )
                  }
                  placeholder="Write a comment..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Send
                </button>
              </form>

              <div className="mt-4 space-y-3">

                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => {
                    const commentUser =
                      comment.user?.username ||
                      comment.username ||
                      "User";

                    return (
                      <div
                        key={comment.id}
                        className="rounded-lg bg-slate-50 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {commentUser}
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}

export default HomePage;