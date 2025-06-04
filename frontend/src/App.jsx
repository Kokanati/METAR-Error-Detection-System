import React, { useState } from "react";
import "./App.css";
import { saveMetarObservation } from "./utils/api";

function App() {
  const [form, setForm] = useState({
    obs_type:"METAR",
    station_id: "",
    obs_time: "",
    wind_speed: "",
    wind_direction: "",
    wind_gust: "",
    visibility: "",
    temperature: "",
    dew_point: "",
    qnh: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const metarPreview = `METAR ${form.station_id || "XXXX"} ${form.obs_time || "000000Z"} ${form.wind_direction || "000"}${form.wind_speed || "00"}G${form.wind_gust || "00"}KT ${form.visibility || "9999"} ${form.temperature || "00"}/${form.dew_point || "00"} Q${form.qnh || "0000"}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await saveMetarObservation(form);
      alert(`Observation saved as: ${res.name}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save METAR observation.");
    }
  };


  return (
    <div className="app-container">
      {/* Left Panel */}
      <div className="left-pane">
        <h2>METAR Entry</h2>
        <form onSubmit={handleSubmit}>
          <label>Station ID:</label>
          <input type="text" name="station_id" value={form.station_id} onChange={handleChange} />

          <label>Observation Time (Z):</label>
          <input type="text" name="obs_time" value={form.obs_time} onChange={handleChange} placeholder="270800Z" />

          <label>Wind Speed (kt):</label>
          <input type="number" name="wind_speed" value={form.wind_speed} onChange={handleChange} />

          <label>Wind Direction (°):</label>
	  <input type="number" name="wind_direction" value={form.wind_direction} onChange={handleChange} />

	  <label>Wind Gust (kt):</label>
	  <input type="number" name="wind_gust" value={form.wind_gust} onChange={handleChange} />

	  <label>Visibility (m):</label>
	  <input type="text" name="visibility" value={form.visibility} onChange={handleChange} />

	  <label>Temperature (°C):</label>
 	  <input type="number" name="temperature" value={form.temperature} onChange={handleChange} />

	  <label>Dew Point (°C):</label>
	  <input type="number" name="dew_point" value={form.dew_point} onChange={handleChange} />

	  <label>Pressure (QNH):</label>
	  <input type="text" name="qnh" value={form.qnh} onChange={handleChange} />

	  <button type="submit">Check</button>
        </form>
      </div>

      {/* Right Panel */}
      <div className="right-pane">
        <h2>Observation Preview</h2>
        <div className="preview-box">
          <pre>{metarPreview}</pre>
        </div>
        <div className="action-buttons">
          <button>Copy</button>
          <button>Archive</button>
          <button>Email</button>
        </div>
      </div>
    </div>
  );
}

export default App;
