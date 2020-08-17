// Globals
let seek_mouse_down = false;
let current_track_no = 0;
let service_url = 'http://localhost:3000/tracks';
let xhttp = new XMLHttpRequest();
xhttp.open('GET', service_url);
xhttp.onreadystatechange = function () {
    //console.log(this.status);
    if (this.readyState == 4 && this.status == 200) {

        // tracksList.innerText = this.response;
        processTracks(JSON.parse(this.responseText));
    }
}
xhttp.send();

function processTracks(tracks) {
    // console.log(tracks);
    tracksList.innerText = '';
    tracks.forEach((track, index) => {
        let div_track = document.createElement('div');
        let track_no = index + 1;
        div_track.classList.add('track');
        
        div_track.setAttribute('url', track.url);
        div_track.setAttribute('track_no', track_no);

        div_track.addEventListener('click', (event) => {
            playTrack(track_no);
        });

        let span_fav = document.createElement('span');
        span_fav.classList.add('fav_icon');
        span_fav.innerText = '☆'; // ☆ ★
        span_fav.addEventListener('click',()=>{
            console.log('Fav clicked');
            if(this.innerText === '☆'){
                this.innerText = '★'
            }
            else{
                this.innerText = '☆'
            }
        });
        div_track.appendChild(span_fav);

        // let span_play = document.createElement('span');
        // span_play.classList.add('play_icon');
        // span_play.innerText = '▷'; // ▷ ▶️
        // div_track.appendChild(span_play);

        let span_name = document.createElement('span');
        span_name.innerText = track.file_name;
        div_track.appendChild(span_name);

        tracksList.appendChild(div_track);
    });

    // all tracks are loaded into UI
    if(tracks.length>0){
        playTrack(1);
        handlePauseClick();
    }

    // set volume
    volume.min = 0;
    volume.max = 1;
    volume.step = 0.01;
    volume.value = player.volume;
}

// Event Listeners

btn_play.addEventListener('click', () => {
    handlePlayClick(current_track_no);
});

btn_pause.addEventListener('click', () => {
    handlePauseClick();
});

btn_prev.addEventListener('click', () => {
    handlePrevClick();
});

btn_next.addEventListener('click', () => {
    handleNextClick();
});

player.addEventListener('timeupdate', () => {
    handleTimeUpdate();
});

player.addEventListener('volumechange', () => {
    document.getElementById('volume').innerText = `${player.volume}`;
});

player.addEventListener('ended', ()=>{
    handleNextClick();
});

seek.addEventListener('mousedown', () => {
    seek_mouse_down = true;
});

seek.addEventListener('mouseup', () => {
    seek_mouse_down = false;
});

seek.addEventListener('change', () => {
    handleSeek();
});

volume.addEventListener('input', () => {
    handleVolumeChange();
});

// Event Handlers

function handleTimeUpdate() {
    if (!seek_mouse_down) {
        // document.getElementById('progress').innerText = `${player.currentTime} / ${player.duration}`;
        seek.min = 0;
        seek.max = player.duration;
        seek.value = player.currentTime;
    }
}

function setCurrentTrack(track_no) {
    if (current_track_no != 0) {
        document.querySelector(`[track_no="${current_track_no}"]`).classList.remove('current-track');
    }
    if (track_no != 0) {
        document.querySelector(`[track_no="${track_no}"]`).classList.add('current-track');
    }
    current_track_no = track_no;
}

function track(track_no){
    return document.querySelector(`[track_no="${track_no}"]`);
}

function playTrack(track_no){
    let track = document.querySelector(`[track_no="${track_no}"]`);
    // track.scrollIntoView();
    track.scrollIntoViewIfNeeded();
    current_track.innerText = track.innerText;
    setCurrentTrack(track_no);
    player.src = track.getAttribute('url');
    player.currentTime = 0;
    

    handlePlayClick(track_no);    
}

function handlePlayClick(track_no) {
    btn_play.classList.add('hidden');
    btn_pause.classList.remove('hidden');

    player.play();
}

function handlePauseClick() {
    btn_pause.classList.add('hidden');
    btn_play.classList.remove('hidden');

    player.pause();
}

function handlePrevClick(){
    playTrack(current_track_no-1);
}

function handleNextClick(){
    playTrack(current_track_no+1);
}

function handleSeek() {
    player.currentTime = seek.value;
}

function handleVolumeChange() {
    player.volume = volume.value;
}