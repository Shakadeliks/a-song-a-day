const ApiController = (function () { 
    
})();
const UiController = (function () { 
    const newSongBtn = document.querySelector('#new_song_btn');
    const playPause = document.querySelector('#play_pause');
    const seekSlider = document.querySelector('#seek_slider');
    const currentTime = document.querySelector('#current_time');
    const totalDuration = document.querySelector('#duration');
    const volSlider = document.querySelector('#volume_slider');
    const audio = document.querySelector('audio');
    return {
        getElement() {
            return {
                newSongBtn,
                playPause,
                seekSlider,
                currentTime,
                totalDuration,
                volSlider,
                audio,
            }

        }
    }
})();
const AppController = (function (UiCtrl, ApiCtrl) {   
    const {
        newSongBtn,
        playPause,
        seekSlider,
        currentTime,
        totalDuration,
        volSlider,
        audio,
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

    const searchSong = async () => {
        const fetchSong = "/searchsong";
        const genre = newSongBtn.value;
        const searchAddress = `${fetchSong}?genre=${genre}`
        window.location = searchAddress;
    }
    // // bind event listeners
    newSongBtn.addEventListener('click', searchSong);
    playPause.addEventListener('click', playPauseToggle);
    playPause.addEventListener('click', playPauseSong);
    audio.addEventListener('ended', playPauseToggle);
    audio.addEventListener('ended', resetValues);
    volSlider.addEventListener('change', setVolume);
    seekSlider.addEventListener('change', seekTo);

    return {
        init() {
            loadSong()
        }
    }

})(UiController, ApiController);
AppController.init();