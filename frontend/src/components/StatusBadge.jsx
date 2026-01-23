export default function StatusBadge({ category, alert }) {
  const colors = {
    Obese: "red",
    Overweight: "orange",
    Normal: "green",
    Underweight: "gray"
  };

  const backgroundColor = alert
    ? "red"
    : colors[category] || "gray";

  return (
    <span
      style={{
        color: "white",
        background: backgroundColor,
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold"
      }}
    >
      {alert ? "High Risk" : category || "Unknown"}
    </span>
  );
}
