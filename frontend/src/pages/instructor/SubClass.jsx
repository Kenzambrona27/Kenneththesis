import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../web_components/Header";
import Sidebar from "./Sidebar";

function SubClass() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);

  const classInfo = useMemo(() => {
    const defaults = {
      id: Date.now(),
      className: "Untitled Class",
      section: "Section details",
      subject: "Subject",
      room: "Room",
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    return { ...defaults, ...(location.state?.classData || {}) };
  }, [location.state]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setIsCreateMenuOpen(false);
      }
    }

    if (isCreateMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCreateMenuOpen]);

  const createMenuItems = [
    { label: "Announcement", description: "Share updates with everyone" },
    { label: "Quick Quiz", description: "Ask short formative questions" },
    { label: "Discussion", description: "Start a collaborative thread" },
    { label: "Resource Drop", description: "Upload files or links" },
    { label: "Reuse Activity", description: "Bring back a previous post" },
    { label: "New Topic", description: "Group tasks under a theme" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#cfe3fa] via-[#e6f0ff] to-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />

        <main className="flex-1 px-6 sm:px-10 py-10 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <button
                onClick={() =>
                  navigate("/instructor/dashboard", {
                    state: { newClass: classInfo },
                  })
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← Back to classes
              </button>
              <h1 className="mt-4 text-3xl font-semibold text-gray-800">
                {classInfo.className}
              </h1>
              <p className="text-gray-500">
                {classInfo.section} • {classInfo.subject} • {classInfo.room}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition">
                Class settings
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
                Share invite
              </button>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d7bf3] via-[#37b0ff] to-[#8adFFF] text-white shadow-xl">
            <div className="absolute inset-0">
              <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute left-24 top-10 h-24 w-24 rounded-3xl border border-white/25 rotate-12" />
              <div className="absolute right-16 bottom-16 h-20 w-20 rounded-full bg-white/20" />
            </div>
            <div className="relative z-10 p-8 lg:p-12 flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <p className="uppercase tracking-[0.25em] text-white/80 text-xs">
                    stream overview
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-snug">
                    Start the conversation and keep your class aligned
                  </h2>
                  <p className="mt-3 text-white/80 text-sm max-w-2xl">
                    Announcements posted here appear for everyone instantly. Pin
                    key updates, schedule reminders, or share quick resources to
                    set the tone for your course.
                  </p>
                </div>
                <div className="bg-white/15 rounded-3xl p-6 w-full sm:w-auto sm:min-w-[220px]">
                  <p className="text-white/70 uppercase tracking-wide text-xs">
                    class code
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[0.35em]">
                    {classInfo.code}
                  </p>
                  <button className="mt-6 w-full rounded-xl bg-white/20 py-2 text-sm font-medium hover:bg-white/30 transition">
                    Copy code
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Actions bar outside the banner */}
          <div className="mt-4 lg:mt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative" ref={createMenuRef}>
                <button
                  onClick={() => setIsCreateMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#2d7bf3] via-[#37b0ff] to-[#5bd0ff] text-sm font-semibold text-white shadow-xl shadow-black/15 hover:shadow-2xl hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base font-bold">
                    +
                  </span>
                  Classwork
                </button>
                {isCreateMenuOpen && (
                  <div className="absolute left-0 top-full mt-3 w-72 rounded-3xl border border-blue-100 bg-white/95 backdrop-blur-sm shadow-2xl shadow-blue-200/40 overflow-hidden z-20">
                    <div className="bg-gradient-to-r from-[#e7f1ff] to-white px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
                        quick actions
                      </p>
                    </div>
                    <div className="divide-y divide-blue-50">
                      {createMenuItems.map((item) => (
                        <button
                          key={item.label}
                          className="w-full text-left px-5 py-4 hover:bg-blue-50/70 transition-colors duration-150"
                        >
                          <p className="text-sm font-semibold text-gray-800">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="px-6 py-2 rounded-full bg-white text-sm font-semibold text-[#2d7bf3] shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200">
                Grades
              </button>
              <button className="px-6 py-2 rounded-full bg-white text-sm font-semibold text-[#2d7bf3] border border-white/40 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200">
                Class People
              </button>
            </div>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white shadow-lg border border-white/60 px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    VT
                  </div>
                  <button className="flex-1 text-left px-5 py-3 rounded-2xl border border-dashed border-blue-200 text-sm text-blue-600 hover:bg-blue-50 transition">
                    Share something with your class...
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    Attach file
                  </button>
                  <button className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    Link resource
                  </button>
                  <button className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    Start discussion
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white shadow-lg border border-white/60 px-6 py-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Upcoming
                </h3>
                <p className="mt-3 text-sm text-gray-500">
                  No scheduled tasks yet. Create an activity to fill this list.
                </p>
                <button className="mt-5 w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-semibold hover:bg-blue-700 transition">
                  Plan assignment
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SubClass;

