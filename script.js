document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll('.box.preview');
  const mainPage = document.getElementById('mainPage');
  const dynamicContentContainer = document.getElementById('dynamic-content-container');
  const contentDiv = document.getElementById('content');
  const backBtn = document.getElementById('back-btn');

  if (!dynamicContentContainer || !backBtn) {
    console.error("Error: Elements not found.");
    return;
  }

  function initializeAudioPlayer() {
    const audioPlayerElement = contentDiv.querySelector("#main-audio");
    const playPauseBtn = contentDiv.querySelector("#play-pause-btn");
    const nextBtn = contentDiv.querySelector("#next-btn");
    const prevBtn = contentDiv.querySelector("#prev-btn");
    const progressArea = contentDiv.querySelector(".progress-area");
    const progressBar = contentDiv.querySelector(".progress-bar");
    const progress = contentDiv.querySelector(".progress");
    const progressIndicator = contentDiv.querySelector(".progress-indicator");
    const currentTimeDisplay = contentDiv.querySelector(".current-time");
    const durationDisplay = contentDiv.querySelector(".duration");
    const items = contentDiv.querySelectorAll(".item");
    const images = contentDiv.querySelectorAll(".item img");
    let currentSongIndex = -1;
    let isDragging = false;

    if (!audioPlayerElement || !playPauseBtn || !nextBtn || !prevBtn || !progressArea) {
      console.error("Audio player elements not found in loaded content.");
      return;
    }

    const loadSong = (index) => {
      if (index >= 0 && index < items.length) {
        const songPath = items[index].getAttribute("data-song");
        audioPlayerElement.src = songPath;
        audioPlayerElement.load();
        // ... (rest of your loadSong function) ...
        items.forEach(item => item.classList.remove("playing"));
        images.forEach(img => img.classList.remove("playing-image"));
        items[index].classList.add("playing");
        images[index].classList.add("playing-image");
        currentSongIndex = index;
        prevBtn.disabled = currentSongIndex === 0;
        nextBtn.disabled = currentSongIndex === items.length - 1;
        updatePlayPauseButton();
      }
    };

    const updatePlayPauseButton = () => {
      if (!audioPlayerElement.paused && audioPlayerElement.readyState > 2) {
        playPauseBtn.querySelector('img').src = "additional/buttons/pause.png";
      } else {
        playPauseBtn.querySelector('img').src = "additional/buttons/play.png";
      }
    };

    const playPause = () => {
      if (audioPlayerElement.paused || audioPlayerElement.readyState === 0) {
        if (currentSongIndex === -1 && items.length > 0) {
          loadSong(0);
        }
        audioPlayerElement.play();
      } else {
        audioPlayerElement.pause();
      }
      updatePlayPauseButton();
    };

    const playNext = () => {
      if (currentSongIndex < items.length - 1) {
        loadSong(currentSongIndex + 1);
        audioPlayerElement.play().then(updatePlayPauseButton).catch(console.error);
      }
    };

    const playPrev = () => {
      if (currentSongIndex > 0) {
        loadSong(currentSongIndex - 1);
        audioPlayerElement.play();
        updatePlayPauseButton();
      }
    };

    audioPlayerElement.addEventListener('loadedmetadata', () => {
      console.log("Metadata loaded:", audioPlayerElement.duration);
    });

    audioPlayerElement.addEventListener("timeupdate", (e) => {
      const currentTime = e.target.currentTime;
      const duration = e.target.duration;
      let progressWidth = duration ? (currentTime / duration) * 100 : 0;
      progress.style.width = `${progressWidth}%`;
      progressIndicator.style.left = `${progressWidth}%`;
      currentTimeDisplay.textContent = formatTime(currentTime);
      durationDisplay.textContent = formatTime(duration);
    });

    progressArea.addEventListener("click", (e) => {
      if (audioPlayerElement.duration) {
        const progressBarWidth = progressArea.offsetWidth;
        const clickedOffsetX = e.offsetX;
        audioPlayerElement.currentTime = (clickedOffsetX / progressBarWidth) * audioPlayerElement.duration;
      }
    });

    audioPlayerElement.addEventListener("ended", () => {
      playNext();
      // Update the play/pause button after automatically playing the next song
      setTimeout(updatePlayPauseButton, 100); // Small delay to ensure play event fires
    });;

    images.forEach((img, index) => {
      img.addEventListener("click", (event) => {
        event.stopPropagation();
        loadSong(index);
        audioPlayerElement.play().then(updatePlayPauseButton).catch(console.error);
      });
    });

    playPauseBtn.addEventListener("click", playPause);
    nextBtn.addEventListener("click", playNext);
    prevBtn.addEventListener("click", playPrev);

    updatePlayPauseButton(); // Initial button state
  }

  boxes.forEach(box => {
    box.addEventListener('click', () => {
      const pageUrl = box.getAttribute('data-page');
      console.log("Fetching content from:", pageUrl);

      fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
          contentDiv.innerHTML = html;
          mainPage.classList.add('hidden');
          dynamicContentContainer.classList.remove('hidden');

          // Initialize the audio player controls after the content is loaded
          initializeAudioPlayer();
        })
        .catch(error => {
          console.error("Fetch error:", error);
          contentDiv.innerHTML = "<p style='color:red;'>Error loading page.</p>";
        });
    });
  });

  backBtn.addEventListener('click', () => {
    contentDiv.innerHTML = ''; // Clear the loaded content
    mainPage.classList.remove('hidden');
    dynamicContentContainer.classList.add('hidden');
  });

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) {
      return '0:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }
});

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 2000); // 2000 milliseconds = 2 seconds
  });


  const centeredHeading = document.querySelector('.centered-heading');
const text = "Hey Safiya";
let i = 0;
let intervalId;



document.addEventListener('DOMContentLoaded', () => {
  const centeredHeading = document.querySelector('.centered-heading');
  const mainHeading = document.getElementById('heading');
  const text = "Hey Safiya";
  let i = 0;
  let intervalId;

  centeredHeading.textContent = ""; // Clear initial text

  intervalId = setInterval(() => {
    if (i < text.length) {
      centeredHeading.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(intervalId);
      setTimeout(() => {
        document.body.classList.add('loaded');
        mainHeading.classList.add('interactive'); // Add class for hover after animation
      }, 1500); // Delay after typing before animation starts
    }
  }, 150); // Adjust typing speed (milliseconds per character)
});


document.addEventListener('DOMContentLoaded', () => {
  const heartContainer = document.getElementById('heartContainer');
  const paymentModal = document.getElementById('paymentModal');

  if (heartContainer && paymentModal) {
    heartContainer.addEventListener('click', () => {
      paymentModal.style.display = 'flex'; // Use flex to center content
      setTimeout(() => {
        paymentModal.style.opacity = '1'; // Fade in the white screen and text
      }, 50); // Small delay
    });

    paymentModal.addEventListener('click', () => {
      paymentModal.style.opacity = '0';
      setTimeout(() => {
        paymentModal.style.display = 'none';
      }, 500); // Match fade-out duration
    });
  }
});