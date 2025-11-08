import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react"; // 🧠 Monaco Editor import
import Split from "react-split"; // ✨ Modern split layout



// MAKE THIS IMPORTABLE INTO STUDENT DASHBOARD

function Compiler() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState("print('Hello, World!')");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("vs-dark");

 const runCode = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/code/runcode",
      {
        language,
        code,
        stdin: input || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output =
      res.data?.run?.output ||
      res.data?.run?.stdout ||
      res.data?.output ||
      "No output";

    setOutput(output.trim());
  } catch (err) {
    console.error("Code execution error:", err.response?.data || err.message);
    setOutput("Error running code");
  }
};


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
}, [navigate]);

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-4 bg-[#F8F9FB]">
          {message && (
            <p className="text-gray-600 mb-4 text-lg font-medium text-center">
              {message}
            </p>
          )}

          <div className="mt-8 bg-white border border-gray-200 overflow-hidden flex flex-col h-[90vh]">
            {/* Toolbar */}
            <div className="flex items-center justify-end bg-gray-100 py-2 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-300 text-gray-700 cursor-pointer"
                >
                  <option value="python3">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>

                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-300 text-gray-700 cursor-pointer"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>

                <button
                  onClick={runCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-md shadow-md transition duration-200 cursor-pointer"
                >
                  ▶ Run
                </button>
              </div>
            </div>

            {/* Split Panel: Code Editor | Input & Output */}
            <Split
              className="flex flex-row flex-grow"
              sizes={[70, 30]}
              minSize={500}
              gutterSize={8}
            >
              {/* Monaco Code Editor */}
              <div className="h-full bg-[#1E1E1E]">
                <Editor
                  height="100%"
                  language={language === "python3" ? "python" : language}
                  theme={theme}
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  options={{
                    fontSize: 15,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderWhitespace: "none",
                    smoothScrolling: true,
                  }}
                />
              </div>

              {/* Input & Output Section */}
              <div className="bg-gray-50 flex flex-col border-l border-gray-200">
                <div className="border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-700 mb-2">
                    Input (stdin)
                  </h2>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your input here (If needed)..."
                    className="w-full h-24 p-2 border border-gray-300 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1 bg-[#0B1120] text-green-400 font-mono text-sm p-4 overflow-auto">
                  {output || "Your output will appear here..."}
                </div>
              </div>
            </Split>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Compiler;
