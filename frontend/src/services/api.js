// src/services/api.js

import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'https://assignment01-mj8h.onrender.com';

// Function to fetch data from a given endpoint
export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return null;
    }
};
