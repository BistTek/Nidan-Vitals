export default function Filters({ setFilter, setSearch }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <input
        placeholder="Search Patient ID"
        onChange={e => setSearch(e.target.value)}
        style={{ marginRight: 8 }}
      />
      {["All", "Normal", "Overweight", "Obese"].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{ marginRight: 4 }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
