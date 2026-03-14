const express = require("express");
const axios   = require("axios");
const path    = require("path");

const app     = express();
const API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// This is the route the browser calls — we forward it to Gemini from the server
app.post("/api/generate", async (req, res) => {
  try {
    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(geminiRes.data);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message || "Unknown error";
    console.error("Gemini error:", msg);
    res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ NoteSnap is running on port " + PORT);
});
