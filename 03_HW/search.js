// YouTube API key
const API_KEY = "your API key";

// Store selected video for playlist
let selectedVideo = null;

// Read search query from URL
const params = new URLSearchParams(window.location.search);
const queryFromUrl = params.get("q");

// Auto search if query exists in URL
if (queryFromUrl) {
  document.getElementById("searchInput").value = queryFromUrl;
  searchVideos(queryFromUrl);
}

// Handle search button click
document.getElementById("searchBtn").addEventListener("click", () => {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return;

  window.history.pushState({}, "", "?q=" + q);
  searchVideos(q);
});

// Search videos using YouTube API
function searchVideos(query) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${query}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => showResults(data.items));
}

// Get video duration and view count
function getVideoDetails(videoId, callback) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoId}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => callback(data.items[0]));
}

// Display search results in table
function showResults(videos) {
  const tbody = document.getElementById("results");
  tbody.innerHTML = "";

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const image = video.snippet.thumbnails.medium.url;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <img src="${image}" width="120" style="cursor:pointer"
             onclick="openModal('${videoId}')">
      </td>

      <td title="${title}"
          style="cursor:pointer; text-decoration:underline;"
          onclick="openModal('${videoId}')">
        ${title.length > 30 ? title.substring(0,30) + "..." : title}
      </td>

      <td>...</td>
      <td>...</td>

      <td>
        <button onclick="openAddModal('${title}','${videoId}')">
          הוסף למועדפים
        </button>
      </td>
    `;

    tbody.appendChild(tr);

    // Load duration and views asynchronously
    getVideoDetails(videoId, details => {
      tr.children[2].innerText = details.contentDetails.duration;
      tr.children[3].innerText = details.statistics.viewCount;
    });
  });
}

// Open modal to add video to playlist
function openAddModal(title, videoId) {
  selectedVideo = { title, videoId };

  const playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  const select = document.getElementById("playlistSelect");
  select.innerHTML = "";

  for (let name in playlists) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    select.appendChild(opt);
  }

  document.getElementById("addModal").style.display = "block";
}

// Close add-to-playlist modal
function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
}

// Add selected video to playlist
function confirmAdd() {
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  let name = document.getElementById("newPlaylistName").value;

  if (!name) {
    name = document.getElementById("playlistSelect").value;
  }

  if (!name) return;

  if (!playlists[name]) {
    playlists[name] = [];
  }

  playlists[name].push(selectedVideo);
  localStorage.setItem("playlists", JSON.stringify(playlists));

  closeAddModal();
  showToast();

  setTimeout(() => {
    window.location.href = "playlists.html";
  }, 1200);
}

// Show success toast message
function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 1000);
}

// Open video preview modal
function openModal(videoId) {
  document.getElementById("videoFrame").src =
    "https://www.youtube.com/embed/" + videoId;
  document.getElementById("videoModal").style.display = "block";
}

// Close video modal
function closeModal() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("videoFrame").src = "";
}
