// Copy text to clipboard and provide feedback
function copyToClipboard(element) {
  navigator.clipboard
    .writeText(element.textContent)
    .then(() => {
      // Temporarily change the content to "Copied!"
      const originalText = element.textContent;
      const originalColor = element.style.color;

      element.textContent = "Copied!";
      element.classList.add("copied");

      setTimeout(() => {
        element.textContent = originalText; // Revert text
        element.classList.remove("copied"); // Revert color
      }, 500);
    })
    .catch((error) => {
      console.error("Failed to copy text:", error);
      alert("Failed to copy text. Please try again.");
    });
}

// Initialize the app by fetching the color scheme
function init() {
  // Remove # from the color code to format it for the API request
  const seedColor = document.querySelector("#seed-color").value.slice(1);
  const schemeMode = document.querySelector("#scheme-mode").value;

  console.log(seedColor, schemeMode);
  fetchColorScheme(seedColor, schemeMode);
}

// Fetch color scheme from the Colors API
function fetchColorScheme(seedColor, schemeMode) {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${schemeMode}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      renderColorScheme(data.colors);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Render the color scheme dynamically
function renderColorScheme(colors) {
  const outputContainer = document.querySelector("#color-scheme-output");
  outputContainer.innerHTML = "";

  colors.forEach((color) => {
    const colorWrapper = document.createElement("div");
    colorWrapper.classList.add("color-wrapper");

    const colorBlock = document.createElement("div");
    colorBlock.classList.add("color-block");
    colorBlock.style.backgroundColor = color.hex.value;

    const colorCode = document.createElement("span");
    colorCode.classList.add("color-code");
    colorCode.textContent = color.hex.value;

    // Add event listeners to copy color code to clipboard
    [colorBlock, colorCode].forEach((element) => {
      element.addEventListener("click", () => copyToClipboard(colorCode));
    });

    colorWrapper.append(colorBlock, colorCode);
    outputContainer.appendChild(colorWrapper);
  });
}

function setupEventListeners() {
  document
    .querySelector("#color-scheme-generator")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      init();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Trigger the color scheme generation on page load
  init();

  // Trigger the color scheme generation on form submission
  setupEventListeners();
});
