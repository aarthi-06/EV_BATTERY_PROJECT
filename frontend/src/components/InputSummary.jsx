function InputSummary({ inputData }) {
  if (!inputData) return null;

  const items = [
    { label: "Ambient Temp", value: `${inputData.ambient_temp} °C` },
    { label: "Avg Voltage", value: `${inputData.avg_voltage} V` },
    { label: "Max Voltage", value: `${inputData.max_voltage} V` },
    { label: "Avg Temp", value: `${inputData.avg_temp} °C` },
    { label: "Max Temp", value: `${inputData.max_temp} °C` },
    { label: "Duration", value: `${inputData.duration}` },
    { label: "Capacity", value: `${inputData.capacity} Ah` },
  ];

  return (
    <div className="summary-card">
      <h2>Input Summary</h2>
      <div className="summary-grid">
        {items.map((item) => (
          <div key={item.label} className="summary-item">
            <span className="summary-label">{item.label}</span>
            <span className="summary-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputSummary;