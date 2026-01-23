# 🩺 Nidan Vitals – Full-Stack FHIR Vitals Dashboard

Nidan Vitals is a full-stack healthcare dashboard designed for nurses to record patient vitals, calculate BMI in real time, and assess health risks using **FHIR R4 Observation standards**.

The application follows global healthcare interoperability standards (FHIR) and provides real-time clinical decision support through visual alerts and patient risk categorization.

---

## 🚀 Features

- Real-time BMI calculation (kg/m²)
- Automatic BMI categorization:
  - Underweight
  - Normal
  - Overweight
  - Obese
- Visual clinical alerts:
  - 🔴 Red alert for BMI ≥ 30 (Obese)
  - 🔴 Red alert for Blood Pressure ≥ 140 / 90 (Hypertension)
- Patient registry dashboard
- Search patients by **Patient ID**
- Filter patients by BMI category (All | Normal | Overweight | Obese)
- Persistent data storage
- Fully **FHIR R4 compliant**

---

## 🧠 Healthcare Standard (FHIR R4)

All data exchanged between frontend and backend uses a **FHIR R4 Observation resource**.

### Observation Details
- **Panel LOINC:** `85353-1` – Vital signs, weight, height, and BMI panel
- Components:
  - Height (`8302-2`)
  - Weight (`29463-7`)
  - BMI (`39156-5`)
  - Systolic BP (`8480-6`)
  - Diastolic BP (`8462-4`)
- Category: `vital-signs`

FHIR validation is enforced on the backend using the `fhir.resources` library.

---

## 🛠️ Tech Stack

### Frontend
- React (Create React App)
- JavaScript (ES6)
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- `fhir.resources` (FHIR R4 validation)

---

## 📁 Project Structure

frontend/
├─ src/
│ ├─ components/
│ │ ├─ VitalsForm.jsx
│ │ ├─ PatientRegistry.jsx
│ │ ├─ StatusBadge.jsx
│ │ └─ Filters.jsx
│ ├─ utils/
│ │ ├─ bmi.js
│ │ └─ api.js
│ └─ App.jsx
├─ public/
└─ package.json

backend/
├─ main.py
├─ fhir_builder.py
├─ storage.py
└─ requirements.txt


---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run at:
http://localhost:8000

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start

Frontend will run at:
http://localhost:3000