const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));

const fetch = require("node-fetch");

const EXERCISEDB_URL = "https://exercisedb.p.rapidapi.com";
const EXERCISEDB_HEADERS = {
  "X-RapidAPI-Key": "40cd5fb34dmsh295a23ff5312e1bp119f01jsn0e8265eda1c2", // Replace with your actual key
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

const FITNESSCALC_URL = "https://fitness-calculator.p.rapidapi.com";
const FITNESSCALC_HEADERS = {
  "X-RapidAPI-Key": "40cd5fb34dmsh295a23ff5312e1bp119f01jsn0e8265eda1c2", // Replace with your actual key
  "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
};
// const { EXERCISEDB_URL, EXERCISEDB_HEADERS } = require("./constant");
// require("dotenv").config(); // Load env vars

// const EXERCISEDB_URL = "https://exercisedb.p.rapidapi.com";
// const EXERCISEDB_HEADERS = {
//   "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
// };


// Endpoint to test the ExerciseDB API
// Example 1: Fetch only 5 exercises
app.get("/test/exercises", async (req, res) => {
  try {
    const response = await fetch(`${EXERCISEDB_URL}/exercises`, {
      method: "GET",
      headers: EXERCISEDB_HEADERS,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });
    }

    const data = await response.json();
    res.json(data); // only return first 5
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example 2: Fetch list of body parts
app.get("/test/bodyparts", async (req, res) => {
  try {
    const response = await fetch(`${EXERCISEDB_URL}/exercises/bodyPartList`, {
      method: "GET",
      headers: EXERCISEDB_HEADERS,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });
    }

    const data = await response.json();
    res.json(data); // usually a short list anyway
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Example 3: List all available target muscles (e.g. "biceps", "abs")
app.get("/test/targets", async (req, res) => {
  try {
    const response = await fetch(`${EXERCISEDB_URL}/exercises/targetList`, {
      method: "GET",
      headers: EXERCISEDB_HEADERS,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });
    }

    const data = await response.json();
    res.json(data); // usually a short list anyway
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Test 4: Get 5 exercises for a target muscle, e.g., "biceps"
app.get("/test/target/biceps", async (req, res) => {
  try {
    const response = await fetch(`${EXERCISEDB_URL}/exercises/target/biceps`, {
      headers: EXERCISEDB_HEADERS,
    });
    if (!response.ok)
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });

    const data = await response.json();
    res.json(data.slice(0, 5)); // Limit output
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test 5: Get 5 exercises with image (GIF URL) included
app.get("/test/exercises-with-gif", async (req, res) => {
  try {
    const response = await fetch(`${EXERCISEDB_URL}/exercises`, { headers: EXERCISEDB_HEADERS });
    if (!response.ok)
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });

    const data = await response.json();

    // Extract only name + gifUrl of the first 5 exercises
    const shortList = data.map((ex) => ({
      name: ex.name,
      gifUrl: ex.gifUrl,
      target: ex.target,
      equipment: ex.equipment,
    }));

    res.json(shortList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test/bmi", async (req, res) => {
  const { height, weight, age } = req.query;

  if (!height || !weight || !age) {
    return res.status(400).json({ error: "Height, weight and age are required" });
  }

  try {
    const response = await fetch(
      `${FITNESSCALC_URL}/bmi?age=${age}&height=${height}&weight=${weight}`,
      {
        method: "GET",
        headers: FITNESSCALC_HEADERS,
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test/idealweight", async (req, res) => {
  const { height, gender } = req.query;

  if (!height || !gender) {
    return res
      .status(400)
      .json({ error: "Height and gender are required (e.g., ?height=175&gender=male)" });
  }

  try {
    const response = await fetch(
      `${FITNESSCALC_URL}/idealweight?gender=${gender}&height=${height}`,
      {
        method: "GET",
        headers: FITNESSCALC_HEADERS,
      }
    );

    if (!response.ok) {
      const text = await response.text(); // wichtig zum Debuggen!
      return res
        .status(response.status)
        .json({ error: `API error ${response.status}`, details: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start the server on port 3000
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000/");
  console.log("Test endpoints:");
  console.log("➡️  /test/exercises");
  console.log("➡️  /test/bodyparts");
  console.log("➡️  /test/targets");
  console.log("➡️  /test/target/biceps");
  console.log("➡️  /test/exercises-with-gif");
  console.log("➡️  /test/bmi?height=180&weight=75");
  console.log("➡️  /test/bmi?height=180&weight=75");
  console.log("➡️  /test/idealweight?height=175&gender=male");

});
