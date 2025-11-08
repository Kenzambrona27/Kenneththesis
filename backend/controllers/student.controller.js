const axios = require('axios');

exports.getDashboard = (req, res) => {
  res.send({ message: 'Welcome to Dashboard!' });
};

exports.getCompiler = async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required." });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*",
      files: [{ name: "main." + language, content: code }],
      stdin: stdin || "",
    });

    res.json({
      message: "Execution successful",
      output: response.data.run.output,
      status: response.data.run.code,
    });
  } catch (error) {
    console.error("Piston API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Code execution failed",
      details: error.response?.data || error.message,
    });
  }
};

exports.getDragDropActivity = (req, res) => {
  res.send({ message: 'Drag and Drop!' });
};

exports.getTodo = (req, res) => {
  res.send({ message: 'No Activity Nice!' });
};

exports.getQuiz = (req, res) => {
  res.send({ message: 'You can now take the quiz!' });
};

exports.getArchived = (req, res) => {
  res.send({ message: 'Archived Subjects!' });
};

exports.getSetting = (req, res) => {
  res.send({ message: 'User Settings Access granted!' });
};
