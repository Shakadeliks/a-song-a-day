const ApiController = (function () { 
    
})();
const UiController = (function () { 
    const genreGrid = document.querySelector('.genres_grid');
    const searchBtn = document.querySelector('.search_btn');
    return {
        getElement() {
            return {
                genreGrid,
                searchBtn
            }
        }
    }
})();
const AppController = (function (UiCtrl, ApiCtrl) {   
    const {
        genreGrid,
        searchBtn
    } = UiCtrl.getElement();

    let chosenGenre;
    const chooseGenre = (e) => {
        chosenGenre = [];
        chosenGenre.push(e.target.value)
    }
    const searchSong = async () => {
        const fetchSong = "/searchsong";
        const searchAddress = `${fetchSong}?genre=${chosenGenre[0]}`
        window.location = searchAddress;
    }
    // // bind event listeners

    genreGrid.addEventListener('click', chooseGenre);
    searchBtn.addEventListener('click', searchSong);
    return {
        init() {
        }
    }

})(UiController, ApiController);
AppController.init();