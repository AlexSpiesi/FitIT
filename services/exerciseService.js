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
const fetchById = async (id) => {
  const response = await fetch(`${EXERCISEDB_URL}/exercises/exercise/${id}`, { headers: HEADERS });
  if (!response.ok) throw new Error('Fehler beim Abrufen der Übung');
  return response.json();
};
const fetchBodyParts = async () => {
  const res = await fetch(`${EXERCISEDB_URL}/exercises/bodyPartList`, { headers: HEADERS });
  return await res.json();
};

const fetchTargets = async () => {
  const res = await fetch(`${EXERCISEDB_URL}/exercises/targetList`, { headers: HEADERS });
  return await res.json();
};

const fetchByBodyPart = async (part, limit = 0) => {
  const response = await fetch(`${EXERCISEDB_URL}/exercises/bodyPart/${part}?limit=${limit}`, {headers:HEADERS });
  if (!response.ok) throw new Error('Fehler beim Abrufen der Übungen');
  return response.json();
};

const fetchEquipmentList = async () => {
  const response = await fetch(`${EXERCISEDB_URL}/exercises/equipmentList`, { headers: HEADERS });
  if (!response.ok) throw new Error('Fehler beim Abrufen der Equipment-Liste');
  return response.json();
};

const fetchByEquipment = async (type, limit = 0) => {
  const response = await fetch(`${EXERCISEDB_URL}/exercises/equipment/${type}?limit=${limit}`, { headers: HEADERS });
  if (!response.ok) throw new Error('Fehler beim Abrufen nach Equipment');
  return response.json();
};

const fetchByTarget = async (target) => {
  const response = await fetch(`${EXERCISEDB_URL}/exercises/target/${target}`, { headers: HEADERS });
  if (!response.ok) throw new Error('Fehler beim Abrufen nach Target');
  return response.json();
};

module.exports = {
  fetchByTarget,
  fetchEquipmentList,
  fetchByEquipment,
  fetchAllExercises,
  fetchBodyParts,
  fetchTargets,
  fetchByBodyPart,
  fetchById,
};

