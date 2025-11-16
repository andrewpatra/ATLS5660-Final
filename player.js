document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM Elements and State Variables
    const fileInput = document.getElementById('music-file-input');
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const songTitle = document.getElementById('song-title');
    const trackInfo = document.getElementById('track-info');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    

    // State for the playlist
    let playlist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Helper function to format time (seconds to m:ss)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Function to load and play a specific track from the playlist
    function loadTrack(index) {
        if (playlist.length === 0) return;

        // Ensure index wraps around if necessary (optional)
        if (index >= playlist.length) {
            index = 0; // Loop back to the start
        } else if (index < 0) {
            index = playlist.length - 1; // Go to the last track
        }
        currentTrackIndex = index;

        const file = playlist[currentTrackIndex];
        const fileURL = URL.createObjectURL(file);
        
        audioPlayer.src = fileURL;
        songTitle.textContent = file.name;
        trackInfo.textContent = `Track ${currentTrackIndex + 1} of ${playlist.length}`;
        
        audioPlayer.load();

        if (isPlaying) {
            audioPlayer.play();
        }
    }

    // 2. Handle File Input (Loading the album)
    fileInput.addEventListener('change', (event) => {
        // Convert the FileList object into a true Array
        const files = Array.from(event.target.files); 
        
        if (files.length > 0) {
            // Sort files alphabetically to ensure tracks play in order (e.g., 01-track.mp3, 02-track.mp3)
            playlist = files.sort((a, b) => a.name.localeCompare(b.name));
            currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
            
            // Set up initial state for playing
            playPauseIcon.src = 'playfill.png'; // Set to Play icon initially
            playPauseIcon.alt = 'Play';
            isPlaying = false;
        }
    });

    // 3. Handle Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (playlist.length === 0) {
            alert('Please select an album (multiple music files) first!');
            return;
        }

      if (isPlaying) {
            audioPlayer.pause();
            playPauseIcon.src = 'playfill.png'; 
            playPauseIcon.alt = 'Play';
        } else {
            audioPlayer.play();
            playPauseIcon.src = 'pausefill.png'; 
            playPauseIcon.alt = 'Pause';
        }    
        isPlaying = !isPlaying;
    });

    // 6. Automatic Next Track on End
    audioPlayer.addEventListener('ended', playNext);

    // 7. Update Progress Bar and Time Display (Unchanged)
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
        progressBar.max = Math.floor(audioPlayer.duration);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        progressBar.value = Math.floor(currentTime);
        currentTimeSpan.textContent = formatTime(currentTime);
    });

    // 8. Handle Progress Bar Interaction (Seek) (Unchanged)
    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value;
    });

});