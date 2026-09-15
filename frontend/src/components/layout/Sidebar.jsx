import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Home", path: "/home", icon: "🏠" },
  { name: "Explore", path: "/explore", icon: "🔍" },
  { name: "Notifications", path: "/notifications", icon: "🔔" },
  { name: "Bookmarks", path: "/bookmarks", icon: "🔖" },
  { name: "Profile", path: "/profile", icon: "👤" },
];

function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleCreatePost() {
    closeMobileMenu();

    if (location.pathname === "/home") {
      const postBox = document.getElementById("create-post");

      if (postBox) {
        postBox.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          document
            .getElementById("post-content")
            ?.focus();
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

    closeMobileMenu();
    navigate("/login");
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          border-r border-slate-200 bg-white p-5
          transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo / mobile close */}
        <div className="flex items-center justify-between">
          <Link
            to="/home"
            onClick={closeMobileMenu}
            className="text-2xl font-bold text-blue-600"
          >
            Socially
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-10 space-y-2">
          {menuItems.map((item) => {
            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 rounded-lg
                  px-4 py-3 font-medium transition
                  ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Create Post */}
        <button
          type="button"
          onClick={handleCreatePost}
          className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Create Post
        </button>

        {/* Logout */}
        <div className="absolute bottom-6 left-5 right-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
          >
            <span className="text-lg">↪</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;