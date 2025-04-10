console.log("JavaScript is connected!");

  const audioPlayerElement = document.getElementById("main-audio");
  const controlsContainer = document.querySelector(".controls");
  const progressArea = document.querySelector(".progress-area");
  const progressBar = document.querySelector(".progress-bar");
  const progress = document.querySelector(".progress");
  const progressIndicator = document.querySelector(".progress-indicator");
  const currentTimeDisplay = document.querySelector(".current-time");
  const durationDisplay = document.querySelector(".duration");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const items = document.querySelectorAll(".item");
  const images = document.querySelectorAll(".item img");
  let currentSongIndex = -1;
  let isDragging = false; // Flag to track if the progress indicator is being dragged

  audioPlayerElement.addEventListener('loadedmetadata', () => {
    console.log("Metadata loaded:", audioPlayerElement.duration);
  });

  function loadSong(index) {
    if (index >= 0 && index < items.length) {
      const songPath = items[index].getAttribute("data-song");
      audioPlayerElement.src = songPath;
      audioPlayerElement.load();

      items.forEach(item => item.classList.remove("playing"));
      images.forEach(img => img.classList.remove("playing-image"));
      items[index].classList.add("playing");
      images[index].classList.add("playing-image");
      currentSongIndex = index;

      prevBtn.disabled = currentSongIndex === 0;
      nextBtn.disabled = currentSongIndex === items.length - 1;
    }
  }

  function updatePlayPauseButton() {
    if (!audioPlayerElement.paused && audioPlayerElement.readyState > 2) { // Check if playing and data is loaded
      playPauseBtn.querySelector('img').src = "additional/buttons/pause.png"; // Set to pause icon
    } else {
      playPauseBtn.querySelector('img').src = "additional/buttons/play.png"; // Set to play icon
    }
  }

  function playPause() {
    if (audioPlayerElement.paused || audioPlayerElement.readyState === 0) {
      if (currentSongIndex === -1 && items.length > 0) {
        loadSong(0);
      }
      audioPlayerElement.play();
      playPauseBtn.querySelector('img').src = "additional/buttons/pause.png"; // Set to pause on play
    } else {
      audioPlayerElement.pause();
      playPauseBtn.querySelector('img').src = "additional/buttons/play.png"; // Set to play on pause
    }
  }

  function playNext() {
    if (currentSongIndex < items.length - 1) {
      loadSong(currentSongIndex + 1);
      audioPlayerElement.play();
      // Immediately set the button to the "pause" state
      playPauseBtn.querySelector('img').src = "additional/buttons/pause.png";
    }
  }




  function playPrev() {
    if (currentSongIndex > 0) {
      loadSong(currentSongIndex - 1);
      audioPlayerElement.play();
      playPauseBtn.querySelector('img').src = "additional/buttons/pause.png";
    }
  }

  audioPlayerElement.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = duration ? (currentTime / duration) * 100 : 0;
    console.log("Time Update:", currentTime, duration, progressWidth);
    progress.style.width = `${progressWidth}%`;
    progressIndicator.style.left = `${progressWidth}%`; // Position the indicator

    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds}`;

    if (duration) {
      let durationMinutes = Math.floor(duration / 60);
      let durationSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
      durationDisplay.textContent = `${durationMinutes}:${durationSeconds}`;
    }
  });

  progressArea.addEventListener("click", (e) => {
    let progressBarWidth = progressArea.offsetWidth;
    let clickedOffsetX = e.offsetX;
    console.log("Progress Click:", clickedOffsetX, progressBarWidth, audioPlayerElement.duration);
    if (audioPlayerElement.duration) {
      audioPlayerElement.currentTime = (clickedOffsetX / progressBarWidth) * audioPlayerElement.duration;
    }
  });


  audioPlayerElement.addEventListener("ended", () => {
    playNext();
    // Immediately set the button to the "pause" state when the next song starts
    playPauseBtn.querySelector('img').src = "additional/buttons/pause.png";
  });

  images.forEach((img, index) => {
    img.addEventListener("click", (event) => {
      event.stopPropagation();
      loadSong(index);
      audioPlayerElement.play().then(() => {
        // Only update if play was successful (returns a Promise)
        updatePlayPauseButton();
      }).catch(error => {
        console.error("Error playing audio:", error);
        // Optionally handle the error, e.g., show a message
      });
    });
  });

  playPauseBtn.addEventListener("click", playPause);
  nextBtn.addEventListener("click", playNext);
  prevBtn.addEventListener("click", playPrev);

  // Prevent initial highlighting
  items.forEach(item => item.classList.remove("playing"));
  images.forEach(img => img.classList.remove("playing-image"));