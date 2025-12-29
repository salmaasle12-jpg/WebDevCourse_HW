// Run the script after the page is fully loaded
window.onload = function () {

  // Load playlists from localStorage
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  let currentPlaylistName = null;

  loadPlaylists();

  // Load all playlists into the sidebar
  function loadPlaylists() {
    const list = document.getElementById("playlistList");
    list.innerHTML = "";

    for (let name in playlists) {
      const li = document.createElement("li");
      li.style.marginBottom = "8px";
      li.innerHTML = `
        <b>${name}</b> (${playlists[name].length})
        <button onclick="openPlaylist('${name}')">Open</button>
        <button onclick="deletePlaylist('${name}')">Delete</button>
      `;
      list.appendChild(li);
    }

    // Open playlist from URL if exists
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("playlist");
    if (fromUrl && playlists[fromUrl]) {
      openPlaylist(fromUrl);
    }
  }

  // Open selected playlist
  window.openPlaylist = function (name) {
    currentPlaylistName = name;
    document.getElementById("playlistTitle").innerText = name;
    window.history.pushState({}, "", "?playlist=" + name);
    renderVideos();
  };

  // Render videos of the current playlist
  function renderVideos() {
    const tbody = document.getElementById("videosTable");
    tbody.innerHTML = "";

    if (!currentPlaylistName) return;

    let videos = [...playlists[currentPlaylistName]];

    // Filter videos by search text
    const search = document.getElementById("searchVideo").value.toLowerCase();
    if (search) {
      videos = videos.filter(v => v.title.toLowerCase().includes(search));
    }

    // Sort videos alphabetically
    const sort = document.getElementById("sortSelect").value;
    videos.sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

    // Display videos in table
    videos.forEach((video, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="cursor:pointer; color:blue; text-decoration:underline;"
            onclick="openVideo('${video.videoId}')">
          ${video.title}
        </td>
        <td>
          <button onclick="deleteVideo(${index})">Delete</button>
          <button onclick="moveVideo(${index})">Move</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update list on search or sort
  document.getElementById("searchVideo").addEventListener("input", renderVideos);
  document.getElementById("sortSelect").addEventListener("change", renderVideos);

  // Create a new playlist
  document.getElementById("newPlaylistBtn").addEventListener("click", () => {
    const name = prompt("New playlist name:");
    if (!name || playlists[name]) return;

    playlists[name] = [];
    save();
    loadPlaylists();
  });

  // Delete an entire playlist
  window.deletePlaylist = function (name) {
    if (!confirm("Delete playlist '" + name + "' ?")) return;

    delete playlists[name];
    save();
    loadPlaylists();

    if (currentPlaylistName === name) {
      currentPlaylistName = null;
      document.getElementById("playlistTitle").innerText = "Select a playlist";
      document.getElementById("videosTable").innerHTML = "";
    }
  };

  // Delete a video from playlist
  window.deleteVideo = function (index) {
    playlists[currentPlaylistName].splice(index, 1);
    save();
    renderVideos();
    loadPlaylists();
  };

  // Move a video to another playlist
  window.moveVideo = function (index) {
    const target = prompt("Move to which playlist?");
    if (!target || !playlists[target]) return;

    const video = playlists[currentPlaylistName][index];
    playlists[target].push(video);
    playlists[currentPlaylistName].splice(index, 1);

    save();
    renderVideos();
    loadPlaylists();
  };

  // Open video on YouTube in a new tab
  window.openVideo = function (videoId) {
    window.open("https://www.youtube.com/watch?v=" + videoId, "_blank");
  };

  // Save playlists to localStorage
  function save() {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }

};

