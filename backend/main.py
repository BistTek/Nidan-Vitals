from fastapi import FastAPI, Query, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from sqlalchemy.orm import Session
from fhir.resources.observation import Observation
from datetime import datetime

from storage import SessionLocal, ObservationModel

app = FastAPI(title="Nidan Vitals API")

# ------------------------
# CORS (Required for React)
# ------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Database Dependency
# ------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------
# Helper Functions
# ------------------------
def get_bmi(observation: dict):
    for comp in observation.get("component", []):
        if comp["code"]["coding"][0]["code"] == "39156-5":
            return comp["valueQuantity"]["value"]
    return None

def has_hypertension(observation: dict):
    systolic = None
    diastolic = None

    for comp in observation.get("component", []):
        code = comp["code"]["coding"][0]["code"]
        if code == "8480-6":
            systolic = comp["valueQuantity"]["value"]
        elif code == "8462-4":
            diastolic = comp["valueQuantity"]["value"]

    return (
        systolic is not None
        and diastolic is not None
        and (systolic >= 140 or diastolic >= 90)
    )

# ------------------------
# JSON-safe datetime serializer
# ------------------------
def json_safe(obj):
    if isinstance(obj, dict):
        return {k: json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [json_safe(v) for v in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

# ------------------------
# POST: Create Observation
# ------------------------
@app.post("/api/fhir/observation", status_code=status.HTTP_201_CREATED)
def create_observation(payload: dict, db: Session = Depends(get_db)):
    # Validate FHIR R4 Observation
    try:
        observation = Observation(**payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Enforce Vital Signs category
    if not observation.category or not any(
        c.coding and c.coding[0].code == "vital-signs"
        for c in observation.category
    ):
        raise HTTPException(
            status_code=400,
            detail="Observation must belong to vital-signs category"
        )

    # Enforce correct LOINC panel
    if observation.code.coding[0].code != "85353-1":
        raise HTTPException(
            status_code=400,
            detail="Invalid Observation panel code (expected LOINC 85353-1)"
        )

    # Enforce required components
    required_codes = {
        "8302-2",  # Height
        "29463-7", # Weight
        "39156-5", # BMI
        "8480-6",  # Systolic BP
        "8462-4"   # Diastolic BP
    }

    component_codes = {
        c.code.coding[0].code
        for c in observation.component
    }

    missing = required_codes - component_codes
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required vitals: {sorted(missing)}"
        )

    # Persist Observation
    patient_id = observation.subject.reference.replace("Patient/", "")

    observation_data = observation.dict(by_alias=True, exclude_none=True)
    observation_data = json_safe(observation_data)  # Fix: convert datetimes

    record = ObservationModel(
        patient_id=patient_id,
        data=observation_data
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {"message": "Observation stored successfully"}

# ------------------------
# GET: Retrieve Observations
# ------------------------
@app.get("/api/fhir/observation")
def get_observations(
    patient_id: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    records = db.query(ObservationModel).all()
    results = [r.data for r in records]

    # Filter by Patient ID
    if patient_id:
        results = [
            o for o in results
            if o["subject"]["reference"] == f"Patient/{patient_id}"
        ]

    # Filter by BMI category
    if bmi_category:
        if bmi_category == "Normal":
            results = [
                o for o in results
                if (bmi := get_bmi(o)) is not None and 18.5 <= bmi < 25
            ]
        elif bmi_category == "Overweight":
            results = [
                o for o in results
                if (bmi := get_bmi(o)) is not None and 25 <= bmi < 30
            ]
        elif bmi_category == "Obese":
            results = [
                o for o in results
                if (bmi := get_bmi(o)) is not None and bmi >= 30
            ]
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid BMI category"
            )

    return results

# ------------------------
# Health Check
# ------------------------
@app.get("/")
def root():
    return {"status": "Nidan Vitals API is running"}
