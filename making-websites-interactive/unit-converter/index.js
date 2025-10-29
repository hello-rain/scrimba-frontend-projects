/*
1 meter = 3.281 feet
1 liter = 0.264 gallon
1 kilogram = 2.204 pound
*/

// Select the button and input field only once (Performance Improvement)
const convertBtn = document.getElementById("convert-btn");
const unitInput = document.getElementById("unit-value");

// Helper function to round down to 3 decimal places
const roundDown = (num) => Math.floor(num * 1000) / 1000;

// Generalized conversion function
function convertUnit(value, conversionFactor) {
  return {
    convertedValue: roundDown(value * conversionFactor),
    reversedValue: roundDown(value / conversionFactor),
  };
}

// Function to update the UI
function updateUI(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = value;
}

// Main conversion function
function performConversions(unitValue) {
  // Update input display in all places
  document.querySelectorAll(".unit-value-user").forEach((el) => {
    el.textContent = unitValue;
  });

  // Convert and update Length
  const length = convertUnit(unitValue, 3.281);
  updateUI("length-feet", length.convertedValue);
  updateUI("length-meters-reverse", length.reversedValue);

  // Convert and update Volume
  const volume = convertUnit(unitValue, 0.264);
  updateUI("volume-gallons", volume.convertedValue);
  updateUI("volume-liters-reverse", volume.reversedValue);

  // Convert and update Mass
  const mass = convertUnit(unitValue, 2.204);
  updateUI("mass-pounds", mass.convertedValue);
  updateUI("mass-kilograms-reverse", mass.reversedValue);
}

// Event listener for the conversion button
convertBtn.addEventListener("click", function () {
  const unitValue = parseFloat(unitInput.value) || 0; // Ensure it's a number
  console.log(`User Input: ${unitValue}`);
  performConversions(unitValue);
});
