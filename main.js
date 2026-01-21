const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const sessionCountDisplay = document.getElementById('session-count');
const alertSound = document.getElementById('alert-sound');
const intentionInput = document.getElementById('intention-input');
const intentionDisplay = document.getElementById('intention-display');

const MODES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

let currentMode = 'pomodoro';
let timeLeft = MODES[currentMode];
let timerId = null;
let sessionsCompleted = 0;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = timeString;
  document.title = `${timeString} - Focus Flow`;
}

function startTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'START';
    toggleIntention(false);
    return;
  }

  const intention = intentionInput.value.trim();
  if (intention) {
    intentionDisplay.textContent = intention;
    toggleIntention(true);
  } else {
    toggleIntention(false);
  }

  startBtn.textContent = 'PAUSE';
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      startBtn.textContent = 'START';
      handleSessionEnd();
    }
  }, 1000);
}

function handleSessionEnd() {
  alertSound.play();

  if (currentMode === 'pomodoro') {
    sessionsCompleted++;
    sessionCountDisplay.textContent = sessionsCompleted;

    if (sessionsCompleted % 4 === 0) {
      switchMode('longBreak');
    } else {
      switchMode('shortBreak');
    }
  } else {
    switchMode('pomodoro');
  }
}

function switchMode(mode) {
  currentMode = mode;
  timeLeft = MODES[mode];

  modeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'START';
    toggleIntention(false);
  }

  updateDisplay();
}

function toggleIntention(isStarted) {
  if (isStarted) {
    intentionInput.classList.add('hidden');
    intentionDisplay.classList.remove('hidden');
  } else {
    intentionInput.classList.remove('hidden');
    intentionDisplay.classList.add('hidden');
  }
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  timeLeft = MODES[currentMode];
  startBtn.textContent = 'START';
  toggleIntention(false);
  updateDisplay();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchMode(btn.dataset.mode);
  });
});

// Initialize
updateDisplay();
