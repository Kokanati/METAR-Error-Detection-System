import axios from "axios";

// Use the public IP or localhost during dev
const BASE_URL = "http://65.181.10.201:8000";

const apiKey = "9653a459f3f3cec";
const apiSecret = "a1a3094a5628e34";

export const saveMetarObservation = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/method/meds.api.save_metar_observation`,
      { payload: data },
      {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Save Error:", err.response?.data || err.message);
    throw err;
  }
};
