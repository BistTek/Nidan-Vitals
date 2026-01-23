from fhir.resources.observation import Observation
from datetime import datetime


def build_fhir_observation(
    patient_id: str,
    height: float,
    weight: float,
    bmi: float,
    sys_bp: int,
    dia_bp: int
) -> dict:
    """
    Build a valid FHIR R4 Observation resource for vitals
    using LOINC 85353-1 Vital Signs Panel.
    """

    # Basic safety validation (recommended)
    if height <= 0 or weight <= 0:
        raise ValueError("Height and weight must be positive values")

    if sys_bp <= 0 or dia_bp <= 0:
        raise ValueError("Blood pressure values must be positive")

    bmi = round(bmi, 1)

    observation = Observation(
        status="final",
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code={
            "coding": [{
                "system": "http://loinc.org",
                "code": "85353-1",
                "display": "Vital signs, weight, height, and BMI panel"
            }],
            "text": "Vital Signs Panel"
        },
        subject={
            "reference": f"Patient/{patient_id}"
        },
        effectiveDateTime=datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        component=[
            {
                "code": {
                    "coding": [{
                        "system": "http://loinc.org",
                        "code": "8302-2",
                        "display": "Body height"
                    }]
                },
                "valueQuantity": {
                    "value": height,
                    "unit": "cm",
                    "system": "http://unitsofmeasure.org",
                    "code": "cm"
                }
            },
            {
                "code": {
                    "coding": [{
                        "system": "http://loinc.org",
                        "code": "29463-7",
                        "display": "Body weight"
                    }]
                },
                "valueQuantity": {
                    "value": weight,
                    "unit": "kg",
                    "system": "http://unitsofmeasure.org",
                    "code": "kg"
                }
            },
            {
                "code": {
                    "coding": [{
                        "system": "http://loinc.org",
                        "code": "39156-5",
                        "display": "Body mass index"
                    }]
                },
                "valueQuantity": {
                    "value": bmi,
                    "unit": "kg/m2",
                    "system": "http://unitsofmeasure.org",
                    "code": "kg/m2"
                }
            },
            {
                "code": {
                    "coding": [{
                        "system": "http://loinc.org",
                        "code": "8480-6",
                        "display": "Systolic blood pressure"
                    }]
                },
                "valueQuantity": {
                    "value": sys_bp,
                    "unit": "mmHg",
                    "system": "http://unitsofmeasure.org",
                    "code": "mm[Hg]"
                }
            },
            {
                "code": {
                    "coding": [{
                        "system": "http://loinc.org",
                        "code": "8462-4",
                        "display": "Diastolic blood pressure"
                    }]
                },
                "valueQuantity": {
                    "value": dia_bp,
                    "unit": "mmHg",
                    "system": "http://unitsofmeasure.org",
                    "code": "mm[Hg]"
                }
            }
        ]
    )

    return observation.dict()
