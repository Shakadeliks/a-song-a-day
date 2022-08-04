(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const ApiController = (function () { 
    const _getTrackOfTheDay = async () => {
        let songData = await fetch("/song");
        songData = await songData.json();
        return songData;
    };
    return {
        getTrackOfTheDay() {
            return _getTrackOfTheDay();
        }
    }
})();
const UiController = (function () { 
    const coverArt = document.querySelector('#cover_art');
    const songName = document.querySelector('#song_name');
    const artistName = document.querySelector('#artist_name');
    const playPause = document.querySelector('#play_pause');
    const seekSlider = document.querySelector('#seek_slider');
    const currentTime = document.querySelector('#current_time');
    const totalDuration = document.querySelector('#duration');
    const volSlider = document.querySelector('#volume_slider');
    const loader = document.querySelector('.loader');

    return {
        getElement() {
            return {
                coverArt,
                songName,
                artistName,
                playPause,
                seekSlider,
                currentTime,
                totalDuration,
                volSlider,
                loader
            }
        }
    }
})();
const AppController = (function (UiCtrl, ApiCtrl) {   
    const {
        coverArt,
        songName,
        artistName,
        playPause,
        seekSlider,
        currentTime,
        totalDuration,
        volSlider,
        loader
    } = UiCtrl.getElement();

    let curr_track = document.createElement('audio');
    let isPlaying = false;
    let updateTimer;

    const loadSong = async () => {
        clearInterval(updateTimer);
        resetValues();
        const songData = await ApiCtrl.getTrackOfTheDay();
        console.log(songData)
        coverArt.src = songData.coverArt;     
        songName.innerHTML += songData.songName;
        artistName.innerHTML += songData.artistName;
        curr_track.src = songData?.preview_url;
        curr_track.load();
        updateTimer = setInterval(seekUpdate, 1000);
        console.log(curr_track);
    }
    const playPauseToggle = (e) => {
        const icon = playPause;
        const isPlayIcon = icon.classList
        if (isPlayIcon.contains('fa-play')) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else if (isPlayIcon.contains('fa-pause')) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
        console.log(curr_track.src)
    }
    const playPauseSong = (e) => {
        if (!isPlaying) {
            curr_track.play();
            isPlaying = true;
        } else {
            curr_track.pause();
            isPlaying = false;
        }
    }
    const seekUpdate = () => {
        let seekPosition = 0;
        
        if (curr_track.duration) {
            seekPosition = curr_track.currentTime * (100 / curr_track.duration);
            seekSlider.value = seekPosition;
    
            let currentMinutes = Math.floor(curr_track.currentTime / 60);
            let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
            let durationMinutes = Math.floor(curr_track.duration / 60);
            let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
    
            if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
    
            currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
            totalDuration.textContent = `${durationMinutes}:${durationSeconds}`;           
        }    
    }
    const seekTo = () => {
        let seekTo = curr_track.duration * (seekSlider.value / 100);
        curr_track.currentTime = seekTo;
    }
    const setVolume = () => {
        curr_track.volume = volSlider.value / 100;
    }
    const resetValues = () => {
        currentTime.textContent = "00:00";
        totalDuration.textContent = "00:00";
        seekSlider.value = 0;
        console.log(seekSlider.value)
    }
    const loading = () => {
        loader.style.display = "none";
    }
    // bind event listeners
    playPause.addEventListener('click', playPauseToggle);
    playPause.addEventListener('click', playPauseSong);
    curr_track.addEventListener('ended', playPauseToggle);
    curr_track.addEventListener('ended', resetValues);
    volSlider.addEventListener('change', setVolume);

    return {
        init() {
            loadSong();
        }
    }

})(UiController, ApiController);
AppController.init();
},{}]},{},[1]);
