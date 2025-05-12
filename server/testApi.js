const BASE_URL = "https://exercisedb.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": "40cd5fb34dmsh295a23ff5312e1bp119f01jsn0e8265eda1c2", // Replace with your actual key
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

// Helper function to send GET requests
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      console.error(`❌ Error ${response.status} for ${endpoint}`);
      return null;
    }

    const data = await response.json();
    console.log(
      `✅ ${endpoint} returned ${
        Array.isArray(data) ? data.length + " items" : "data"
      }`
    );
    console.log(data.slice ? data.slice(0, 3) : data); // Show sample (first 3) if possible
    return data;
  } catch (err) {
    console.error(`❌ Failed to fetch ${endpoint}:`, err.message);
    return null;
  }
}

// Run tests for all GET endpoints
async function testAPI() {
  const exercises = await fetchData("/exercises");

  const bodyParts = await fetchData("/exercises/bodyPartList");
  if (bodyParts && bodyParts.length > 0) {
    await fetchData(`/exercises/bodyPart/${bodyParts[0]}`);
  }

  const equipmentList = await fetchData("/exercises/equipmentList");
  if (equipmentList && equipmentList.length > 0) {
    await fetchData(`/exercises/equipment/${equipmentList[0]}`);
  }

  const targetList = await fetchData("/exercises/targetList");
  if (targetList && targetList.length > 0) {
    await fetchData(`/exercises/target/${targetList[0]}`);
  }

  await fetchData("/exercises/name/push"); // Try with name "push" (common word)
}

testAPI();
