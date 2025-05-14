const fetch = require('node-fetch');

const CALORIES_URL = 'https://api.api-ninjas.com/v1/caloriesburned';
const BMI_URL = 'https://smart-body-mass-index-calculator-bmi.p.rapidapi.com';

const getCalories = async (activity, weight, duration) => {
  const res = await fetch(`${CALORIES_URL}?activity=${activity}&weight=${weight}&duration=${duration}`, {
    headers: { 'X-API-Key': process.env.CALORIES_API_KEY }
  });
  return await res.json();
};

const getBMI = async (age, height, weight) => {
  const res = await fetch(`${BMI_URL}/bmi?age=${age}&height=${height}&weight=${weight}`, {
    headers: {
      'X-RapidAPI-Key': process.env.BMI_API_KEY,
      'X-RapidAPI-Host': 'smart-body-mass-index-calculator-bmi.p.rapidapi.com'
    }
  });
  return await res.json();
};

module.exports = {
  getCalories,
  getBMI,
};
