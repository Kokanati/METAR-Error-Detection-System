// src/utils/api.js

import axios from "axios";

// Authentication credentials
const apiKey = "9653a549f3f3cec";  // Replace with actual API key from Frappe user
const apiSecret = "a1a309a562e834";  // Replace with actual API secret

/**
 * Save METAR Observation to the Frappe backend via authenticated API call.
 * Works with HTTPS and same-origin policy.
 */
export const saveMetarObservation = async (data) => {
  try {
    const response = await axios.post(
      "/api/method/meds.api.save_metar_observation",  // same-origin
      { payload: data },
      {
        auth: {
          username: apiKey,
          password: apiSecret
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (err) {
    console.error("Save Error:", err.response?.data || err.message);
    throw err;
  }
};
