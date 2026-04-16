import { useState } from "react";
import BatteryForm from "./components/BatteryForm";
import PredictionResult from "./components/PredictionResult";
import BatteryChart from "./components/BatteryChart";
import InputSummary from "./components/InputSummary";
import { predictBattery } from "./services/predictionService";
import "./index.css";

function App() {
  const [result, setResult] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatus = (rul) => {
    if (rul > 300) return { label: "Good", color: "green" };
    if (rul > 200) return { label: "Moderate", color: "orange" };
    return { label: "Poor", color: "red" };
  };

  const handlePredict = async (formData) => {
    setLoading(true);
    const data = await predictBattery(formData);
    setResult(data);
    setInputData(formData);
    setLoading(false);
  };

  const status = result ? getStatus(result.predicted_rul) : null;

  return (
    <div className="app-container">
      <h1 className="title">Battery RUL Dashboard</h1>

      <BatteryForm onPredict={handlePredict} loading={loading} />

      {result && (
        <>
          <div className="result-card">
            <h2>Prediction Result</h2>
            <div className="rul">{Math.round(result.predicted_rul)} cycles</div>
            <div
              className="status"
              style={{ background: status.color }}
            >
              {status.label}
            </div>
          </div>

          <InputSummary inputData={inputData} />
          <BatteryChart inputData={inputData} />
        </>
      )}
    </div>
  );
}

export default App;