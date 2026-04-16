
import { useState } from "react";

const initialState = {
  ambient_temp: "",
  avg_voltage: "",
  max_voltage: "",
  avg_temp: "",
  max_temp: "",
  duration: "",
  capacity: "",
};

function BatteryForm({ onPredict, loading }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedData = {
      ambient_temp: Number(formData.ambient_temp),
      avg_voltage: Number(formData.avg_voltage),
      max_voltage: Number(formData.max_voltage),
      avg_temp: Number(formData.avg_temp),
      max_temp: Number(formData.max_temp),
      duration: Number(formData.duration),
      capacity: Number(formData.capacity),
    };

    onPredict(parsedData);
  };

  return (
    <form className="battery-form" onSubmit={handleSubmit}>
      <h2>Battery Input</h2>

      <input
        type="number"
        step="any"
        name="ambient_temp"
        placeholder="Ambient Temperature"
        value={formData.ambient_temp}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="avg_voltage"
        placeholder="Average Voltage"
        value={formData.avg_voltage}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="max_voltage"
        placeholder="Maximum Voltage"
        value={formData.max_voltage}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="avg_temp"
        placeholder="Average Temperature"
        value={formData.avg_temp}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="max_temp"
        placeholder="Maximum Temperature"
        value={formData.max_temp}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="duration"
        placeholder="Duration"
        value={formData.duration}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        step="any"
        name="capacity"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Predicting..." : "Predict RUL"}
      </button>
    </form>
  );
}

export default BatteryForm;