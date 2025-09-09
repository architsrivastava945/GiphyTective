import express from "express";
import axios from "axios";
import "dotenv/config";

const app = express();
const PORT = 3000;
const GIPHY_API_KEY = process.env.API_KEY;

// --- Middleware ---
app.use(express.static("public"));
// IMPROVEMENT: Using the modern, built-in body-parser
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

// Render the homepage
app.get("/", (req, res) => {
  // FIXED: Always pass an array, even if it's empty, to prevent errors in EJS
  res.render("index.ejs", { gifs: [] });
});

// Handle the form submission and fetch GIFs
app.post("/search", async (req, res) => {
  // FIXED: The name in your EJS form is "query", not "search"
  const searchTerm = req.body.query;
  const giphyUrl = `https://api.giphy.com/v1/gifs/search`;

  try {
    // IMPROVEMENT: Using the 'params' object is cleaner and safer
    const response = await axios.get(giphyUrl, {
      params: {
        api_key: GIPHY_API_KEY,
        q: searchTerm,
        limit: 30, // Let's get a few more GIFs to fill the grid
      },
    });

    const gifs = response.data.data;
    res.render("index.ejs", { gifs: gifs });

  } catch (error) {
    console.error("Failed to fetch GIFs:", error.message);
    // FIXED: Always pass an array, even on error
    res.render("index.ejs", { gifs: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

