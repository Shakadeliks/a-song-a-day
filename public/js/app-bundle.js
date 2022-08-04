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
    const playPause = document.querySelector('#play_pause');
    const seekSlider = document.querySelector('#seek_slider');
    const currentTime = document.querySelector('#current_time');
    const totalDuration = document.querySelector('#duration');
    const volSlider = document.querySelector('#volume_slider');
    const loader = document.querySelector('.loader');
    const audio = document.querySelector('audio');
    // const searchLink = document.querySelector('#search_link');

    return {
        getElement() {
            return {
                playPause,
                seekSlider,
                currentTime,
                totalDuration,
                volSlider,
                loader,
                audio,
                // searchLink
            }
        }
    }
})();
const AppController = (function (UiCtrl, ApiCtrl) {   
    const {
        playPause,
        seekSlider,
        currentTime,
        totalDuration,
        volSlider,
        loader,
        audio,
        // searchLink
    } = UiCtrl.getElement();

    let isPlaying = false;
    let updateTimer;

    const loadSong = async () => {
        clearInterval(updateTimer);
        resetValues();
        audio.load();
        updateTimer = setInterval(seekUpdate, 1000);
        console.log(audio);
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
    }
    const playPauseSong = (e) => {

        if (!isPlaying) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
    }
    const seekUpdate = () => {
        let seekPosition = 0;
        
        if (audio.duration) {
            seekPosition = audio.currentTime * (100 / audio.duration);
            seekSlider.value = seekPosition;
    
            let currentMinutes = Math.floor(audio.currentTime / 60);
            let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
            let durationMinutes = Math.floor(audio.duration / 60);
            let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);
    
            if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
    
            currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
            totalDuration.textContent = `${durationMinutes}:${durationSeconds}`;           
        }    
    }
    const seekTo = () => {
        let seekTo = audio.duration * (seekSlider.value / 100);
        audio.currentTime = seekTo;
    }
    const setVolume = () => {
        audio.volume = volSlider.value / 100;
    }
    const resetValues = () => {
        currentTime.textContent = "00:00";
        totalDuration.textContent = "00:00";
        seekSlider.value = 0;
        console.log(seekSlider.value)
    }
    const linkToSearch = () => {
        console.log("link is firing")
        window.location.href = '/search';
    }
    // bind event listeners
    playPause.addEventListener('click', playPauseToggle);
    playPause.addEventListener('click', playPauseSong);
    audio.addEventListener('ended', playPauseToggle);
    audio.addEventListener('ended', resetValues);
    volSlider.addEventListener('change', setVolume);
    // searchLink.addEventListener('click', linkToSearch);

    return {
        init() {
            loadSong();
        }
    }

})(UiController, ApiController);
window.onload = AppController.init();
},{}]},{},[1]);
