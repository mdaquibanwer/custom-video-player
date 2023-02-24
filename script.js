const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
progressBar = container.querySelector(".progress-bar"),
videoTimeline = container.querySelector(".video-timeline"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
videoCurrentTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
playPauseBtn = container.querySelector(".play-pause i"),
skipBackward = container.querySelector(".skip-backward"),
skipForward = container.querySelector(".skip-forward"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicBtn = container.querySelector(".pic-in-pic"),
fullscreenBtn = container.querySelector(".fullscreen i");

let timer;

const hideControls = ()=>{
    if(mainVideo.paused) return;    // if video is paused return
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 4000);
}
hideControls();

container.addEventListener("mousemove",()=>{
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
})

playPauseBtn.addEventListener("click",()=>{
    // if video is paused then play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
})

// function to formattime;
const formatTime = (time)=>{
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;   // adding 0 if its less than 10
    minutes = minutes < 10 ? `0${minutes}` : minutes;   // adding 0 if its less than 10
    hours = hours < 10 ? `0${hours}` : hours;           // adding 0 if its less than 10

    if(hours == 0){
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener("timeupdate",(e)=>{
    let {currentTime,duration}  = e.target //getting current time & duration of the video
    // console.log(currentTime,duration)
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;    // passing width in the percent
    videoCurrentTime.innerText = formatTime(currentTime);
})
mainVideo.addEventListener("loadeddata",(e)=>{
    videoDuration.innerText = formatTime(e.target.duration);
})
volumeBtn.addEventListener("click",()=>{
    if(!volumeBtn.classList.contains("fa-volume-high")){
        mainVideo.volume = 0.5; // passing 0.5 as video volume
        volumeBtn.classList.replace("fa-volume-mute","fa-volume-high")
    }else{
        mainVideo.volume = 0.0; // passing video volume as mute
        volumeBtn.classList.replace("fa-volume-high","fa-volume-mute");
    }
    volumeSlider.value = mainVideo.volume;
})
volumeSlider.addEventListener("input",(e)=>{
    mainVideo.volume = e.target.value;  // passing slider volume as video volume
    if(mainVideo.volume === 0){ // if video volume is 0
        volumeBtn.classList.replace("fa-volume-high","fa-volume-mute")
    }else{
        volumeBtn.classList.replace("fa-volume-mute","fa-volume-high")
    }
})

mainVideo.addEventListener("play",()=>{
    playPauseBtn.classList.replace("fa-play","fa-pause");
})

mainVideo.addEventListener("pause",()=>{
    playPauseBtn.classList.replace("fa-pause","fa-play");
})

skipBackward.addEventListener("click",()=>{
    mainVideo.currentTime -=10; // decrease the current playing time by 10 seconds
})
skipForward.addEventListener("click",()=>{
    mainVideo.currentTime +=10; // increased the current playing time by 10 seconds
})

// sppeding up the video 
speedBtn.addEventListener("click",()=>{
    speedOptions.classList.toggle("showOptions");
})
document.addEventListener("click",(e)=>{
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded"){
        if(speedOptions.classList.contains("showOptions")){
            speedOptions.classList.remove("showOptions");
        }
    }
})
speedOptions.querySelectorAll("li").forEach(option=>{
    option.addEventListener("click",()=>{   // adding click event on all option
        mainVideo.playbackRate = option.dataset.speed;  // passing option dataset value as speed value
        speedOptions.querySelector(".active").classList.remove("active");   // removing active class from previous option
        option.classList.add("active");     // adding active class to the option
    })
})
picInPicBtn.addEventListener("click",()=>{
    mainVideo.requestPictureInPicture();    //changing video mode to picture in picture
})
fullscreenBtn.addEventListener("click",()=>{
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement){     // if video is in fullscreen
        fullscreenBtn.classList.replace("fa-compress","fa-expand");
        return document.exitFullscreen();     // exit from fullscreen video
    }
    fullscreenBtn.classList.replace("fa-expand","fa-compress");
    container.requestFullscreen();  // go to fullscreen mode
})

videoTimeline.addEventListener("click",(e)=>{
    let timelineWidth = videoTimeline.clientWidth;   // getting videoTimeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;   // updating video currentTime;
})

const draggableProgressBar = (e)=>{
    let timelineWidth = videoTimeline.clientWidth; 
    progressBar.style.width = `${e.offsetX}px`  // passing offesetX value as progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;   
    videoCurrentTime.innerText = formatTime(mainVideo.currentTime);
}
videoTimeline.addEventListener("mousedown",()=>{    // calling draggleProgressBar function on mousemove event
    videoTimeline.addEventListener("mousemove",draggableProgressBar);
})
document.addEventListener("mouseup",()=>{   // removing mousemove listener on mouseup event
    videoTimeline.removeEventListener("mousemove",draggableProgressBar);
})
videoTimeline.addEventListener("mousemove",(e)=>{
    const progressTime = videoTimeline.querySelector("span");
    let offsetX = e.offsetX;    // getting mouseX poistion
    progressTime.style.left = `${offsetX}px`  // setting the offsetX value as progressTime left value
    let timelineWidth = videoTimeline.clientWidth; 
    let pTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(pTime); // passing pTimje as the progressTime innerText
})