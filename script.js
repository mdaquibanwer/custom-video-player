const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
playPauseBtn = container.querySelector(".play-pause i"),
skipBackward = container.querySelector(".skip-backward"),
skipForward = container.querySelector(".skip-forward"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options");

playPauseBtn.addEventListener("click",()=>{
    // if video is paused then play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
})

mainVideo.addEventListener("timeupdate",(e)=>{
    let {currentTime,duration}  = e.target //getting current time & duration of the video
    // console.log(currentTime,duration)
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;    // passing width in the percent
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