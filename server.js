/*const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require('axios');

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
const CALORIESBURNED_URL = "https://api.api-ninjas.com/v1/caloriesburned";
const CALORIESBURNED_HEADERS = {
  "X-API-Key": "9JlQa4re5pM7r2rr75w3AQ==MywgMIPRYZTCDl0y", // Replace with your actual key
  // "X-API-Host": "exercisedb.p.rapidapi.com",
};
const BMICALC_URL = "https://smart-body-mass-index-calculator-bmi.p.rapidapi.com";
const BMICALC_HEADERS = {
  "X-RapidAPI-Key": "015c52bb70msh0ca69c0c0da9fa3p13dce6jsnc05c3d5b2905",
  "X-RapidAPI-Host": "smart-body-mass-index-calculator-bmi.p.rapidapi.com",
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
app.get('/api/BMI/metric', (req, res) => {
    const { kg, cm } = req.query;

    // Validate the input
    if (!kg || !cm || kg <= 0 || cm <= 0) {
        return res.status(400).json({ message: 'Invalid input parameters' });
    }

    // Convert cm to meters
    const heightInMeters = cm / 100;
    const bmi = kg / (heightInMeters ** 2);
    
    // Determine BMI status
    let status = '';
    if (bmi < 18.5) {
        status = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Overweight';
    } else if (bmi >= 30 && bmi < 40) {
        status = 'Obese';
    } else {
        status = 'Severely Obese';
    }

    return res.json({
        bmi: bmi.toFixed(2),
        status: status
    });
});

// BMI calculation for Imperial Units (lbs, inches)
app.get('/api/BMI/imperial', (req, res) => {
    const { lbs, inches } = req.query;

    // Validate the input
    if (!lbs || !inches || lbs <= 0 || inches <= 0) {
        return res.status(400).json({ message: 'Invalid input parameters' });
    }

    // Convert inches to meters
    const heightInMeters = inches * 0.0254;
    const bmi = (lbs / 2.20462) / (heightInMeters ** 2); // Convert pounds to kg

    // Determine BMI status
    let status = '';
    if (bmi < 18.5) {
        status = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Normal';
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Overweight';
    } else if (bmi >= 30 && bmi < 40) {
        status = 'Obese';
    } else {
        status = 'Severely Obese';
    }

    return res.json({
        bmi: bmi.toFixed(2),
        status: status
    });
});

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
    const response = await fetch(`${EXERCISEDB_URL}/exercises`, {
      headers: EXERCISEDB_HEADERS,
    });
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

/*app.get("/test/bmi", async (req, res) => {
  const { height, weight, age } = req.query;

  if (!height || !weight || !age) {
    return res
      .status(400)
      .json({ error: "Height, weight and age are required" });
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

app.get("/test/bmi", async (req, res) => {
  const { age, height, weight } = req.query;

  // Validate if all parameters are provided
  if (!age || !height || !weight) {
    return res.status(400).json({ error: "Age, height, and weight are required" });
  }

  // Validate if parameters are numbers and within valid ranges
  if (isNaN(age) || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: "Age, height, and weight must be numbers" });
  }

  if (age < 0 || age > 80) {
    return res.status(400).json({ error: "Age must be between 0 and 80" });
  }
  if (weight < 40 || weight > 160) {
    return res.status(400).json({ error: "Weight must be between 40 and 160 kg" });
  }
  if (height < 130 || height > 230) {
    return res.status(400).json({ error: "Height must be between 130 and 230 cm" });
  }

  try {
    const response = await fetch(
      `${FITNESSCALC_URL}/bmi?age=${age}&height=${height}&weight=${weight}`,
      {
        method: "GET",
        headers: FITNESSCALC_HEADERS,
      }
    );

    const text = await response.text();  // Log the response body for debugging
    console.log(text);  // Log raw response from the API

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test/idealweight", async (req, res) => {
  const { height, gender } = req.query;

  if (!height || !gender) {
    return res.status(400).json({
      error: "Height and gender are required (e.g., ?height=175&gender=male)",
    });
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

app.get("/test/calories", async (req, res) => {
  const { activity, weight, duration } = req.query;

  if (!activity) {
    return res
      .status(400)
      .json({ error: "Query parameter 'activity' is required" });
  }

  // const url = new URL("https://api.api-ninjas.com/v1/caloriesburned");
  // url.searchParams.append("activity", activity);
  // if (weight) url.searchParams.append("weight", weight);
  // if (duration) url.searchParams.append("duration", duration);

  try {
    const response = await fetch(
      `${CALORIESBURNED_URL}?activity=${activity}&weight=${weight}&duration=${duration}`,
      {
        method: "GET",
        headers: CALORIESBURNED_HEADERS,
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
*/
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, `files`)));

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, `files`, `index.html`))
})  

const exerciseRoutes = require('./routes/exerciseRoutes');
const healthRoutes = require('./routes/healthRoutes');


app.use(express.json());

// Mount routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/health', healthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
