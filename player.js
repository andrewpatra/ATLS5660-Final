import { ALBUM_DATA } from './album-definition.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon'); 
    const stopIcon = document.getElementById('stop-btn');
    const songTitle = document.getElementById('song-title');
    const trackInfo = document.getElementById('track-info');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const albumListContainer = document.getElementById('album-list-container');
    const wheelSpinner = document.getElementById('wheel-spin');

    let playlist = []; 
    let currentTrackIndex = 0;
    let isPlaying = false;

    const playIconSrc = 'playfill.png'; 
    const pauseIconSrc = 'pausefill.png'; 
    const stopIconSrc = 'stopfill.png';

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadTrack(index) {
        if (playlist.length === 0) return;

        if (index >= playlist.length) {
            index = 0; 
        } else if (index < 0) {
            index = playlist.length - 1; 
        }
        currentTrackIndex = index;

        const filePath = playlist[currentTrackIndex]; 
        
        audioPlayer.src = filePath; 
        
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        
        songTitle.textContent = fileName.slice(0, -4);
        trackInfo.textContent = `Track ${currentTrackIndex + 1} of ${playlist.length}`;
        
        audioPlayer.load();

        if (isPlaying) {
            audioPlayer.play();
        }
    }
    
    function renderAlbumCards() {
        for (const albumKey in ALBUM_DATA) {
            const album = ALBUM_DATA[albumKey];
            
            const card = document.createElement('div');
            card.className = 'album-card';
            card.dataset.albumKey = albumKey; 

            const coverImg = document.createElement('img');
            coverImg.src = album.cover;
            coverImg.alt = `${album.title} cover`;
            card.appendChild(coverImg);
            
            card.addEventListener('click', handleAlbumClick);
            
            albumListContainer.appendChild(card);
        }
    }
    
    function handleAlbumClick(event) {
        const clickedCard = event.currentTarget;
        const albumKey = clickedCard.dataset.albumKey;
        const album = ALBUM_DATA[albumKey];

        if (album) {

            playlist = album.tracks;
            currentTrackIndex = 0;
            
            albumListContainer.classList.add('hidden');
            wheelSpinner.classList.remove('hidden');

            loadTrack(currentTrackIndex);
            
            isPlaying = true;
            audioPlayer.play();
            playPauseIcon.src = pauseIconSrc;
            playPauseIcon.alt = 'Pause';
            
        }
    }

    renderAlbumCards();

    function resetPlayerUI() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    isPlaying = false;
    playPauseIcon.src = playIconSrc;
    playPauseIcon.alt = 'Play';
    
    songTitle.textContent = "Select an album";
    trackInfo.textContent = "";
    currentTimeSpan.textContent = '0:00';
    progressBar.value = 0;

    albumListContainer.classList.remove('hidden'); 
    wheelSpinner.classList.add('hidden');        

    }

    playPauseBtn.addEventListener('click', () => {

      if (isPlaying) {
            audioPlayer.pause();
            playPauseIcon.src = 'playfill.png'; 
            playPauseIcon.alt = 'Play';
            stopIcon.classList.remove('hidden');
        } else {
            audioPlayer.play();
            playPauseIcon.src = 'pausefill.png'; 
            playPauseIcon.alt = 'Pause';
            stopIcon.classList.add('hidden');
        }    
        isPlaying = !isPlaying;
    });

    // Once I figured out how the "system" worked I was able to build out the stop button and its reaction by myself without assistance!
    stopIcon.addEventListener('click', () => {
        resetPlayerUI();
        stopIcon.classList.add('hidden');    
    });

    function playNext() {
        if (playlist.length === 0) return;
        
        const nextIndex = currentTrackIndex + 1;
        
        if (nextIndex >= playlist.length) {
            loadTrack(0); 
        } else {
            loadTrack(nextIndex);
        }
        
        if (!isPlaying) {
            isPlaying = true;
            playPauseIcon.src = pauseIconSrc;
            playPauseIcon.alt = 'Pause';
        }
        audioPlayer.play();
    }

    audioPlayer.addEventListener('ended', playNext);

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
        progressBar.max = Math.floor(audioPlayer.duration);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        progressBar.value = Math.floor(currentTime);
        currentTimeSpan.textContent = formatTime(currentTime);
    });

    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value;
    });

});