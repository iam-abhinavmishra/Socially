import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Home", path: "/home", icon: "🏠" },
  { name: "Explore", path: "/explore", icon: "🔍" },
  { name: "Notifications", path: "/notifications", icon: "🔔" },
  { name: "Bookmarks", path: "/bookmarks", icon: "🔖" },
  { name: "Profile", path: "/profile", icon: "👤" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleCreatePost() {
    if (location.pathname === "/home") {
      const postBox = document.getElementById("create-post");

      if (postBox) {
        postBox.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          const textarea = document.getElementById(
            "post-content"
          );

          textarea?.focus();
        }, 500);
      }

      return;
    }

    navigate("/home");

    setTimeout(() => {
      const postBox = document.getElementById("create-post");

      if (postBox) {
        postBox.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        document
          .getElementById("post-content")
          ?.focus();
      }
    }, 300);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white p-5 lg:block">
      <Link
        to="/home"
        className="text-2xl font-bold text-blue-600"
      >
        Socially
      </Link>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleCreatePost}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Create Post
      </button>

      <div className="absolute bottom-6">
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-slate-500 hover:text-red-600"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;