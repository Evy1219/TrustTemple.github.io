// ===================================
// TRUST TEMPLE - MAIN SCRIPT
// ===================================

// Skip intro state
let skipIntro = localStorage.getItem('skipIntro') === 'true';

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initClock();
  initNavigation();
  initHelloWorld();
  initDoNotTouch();
});

// ===================================
// INTRO ANIMATION
// ===================================

function initIntro() {
  const introContainer = document.getElementById('introContainer');
  const mainContent = document.getElementById('mainContent');
  const enterBtn = document.getElementById('enterBtn');

  if (skipIntro) {
    if (introContainer) introContainer.classList.add('hide');
    if (mainContent) {
      mainContent.style.display = 'flex';
      mainContent.classList.add('show');
    }
    localStorage.removeItem('skipIntro');
    return;
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (introContainer) {
        introContainer.classList.add('hide');
      }
      
      setTimeout(() => {
        if (introContainer) introContainer.style.display = 'none';
        if (mainContent) {
          mainContent.style.display = 'flex';
          setTimeout(() => {
            mainContent.classList.add('show');
          }, 50);
        }
      }, 800);
    });
  }
}

// ===================================
// WORLD CLOCK
// ===================================

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const estOffset = -5; // EST is UTC-5
  const estTime = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));
  
  const hours = estTime.getUTCHours().toString().padStart(2, '0');
  const minutes = estTime.getUTCMinutes().toString().padStart(2, '0');
  const seconds = estTime.getUTCSeconds().toString().padStart(2, '0');
  
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const dateEl = document.getElementById('clockDate');
  
  if (hoursEl) hoursEl.textContent = hours;
  if (minutesEl) minutesEl.textContent = minutes;
  if (secondsEl) secondsEl.textContent = seconds;
  
  if (dateEl) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = estTime.toLocaleDateString('en-US', options).toUpperCase();
  }
}

// ===================================
// NAVIGATION
// ===================================

function initNavigation() {
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      localStorage.setItem('skipIntro', 'true');
      window.location.href = 'index.html';
    });
  }

  // Navigation cards
  const navCards = document.querySelectorAll('.nav-card[data-page]');
  navCards.forEach(card => {
    card.addEventListener('click', () => {
      const page = card.dataset.page;
      if (page) {
        localStorage.setItem('skipIntro', 'true');
        window.location.href = `${page}.html`;
      }
    });
  });
}

// ===================================
// HELLO WORLD ANIMATION
// ===================================

function initHelloWorld() {
  const container = document.getElementById('helloWorldContainer');
  if (!container) return;

  function createHelloWorld() {
    const div = document.createElement('div');
    div.className = 'helloWorld';
    div.textContent = '"HELLO WORLD"';
    container.appendChild(div);

    setTimeout(() => {
      if (container.contains(div)) {
        container.removeChild(div);
      }
    }, 12000);
  }

  // Create first one after delay
  setTimeout(createHelloWorld, 1000);

  // Then create new ones every 8-12 seconds
  setInterval(() => {
    if (Math.random() > 0.5) {
      createHelloWorld();
    }
  }, 10000);
}

// ===================================
// DO NOT TOUCH BUTTON
// ===================================

function initDoNotTouch() {
  const btn = document.getElementById('doNotTouchBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    createIdiotScreen();
  });
}

function createIdiotScreen() {
  // Replace entire body with the idiot screen
  document.body.innerHTML = `
    <div id="idiotContainer" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      z-index: 99999;
    ">
      <div id="idiotText" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: clamp(2rem, 8vw, 4rem);
        color: #fff;
        font-family: 'Orbitron', 'Share Tech Mono', monospace;
        text-align: center;
        font-weight: 900;
        animation: glowIdiot 1.2s infinite alternate;
      ">YOU ARE AN IDIOT</div>
    </div>
    <style>
      @keyframes glowIdiot {
        0% {
          color: #fff;
          text-shadow: 0 0 10px #fff, 0 0 20px #FF0000;
        }
        100% {
          color: #FF0000;
          text-shadow: 0 0 30px #FF0000, 0 0 60px #fff;
        }
      }
      @keyframes ipPop {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
        }
        60% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    </style>
  `;

  // Fetch and display IP addresses
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('idiotContainer');
      if (!container) return;

      let ipCount = 0;
      const positions = [];
      const maxIPs = 80;

      function randomPos() {
        let left, top;
        do {
          left = Math.random() * 100;
          top = Math.random() * 100;
        } while (left > 35 && left < 65 && top > 35 && top < 65);
        return { left, top };
      }

      function overlaps(newPos) {
        return positions.some(pos => 
          Math.abs(pos.left - newPos.left) < 8 && 
          Math.abs(pos.top - newPos.top) < 6
        );
      }

      function addIP() {
        let pos;
        let tries = 0;
        do {
          pos = randomPos();
          tries++;
        } while (overlaps(pos) && tries < 20);

        positions.push(pos);

        const ipDiv = document.createElement('div');
        ipDiv.textContent = data.ip;
        ipDiv.style.cssText = `
          position: absolute;
          left: ${pos.left}vw;
          top: ${pos.top}vh;
          transform: translate(-50%, -50%);
          color: ${getColorForIndex(ipCount)};
          font-family: 'Orbitron', 'Share Tech Mono', monospace;
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          font-weight: 700;
          animation: ipPop 1s both;
          text-shadow: 0 0 10px currentColor;
        `;

        container.appendChild(ipDiv);
        ipCount++;

        if (ipCount < maxIPs) {
          setTimeout(addIP, 400 + Math.random() * 400);
        }
      }

      function getColorForIndex(index) {
        const frac = (index % 20) / 20;
        const r = 255;
        const g = Math.round(255 * frac);
        const b = Math.round(255 * frac);
        return `rgb(${r}, ${g}, ${b})`;
      }

      addIP();
    })
    .catch(() => {
      const container = document.getElementById('idiotContainer');
      if (container) {
        const ipDiv = document.createElement('div');
        ipDiv.textContent = 'COULD NOT FETCH IP';
        ipDiv.style.cssText = `
          position: absolute;
          left: 50%;
          top: 80%;
          transform: translate(-50%, -50%);
          color: #ff0033;
          font-family: 'Orbitron', 'Share Tech Mono', monospace;
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          font-weight: 700;
        `;
        container.appendChild(ipDiv);
      }
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add fade-in animation to cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.content-card, .nav-card').forEach(card => {
  observer.observe(card);
});
