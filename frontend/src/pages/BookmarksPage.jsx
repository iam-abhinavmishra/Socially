import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (user?.id) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadBookmarks() {
    try {
      const response = await api.get(
        `/bookmarks/user/${user.id}`
      );

      const data =
        response.data?.data || response.data;

      setBookmarks(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load bookmarks:",
        error.response?.data || error
      );

      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(postId) {
    try {
      await api.delete("/bookmarks", {
        params: {
          userId: Number(user.id),
          postId: Number(postId),
        },
      });

      setBookmarks((currentBookmarks) =>
        currentBookmarks.filter(
          (bookmark) =>
            Number(bookmark.post?.id) !==
            Number(postId)
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove bookmark:",
        error.response?.data || error
      );

      alert("Failed to remove bookmark");
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">

        <h1 className="text-2xl font-bold text-slate-900">
          Bookmarks
        </h1>

        <p className="mt-1 text-slate-500">
          Posts you have saved for later.
        </p>

        <div className="mt-6 space-y-4">

          {loading ? (
            <p className="text-center text-slate-500">
              Loading bookmarks...
            </p>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-slate-700">
                No bookmarks yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Save posts to read them later.
              </p>
            </div>
          ) : (
            bookmarks.map((bookmark) => {
              const post = bookmark.post;

              if (!post) return null;

              const author =
                post.user?.username ||
                "Unknown User";

              return (
                <article
                  key={bookmark.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {author.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {author}
                          </p>

                          <p className="text-sm text-slate-500">
                            @{author}
                          </p>
                        </div>
                      </div>

                      {post.title && (
                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                          {post.title}
                        </h2>
                      )}

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {post.content}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeBookmark(post.id)
                      }
                      className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>
                </article>
              );
            })
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default BookmarksPage;