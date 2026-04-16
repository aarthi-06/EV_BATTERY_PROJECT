function PredictionResult({ result }) {
  if (!result) return null;

  return (
    <div className="result-card">
      <h2>Prediction Result</h2>
      <p className="rul-value">{Math.round(result.predicted_rul)} cycles</p>
    </div>
  );
}

export default PredictionResult;