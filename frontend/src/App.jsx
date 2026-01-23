import { useState } from "react";
import VitalsForm from "./components/VitalsForm";
import PatientRegistry from "./components/PatientRegistry";

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    setRefresh(r => r + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Nidan Vitals Dashboard</h2>

      <VitalsForm onSaved={handleSaved} />

      <hr style={{ margin: "20px 0" }} />

      <PatientRegistry refresh={refresh} />
    </div>
  );
}

export default App;
