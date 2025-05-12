const API_KEYS = {
  EXERCISEDB_API_KEY: "40cd5fb34dmsh295a23ff5312e1bp119f01jsn0e8265eda1c2",
};

const URLS = {
  EXERCISEDB_API: "https://exercisedb.p.rapidapi.com",
};

const HEADERS = {
  EXERCISEDB_HEADERS: {
    "X-RapidAPI-Key": API_KEYS.EXERCISEDB_API_KEY,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

module.exports = { API_KEYS, URLS, HEADERS };
