const axios = require('axios');

exports.runCode = async (req, res) => {
  const { language, code, stdin } = req.body;

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*",
      files: [{ name: "main.py", content: code }],
      stdin: stdin || "",
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Execution failed" });
  }
};
