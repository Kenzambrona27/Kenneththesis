import React, { useState } from "react";
import Header from "../../web_components/Header"; // same header you showed
import Sidebar from "./Sidebar"; // your instructor sidebar

function ActivityBuilder() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);

  const handleDragStart = (e, id, label) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id, label }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const { id, label } = JSON.parse(data);
    setItems((prev) => [...prev, { id, label }]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    // ✅ SAME background and structure as your existing header layout
    <div className="flex min-h-screen bg-[#e6f3fc] select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* ✅ Keeps your VirtuLab blue header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        {/* ✅ Light body background that matches your screenshot */}
        <main className="mt-10 flex-grow flex flex-col p-10 bg-[#e6f3fc]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Activity Builder
          </h2>

          <div className="flex gap-6">
            {/* Draggable Items Section */}
            <aside className="w-1/4 bg-white p-4 border border-gray-200 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Draggable Items
              </h3>

              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "block1", "Block 1")}
                className="p-3 bg-blue-500 text-white rounded mb-2 cursor-grab hover:bg-blue-600 transition-colors"
              >
                Block 1
              </div>

              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "block2", "Block 2")}
                className="p-3 bg-green-500 text-white rounded cursor-grab hover:bg-green-600 transition-colors"
              >
                Block 2
              </div>
            </aside>

            {/* Workspace / Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex-1 bg-white p-6 rounded-xl shadow-inner border border-gray-200 min-h-[60vh]"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Workspace
              </h3>

              <div className="flex flex-wrap gap-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3 bg-gray-100 rounded shadow text-sm text-gray-700"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ActivityBuilder;
