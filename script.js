// DOM elements
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const searchInput = document.getElementById('search');
const toggleBtn = document.getElementById('toggleView');
const tableView = document.getElementById('tableView');
const cardView = document.getElementById('cardView');

// load from localStorage
let songs = JSON.parse(localStorage.getItem('playlist')) || [];
let isTableView = true;

// ========= helpers =========
function getYouTubeId(url) {
    const reg = /v=([^&]+)/;
    const match = url.match(reg);
    return match ? match[1] : null;
}

function save() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs();
}

// ========= form submit =========
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const hiddenId = document.getElementById('songId').value;
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const rating = parseInt(document.getElementById('rating').value);
    const ytId = getYouTubeId(url);

    if (!ytId) {
        alert('Invalid YouTube URL (must contain v=...)');
        return;
    }

    if (hiddenId) {
        // update existing
        const song = songs.find(s => s.id == hiddenId);
        if (song) {
            song.title = title;
            song.url = url;
            song.rating = rating;
            song.ytId = ytId;
        }
    } else {
        // add new
        const song = {
            id: Date.now(),
            title,
            url,
            rating,
            ytId,
            dateAdded: new Date().toISOString()
        };
        songs.push(song);
    }

    form.reset();
    document.getElementById('songId').value = '';
    save();
});

// ========= render =========
function getSortedFilteredSongs() {
    const searchText = searchInput.value.toLowerCase();
    const sortValue = document.querySelector('input[name="sort"]:checked').value;

    let arr = songs.filter(s =>
        s.title.toLowerCase().includes(searchText)
    );

    arr.sort((a, b) => {
        if (sortValue === 'title') {
            return a.title.localeCompare(b.title);
        }
        if (sortValue === 'rating') {
            return (b.rating || 0) - (a.rating || 0);
        }
        // default date desc
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
    });

    return arr;
}

function renderSongs() {
    list.innerHTML = '';
    cardView.innerHTML = '';

    const arr = getSortedFilteredSongs();

    arr.forEach(song => {
        const ytId = song.ytId || getYouTubeId(song.url);
        song.ytId = ytId;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" 
                     alt="thumb" width="120">
            </td>
            <td>${song.title}</td>
            <td>${song.rating || '-'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-info me-2" onclick="playSong('${ytId}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);

        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card mb-3">
                <img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">Rating: ${song.rating || '-'}</p>
                    <button class="btn btn-sm btn-info" onclick="playSong('${ytId}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editSong(${song.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cardView.appendChild(col);
    });
}

// initial render
renderSongs();

// ========= actions =========
function deleteSong(id) {
    if (!confirm('Are you sure?')) return;
    songs = songs.filter(song => song.id !== id);
    save();
}

function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('songId').value = song.id;
    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating || '';
}

function playSong(ytId) {
    const url = `https://www.youtube.com/watch?v=${ytId}`;
    window.open(url, '_blank', 'width=900,height=600');
}

// ========= search / sort / toggle =========
searchInput.addEventListener('input', renderSongs);

document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('change', renderSongs);
});

toggleBtn.addEventListener('click', () => {
    isTableView = !isTableView;
    if (isTableView) {
        tableView.classList.remove('d-none');
        cardView.classList.add('d-none');
        toggleBtn.innerHTML = '<i class="fas fa-table"></i>';
    } else {
        tableView.classList.add('d-none');
        cardView.classList.remove('d-none');
        toggleBtn.innerHTML = '<i class="fas fa-th-large"></i>';
    }
});
