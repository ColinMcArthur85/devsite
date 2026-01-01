const searchForm = document.getElementById("search-form");
/** @type {HTMLInputElement} */
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const orientationSelect = document.getElementById("filter-orientation");
const colorSelect = document.getElementById("filter-color");
const orderSelect = document.getElementById("filter-order");
const perPageSelect = document.getElementById("filter-per-page");
const statusMessage = document.getElementById("status-message");

let keyword = "";
let page = 1;
let isLoading = false;

function setStatus(text, state = "info") {
  statusMessage.textContent = text;
  statusMessage.dataset.state = state;
  statusMessage.hidden = !text;
}

function renderLoadingPlaceholders(count = 9) {
  searchResult.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const placeholder = document.createElement("div");
    placeholder.className = "result-card skeleton";
    frag.appendChild(placeholder);
  }
  searchResult.appendChild(frag);
}

function buildSearchUrl() {
  const params = new URLSearchParams({
    page: String(page),
    query: keyword,
    per_page: perPageSelect.value || "12",
  });

  if (orientationSelect.value) params.append("orientation", orientationSelect.value);
  if (colorSelect.value) params.append("color", colorSelect.value);
  if (orderSelect.value) params.append("order_by", orderSelect.value);

  // In development, use port 8788 where Cloudflare Functions are available
  // In production, use relative path
  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isDev ? "http://localhost:8788" : "";

  return `${baseUrl}/api/unsplash?${params.toString()}`;
}

async function searchImages() {
  keyword = searchBox.value.trim();
  if (!keyword) {
    searchResult.innerHTML = "";
    showMoreBtn.style.display = "none";
    setStatus("Type something to search Unsplash.", "info");
    return;
  }
  if (isLoading) return;

  isLoading = true;
  setStatus("Loading images…", "info");
  showMoreBtn.disabled = true;
  if (page === 1) {
    renderLoadingPlaceholders(Math.min(Number(perPageSelect.value) || 12, 9));
  }

  const url = buildSearchUrl();
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch images");
    const data = await response.json();

    if (page === 1) {
      searchResult.innerHTML = "";
    }

    const results = data.results || [];

    if (results.length === 0) {
      searchResult.innerHTML = '<p class="no-results">No results found. Try another search.</p>';
      showMoreBtn.style.display = "none";
      setStatus("No images found.", "warning");
      return;
    }

    results.forEach((result) => {
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || `Photo related to ${keyword}`;
      image.loading = "lazy";
      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.rel = "noopener noreferrer";

      const photographer = document.createElement("a");
      photographer.href = result.user?.links?.html || result.links.html;
      photographer.target = "_blank";
      photographer.rel = "noopener noreferrer";
      photographer.textContent = result.user?.name || "View on Unsplash";
      photographer.className = "photographer";

      const stats = document.createElement("div");
      stats.className = "card-stats";
      const likes = document.createElement("span");
      likes.textContent = `${result.likes ?? 0} ❤`;
      const views = document.createElement("span");
      views.textContent = result.user?.location ? result.user.location : result.width && result.height ? `${result.width}×${result.height}` : "Unsplash";
      stats.append(likes, views);

      const actions = document.createElement("div");
      actions.className = "card-actions";
      const downloadLink = document.createElement("a");
      downloadLink.href = result.links.download;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";
      downloadLink.textContent = "Download";
      downloadLink.className = "pill";

      const openLink = document.createElement("a");
      openLink.href = result.links.html;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      openLink.textContent = "Open";
      openLink.className = "pill ghost";

      actions.append(openLink, downloadLink);

      const cardInfo = document.createElement("div");
      cardInfo.className = "card-info";
      cardInfo.append(photographer, stats, actions);

      const card = document.createElement("article");
      card.className = "result-card";
      imageLink.appendChild(image);
      card.append(imageLink, cardInfo);
      searchResult.appendChild(card);
    });

    const hasMore = page < (data.total_pages || 1);
    showMoreBtn.style.display = hasMore ? "block" : "none";
    setStatus(`Showing page ${page} of ${data.total_pages || 1} for “${keyword}”`, "success");
  } catch (err) {
    console.error(err);
    searchResult.innerHTML = '<p class="error">Something went wrong. Please try again.</p>';
    showMoreBtn.style.display = "none";
    setStatus("Error loading images.", "error");
  } finally {
    isLoading = false;
    showMoreBtn.disabled = false;
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

[orientationSelect, colorSelect, orderSelect, perPageSelect].forEach((control) =>
  control.addEventListener("change", () => {
    page = 1;
    searchImages();
  }),
);

showMoreBtn.addEventListener("click", () => {
  page++;
  searchImages();
});
