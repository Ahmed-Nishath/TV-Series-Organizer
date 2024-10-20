const API_URL = "https://api.themoviedb.org/3/search/tv?api_key=2388d83c5310e9d91ca1291bde91f2e4&query=";
let selectedSeries = [];
let darkMode = false;

document.getElementById("search-input").addEventListener("input", function () {
    const query = this.value.trim();
    if (query) {
        fetchSuggestions(query);
    } else {
        clearSuggestions();
    }
});

document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode);

document.getElementById("download-btn").addEventListener("click", downloadList);

document.getElementById("file-input").addEventListener("change", loadListFromFile);

function fetchSuggestions(query) {
    fetch(API_URL + query)
        .then(response => response.json())
        .then(data => displaySuggestions(data.results))
        .catch(err => console.error(err));
}

function displaySuggestions(seriesList) {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = "";
    
    seriesList.forEach(series => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}"><span>${series.name}</span>`;
        suggestionItem.addEventListener("click", () => addToPlaylist(series));
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function addToPlaylist(series) {
    if (!selectedSeries.some(s => s.id === series.id)) {
        selectedSeries.push(series);
        updateSelectedSeries();
    }
    clearSuggestions();
}

function updateSelectedSeries() {
    const selectedSeriesContainer = document.getElementById("selected-series");
    selectedSeriesContainer.innerHTML = "";
    
    selectedSeries.forEach(series => {
        const seriesCard = document.createElement("div");
        seriesCard.classList.add("series");
        seriesCard.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}"><h2>${series.name}</h2>`;
        seriesCard.addEventListener("click", () => showModal(series));
        selectedSeriesContainer.appendChild(seriesCard);
    });
}

function showModal(series) {
    document.getElementById("series-title").innerText = series.name;
    document.getElementById("series-overview").innerText = series.overview;
    document.getElementById("series-rating").innerText = `Rating: ${series.vote_average}`;
    document.getElementById("series-seasons").innerText = `Seasons: ${series.number_of_seasons}`;
    document.getElementById("series-genres").innerText = `Genres: ${series.genre_ids.join(', ')}`;
    document.getElementById("series-status").innerText = `Status: ${series.status}`;
    
    document.getElementById("modal").style.display = "block";
    
    document.getElementById("mark-watched").onclick = () => markAsWatched(series);
}

document.getElementById("close-modal").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

function markAsWatched(series) {
    const index = selectedSeries.findIndex(s => s.id === series.id);
    if (index > -1) {
        selectedSeries.splice(index, 1);
        updateSelectedSeries();
    }
    document.getElementById("modal").style.display = "none";
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
}

function downloadList() {
    const dataStr = JSON.stringify(selectedSeries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "tv_series_playlist.json";
    a.click();
    URL.revokeObjectURL(url);
}

function loadListFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            try {
                selectedSeries = JSON.parse(content);
                updateSelectedSeries();
            } catch (err) {
                console.error("Error parsing JSON", err);
            }
        };
        reader.readAsText(file);
    }
}

function clearSuggestions() {
    document.getElementById("suggestions").innerHTML = "";
}
