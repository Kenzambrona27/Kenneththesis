import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../web_components/Header";
import Sidebar from "./Sidebar";

function DashboardPage() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ADDED: State for the modal and its form fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/instructor/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const storedClasses =
          JSON.parse(localStorage.getItem("tempCreatedClasses") || "[]") || [];
        const fetchedClasses = res.data.classes || [];
        const mergedClasses = [
          ...fetchedClasses.filter((remote) => {
            const remoteKey = remote.id ?? remote.code;
            return !storedClasses.some(
              (stored) => (stored.id ?? stored.code) === remoteKey
            );
          }),
          ...storedClasses,
        ];
        setMessage(res.data.message);
        setClasses(mergedClasses);
      })
      .catch((err) => {
        console.error(err);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (location.state?.newClass) {
      const newClassKey =
        location.state.newClass.id ?? location.state.newClass.code;
      setClasses((prevClasses) => {
        const exists = prevClasses.some(
          (cls) =>
            (cls.id ?? cls.code) === newClassKey
        );
        const updated = exists
          ? prevClasses
          : [...prevClasses, location.state.newClass];
        localStorage.setItem(
          "tempCreatedClasses",
          JSON.stringify(updated)
        );
        return updated;
      });
      navigate("/instructor/dashboard", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // ⛔ REMOVED: This function is no longer needed
  // const goToCreateClass = () => {
  //   navigate("/instructor/activitybuilder");
  // };

  // ✅ ADDED: Function to handle the modal's "Create" button
  const handleCreateClass = () => {
    // This is where you'll send the data to your backend
    const generatedId = Date.now();
    const classData = {
      id: generatedId,
      className,
      section,
      subject,
      room,
      title: className || "Untitled Class",
      description: section || "",
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    console.log("Creating class with data:", classData);
    const storedClasses =
      JSON.parse(localStorage.getItem("tempCreatedClasses") || "[]") || [];
    const updatedClasses = [...storedClasses, classData];
    localStorage.setItem("tempCreatedClasses", JSON.stringify(updatedClasses));
    navigate("/instructor/subclass", { state: { classData } });

    // --- Example of how to send it to the backend ---
    // const token = localStorage.getItem("token");
    // axios
    //   .post("http://localhost:5000/instructor/create-class", classData, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((res) => {
    //     // Add the new class from the response to your 'classes' state
    //     setClasses((prevClasses) => [...prevClasses, res.data.newClass]);
    //     // Close the modal and reset the form
    //     setIsModalOpen(false);
    //     setClassName("");
    //     setSection("");
    //     setSubject("");
    //     setRoom("");
    //   })
    //   .catch((err) => {
    //     console.error("Error creating class:", err);
    //     alert("Failed to create class. Please try again.");
    //   });

    // For now, we'll just log and close the modal
    setIsModalOpen(false);
    setClassName("");
    setSection("");
    setSubject("");
    setRoom("");
  };

  const goToJoinClass = () => {
    navigate("/instructor/joinclass");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#cfe3fa] via-[#e6f0ff] to-white select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        {/* ✅ Main Content */}
        <main className="flex-grow flex flex-col p-10">
          {/* Greeting */}
          {message && (
            <p className="text-gray-700 text-lg mb-6 font-medium tracking-wide text-center">
              {message}
            </p>
          )}

          {/* Active Classes Section */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Active Classes
          </h2>

          {/* ✅ Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {/* If no active classes */}
            {classes.length === 0 && (
              <div className="col-span-full text-gray-500 text-center">
                <p className="text-base mb-4">
                  You have no active classes yet.
                </p>
              </div>
            )}

            {/* Render Class Cards */}
            {classes.map((cls) => (
              <div
                key={cls.id || cls.code || cls.title}
                onClick={() =>
                  navigate("/instructor/subclass", {
                    state: { classData: cls },
                  })
                }
                className="w-72 h-56 bg-white shadow-lg rounded-2xl border border-blue-50 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {cls.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {cls.description || "No description available"}
                  </p>
                </div>
                <button className="mt-2 text-blue-600 font-medium text-sm hover:underline self-start">
                  Open
                </button>
              </div>
            ))}

            {/* Create Class Card */}
            <div
              onClick={() => setIsModalOpen(true)} // ✅ CHANGED: This now opens the modal
              className="w-64 h-40 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:bg-gray-100 transition-all"
            >
              <span className="text-4xl mb-2">+</span>
              <span className="text-lg font-semibold">Create Class</span>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ ADDED: The entire modal for "Create Class" */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} // Close on background click
        >
          <div
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Create Class
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="class-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class name*
                  </label>
                  <input
                    type="text"
                    id="class-name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">*Required</p>
                </div>
                <div>
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Section
                  </label>
                  <input
                    type="text"
                    id="section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="room"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room
                  </label>
                  <input
                    type="text"
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreateClass}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;