import { useState } from "react";
import { calculateBMI, bmiCategory } from "../utils/bmi";
import { saveObservation } from "../utils/api";

export default function VitalsForm({ onSaved }) {
  const [patientId, setPatientId] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");

  const bmi = calculateBMI(weight, height);
  const category = bmi ? bmiCategory(bmi) : "";

  const isObese = bmi >= 30;
  const isOverweight = bmi >= 25 && bmi < 30;
  const hasHypertension = sys >= 140 || dia >= 90;

  const submit = async () => {
    if (!patientId || !height || !weight || !sys || !dia || !bmi) {
      alert("Please enter all required fields");
      return;
    }

    const payload = {
      resourceType: "Observation",
      status: "final",
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs"
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "85353-1",
            display:
              "Vital signs, weight, height, and BMI panel"
          }
        ],
        text: "Vital Signs Panel"
      },
      subject: {
        reference: `Patient/${patientId}`
      },
      effectiveDateTime: new Date().toISOString(),
      component: [
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "8302-2",
                display: "Body height"
              }
            ]
          },
          valueQuantity: {
            value: height,
            unit: "cm",
            system: "http://unitsofmeasure.org",
            code: "cm"
          }
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "29463-7",
                display: "Body weight"
              }
            ]
          },
          valueQuantity: {
            value: weight,
            unit: "kg",
            system: "http://unitsofmeasure.org",
            code: "kg"
          }
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "39156-5",
                display: "Body mass index"
              }
            ]
          },
          valueQuantity: {
            value: bmi,
            unit: "kg/m2",
            system: "http://unitsofmeasure.org",
            code: "kg/m2"
          }
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "8480-6",
                display: "Systolic blood pressure"
              }
            ]
          },
          valueQuantity: {
            value: sys,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mm[Hg]"
          }
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "8462-4",
                display: "Diastolic blood pressure"
              }
            ]
          },
          valueQuantity: {
            value: dia,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mm[Hg]"
          }
        }
      ]
    };

    await saveObservation(payload);
    onSaved();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <h3>Add Vitals</h3>

      <input
        placeholder="Patient ID"
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
      />

      <input
        placeholder="Height (cm)"
        type="number"
        onChange={e => setHeight(Number(e.target.value))}
      />

      <input
        placeholder="Weight (kg)"
        type="number"
        onChange={e => setWeight(Number(e.target.value))}
      />

      <input
        placeholder="Systolic BP"
        type="number"
        onChange={e => setSys(Number(e.target.value))}
      />

      <input
        placeholder="Diastolic BP"
        type="number"
        onChange={e => setDia(Number(e.target.value))}
      />

      {bmi && (
        <p
          style={{
            color:
              isObese || hasHypertension
                ? "red"
                : isOverweight
                ? "orange"
                : "green"
          }}
        >
          BMI: {bmi} ({category})
          {hasHypertension && " ⚠ High Blood Pressure"}
        </p>
      )}

      <button onClick={submit}>Save</button>
    </div>
  );
}
