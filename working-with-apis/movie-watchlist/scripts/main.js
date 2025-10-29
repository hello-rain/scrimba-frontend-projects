// 0. Global variables
let currentFilms = [];

// 1. Event listeners / entry point

function init() {
  document
    .querySelector("#film-form")
    .addEventListener("submit", handleFilmSearch);

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more-btn")) {
      renderFullPlot(e);
    } else if (e.target.classList.contains("add-to-watchlist-btn")) {
      addToWatchlist(e);
    } else if (e.target.classList.contains("remove-from-watchlist-btn")) {
      removeFromWatchlist(e);
    }
  });
}

// 2. Main handler/controller functions

// Handle form submission for searching films
function handleFilmSearch(e) {
  e.preventDefault(); // Prevent default form submission
  const filmInput = document.querySelector("#film-input").value.trim();
  if (filmInput) {
    fetchFilms(filmInput);
  }
}

function addToWatchlist(e) {
  const imdbID = e.target.getAttribute("data-imdbid");
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.includes(imdbID)) {
    watchlist.push(imdbID);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    renderFilms(currentFilms);
  }
}

function removeFromWatchlist(e) {
  const imdbID = e.target.getAttribute("data-imdbid");
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((id) => id != imdbID);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderFilms(currentFilms);
}

// 3. Rendering/UI functions
// Display films based on user search input
async function renderFilms(films) {
  // Fetch details for all films
  const filmDetails = await Promise.all(
    films.map((film) => fetchFilmDetail(film.imdbID))
  );

  // Generate HTML for each film
  const filmCardsHTML = filmDetails
    .map((film) => generateFilmCardHTML(film))
    .join("");

  document.querySelector(".films-container").innerHTML = `
  <div class="films">${filmCardsHTML}</div>
  `;
}

function renderError(message) {
  document.querySelector(".films-container").innerHTML = `
  <p class="state-message">${message}</p>`;
}

function renderFullPlot(e) {
  const plotEl = e.target.closest(".film-plot");
  if (plotEl) {
    plotEl.textContent = plotEl.getAttribute("data-fullplot");
  }
}

// 4. Helper/utility functions

// Fetch a list of films from OMDb API based on user search input
async function fetchFilms(filmInput) {
  try {
    // Make a request to the OMDB API with the search query
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/?apikey=${CONFIG.OMDB_API_KEY}&s=${filmInput}`
    );
    if (!response.ok) {
      const message = "Network response was not ok";
      renderError(message);
      throw new Error(message);
    }
    const data = await response.json();

    // If the API returns no results, show an error message and exit
    if (data.Response === "False") {
      const message =
        "Unable to find what you’re looking for. Please try another search.";
      renderError(message);
      return;
    }
    // Render the list of films if results are found
    currentFilms = data.Search;
    renderFilms(data.Search);
  } catch (error) {
    const message = "Error fetching data.";
    renderError(message);
    console.error(error);
  }
}

// Fetch full details for a single film by IMDb ID
async function fetchFilmDetail(imdbID) {
  try {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/?apikey=${CONFIG.OMDB_API_KEY}&i=${imdbID}`
    );
    if (!response.ok) {
      const message = "Network response was not ok";
      renderError(message);
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message = "Error fetching data.";
    renderError(message);
    console.log(error);
  }
}

function generateFilmCardHTML(film) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const inWatchlist = watchlist.includes(film.imdbID);

  const charLimit = 130;
  const isLong = film.Plot.length > charLimit;
  const shortPlot = isLong ? film.Plot.slice(0, charLimit) + "..." : film.Plot;

  return `
  <div class="film">
    <img src="${film.Poster}" alt="${film.Title} poster" class="film-poster"/>
    <div class="film-details">
      <div class="film-header">
        <h3 class="film-title">${film.Title}</h3>
        <span>
        <img src="assets/icons/rating.svg">
        ${film.imdbRating}
        </span>
      </div>
      <div class="film-meta-group">
        <span>${film.Runtime}</span>
        <span>${film.Genre}</span>

        ${
          inWatchlist
            ? `<button
                type="button"
                class="watchlist-btn remove-from-watchlist-btn"
                aria-label="Remove ${film.Title} from watchlist"
                data-imdbid="${film.imdbID}"
              >
                <span aria-hidden="true">
                  <img src="assets/icons/watchlist-remove.svg">
                </span>
                Remove
              </button>`
            : `<button
                type="button"
                class="watchlist-btn add-to-watchlist-btn"
                aria-label="Add ${film.Title} to watchlist"
                data-imdbid="${film.imdbID}"
              >
                <span aria-hidden="true">
                  <img src="assets/icons/watchlist-add.svg">
                </span>
                Watchlist
              </button>`
        }


      </div>
      <p class="film-plot" data-fullplot="${film.Plot.replace(/"/g, "&quot;")}">
      ${shortPlot}
      ${
        isLong
          ? `<button class="read-more-btn" type="button">Read more</button> `
          : ""
      }
      </p>
    </div>
  </div>
`;
}

init();
