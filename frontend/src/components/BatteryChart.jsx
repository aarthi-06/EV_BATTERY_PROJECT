import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function BatteryChart({ inputData }) {
  if (!inputData) return null;

  // Domain-based scaling to percentages
  const scaleTo100 = (value, max) => Math.min((value / max) * 100, 100);

  const chartData = [
    { feature: "Ambient Temp", value: scaleTo100(inputData.ambient_temp, 50) },
    { feature: "Avg Voltage", value: scaleTo100(inputData.avg_voltage, 5) },
    { feature: "Max Voltage", value: scaleTo100(inputData.max_voltage, 5) },
    { feature: "Avg Temp", value: scaleTo100(inputData.avg_temp, 60) },
    { feature: "Max Temp", value: scaleTo100(inputData.max_temp, 60) },
    { feature: "Duration", value: scaleTo100(inputData.duration, 5000) },
    { feature: "Capacity", value: scaleTo100(inputData.capacity, 5) },
  ];

  return (
    <div className="chart-card">
      <h2>Battery Feature Overview</h2>
      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="feature" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Battery Inputs"
              dataKey="value"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.45}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BatteryChart;