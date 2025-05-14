const fetch = require('node-fetch');

const EXERCISEDB_URL = 'https://exercisedb.p.rapidapi.com';
const HEADERS = {
  'X-RapidAPI-Key': "015c52bb70msh0ca69c0c0da9fa3p13dce6jsnc05c3d5b2905",
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
};

const fetchAllExercises = async () => {
  const res = await fetch(`${EXERCISEDB_URL}/exercises`, { headers: HEADERS });
  return await res.json();
};

const fetchBodyParts = async () => {
  const res = await fetch(`${EXERCISEDB_URL}/exercises/bodyPartList`, { headers: HEADERS });
  return await res.json();
};

const fetchTargets = async () => {
  const res = await fetch(`${EXERCISEDB_URL}/exercises/targetList`, { headers: HEADERS });
  return await res.json();
};

module.exports = {
  fetchAllExercises,
  fetchBodyParts,
  fetchTargets,
};
