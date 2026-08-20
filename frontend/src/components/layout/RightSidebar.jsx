function RightSidebar() {
  return (
    <aside className="hidden min-h-screen w-80 space-y-6 border-l border-slate-200 bg-white p-5 xl:block">
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-full bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <section className="rounded-xl bg-slate-100 p-4">
        <h2 className="text-lg font-bold text-slate-900">Trending</h2>

        <div className="mt-4 space-y-4">
          <TrendItem topic="#ReactJS" posts="12.5K posts" />
          <TrendItem topic="#SpringBoot" posts="8.2K posts" />
          <TrendItem topic="#WebDevelopment" posts="25K posts" />
        </div>
      </section>

      <section className="rounded-xl bg-slate-100 p-4">
        <h2 className="text-lg font-bold text-slate-900">Who to follow</h2>

        <div className="mt-4 space-y-4">
          <UserSuggestion name="Alex Johnson" username="@alexdev" />
          <UserSuggestion name="Priya Sharma" username="@priyacodes" />
          <UserSuggestion name="Sam Wilson" username="@samtech" />
        </div>
      </section>
    </aside>
  );
}

function TrendItem({ topic, posts }) {
  return (
    <button className="block text-left">
      <p className="font-semibold text-slate-900">{topic}</p>
      <p className="text-sm text-slate-500">{posts}</p>
    </button>
  );
}

function UserSuggestion({ name, username }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{username}</p>
      </div>

      <button className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700">
        Follow
      </button>
    </div>
  );
}

export default RightSidebar;