const fetch = require('node-fetch');

const CALORIES_URL = 'https://api.api-ninjas.com/v1/caloriesburned';
const BMI_URL = 'https://smart-body-mass-index-calculator-bmi.p.rapidapi.com';

const getCalories = async (activity, weight, duration) => {
  const res = await fetch(`${CALORIES_URL}?activity=${activity}&weight=${weight}&duration=${duration}`, {
    headers: { 'X-API-Key': process.env.CALORIES_API_KEY }
  });
  return await res.json();
};

const getBMI = async (kg, cm) => {
  const res = await fetch(`${BMI_URL}/api/BMI/metric?kg=${kg}&cm=${cm}`, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'smart-body-mass-index-calculator-bmi.p.rapidapi.com'
    }
  });
  return await res.json();
};

module.exports = {
  getCalories,
  getBMI,
};
