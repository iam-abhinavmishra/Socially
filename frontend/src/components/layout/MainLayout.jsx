import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <main className="min-h-screen flex-1 border-x border-slate-200 bg-slate-100">
          {children}
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}

export default MainLayout;