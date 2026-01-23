import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { bmiCategory } from "../utils/bmi";
import { getObservations } from "../utils/api";

export default function PatientRegistry({ refresh }) {
  const [data, setData] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchData = async () => {
    const params = {};
    if (patientId) params.patient_id = patientId;
    if (filter !== "All") params.bmi_category = filter;

    const res = await getObservations(params);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [refresh, filter]);

  const getValue = (o, code) =>
    o.component.find(c => c.code.coding[0].code === code)
      ?.valueQuantity?.value;

  return (
    <div>
      <h3>Patient Registry</h3>

      {/* Search */}
      <input
        placeholder="Search by Patient ID"
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        onBlur={fetchData}
      />

      {/* Filters */}
      <div style={{ margin: "8px 0" }}>
        {["All", "Normal", "Overweight", "Obese"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: 6,
              fontWeight: filter === f ? "bold" : "normal"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {!data.length && <p>No patient found</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>BMI</th>
              <th>Blood Pressure</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((o, i) => {
              const bmi = getValue(o, "39156-5");
              const sys = getValue(o, "8480-6");
              const dia = getValue(o, "8462-4");

              const category = bmiCategory(bmi);
              const isHypertensive = sys >= 140 || dia >= 90;

              return (
                <tr key={i}>
                  <td>{o.subject.reference.replace("Patient/", "")}</td>
                  <td>{bmi}</td>
                  <td>{sys}/{dia}</td>
                  <td>
                    <StatusBadge
                      category={category}
                      alert={isHypertensive}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
