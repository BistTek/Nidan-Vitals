export function calculateBMI(weight, height) {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }

  const h = height / 100;
  return Number((weight / (h * h)).toFixed(1));
}

export function bmiCategory(bmi) {
  if (bmi == null) return "";
  if (bmi >= 30) return "Obese";
  if (bmi >= 25) return "Overweight";
  if (bmi >= 18.5) return "Normal";
  return "Underweight";
}
