// Elements
const morphBox = document.getElementById('morphBox');
const inputContent = document.getElementById('inputContent');
const inputText = document.getElementById('inputText');
const channelContent = document.getElementById('channelContent');
const channelsContainer = document.getElementById('channelsContainer');
const chatContainer = document.getElementById('chatContainer');
const userBubble1 = document.getElementById('userBubble1');
const userText1 = document.getElementById('userText1');
const botBubble = document.getElementById('botBubble');
const botText = document.getElementById('botText');
const userBubble2 = document.getElementById('userBubble2');
const userText2 = document.getElementById('userText2');

// Controls
const playPauseBtn = document.getElementById('playPause');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const restartBtn = document.getElementById('restart');
const timeline = document.getElementById('timeline');
const timelineProgress = document.getElementById('timelineProgress');
const timelineHandle = document.getElementById('timelineHandle');
const timeDisplay = document.getElementById('timeDisplay');
const speedSelect = document.getElementById('speedSelect');

// Config
const textToType = "build me a gaming community";
const userMessage1 = "can you move streams to the top?";
const botMessage = "sure, which category?";
const userMessage2 = "put it in info";

const channelData = [
  { category: "INFO", channels: [
    { name: "welcome", emoji: "👋" },
    { name: "rules", emoji: "📜" },
    { name: "announcements", emoji: "📢" },
    { name: "roles", emoji: "🎭" }
  ]},
  { category: "GENERAL", channels: [
    { name: "general", emoji: "💬" },
    { name: "off-topic", emoji: "🎲" },
    { name: "media", emoji: "🖼️" },
    { name: "bot-cmds", emoji: "🤖" }
  ]},
  { category: "GAMES", channels: [
    { name: "valorant", emoji: "🎯" },
    { name: "minecraft", emoji: "⛏️" },
    { name: "fortnite", emoji: "🔫" },
    { name: "league", emoji: "⚔️" },
    { name: "apex", emoji: "🎮" },
    { name: "cs2", emoji: "💣" }
  ]},
  { category: "CONTENT", channels: [
    { name: "clips", emoji: "🎬" },
    { name: "streams", emoji: "📺" },
    { name: "highlights", emoji: "🏆" }
  ]},
  { category: "VOICE", channels: [
    { name: "Lobby", emoji: "🔊" },
    { name: "Gaming 1", emoji: "🎮" },
    { name: "Gaming 2", emoji: "🎮" },
    { name: "Music", emoji: "🎵" },
    { name: "AFK", emoji: "😴" }
  ], isVoice: true }
];

// Register plugins
gsap.registerPlugin(CustomEase);
CustomEase.create("snappySpring", "M0,0 C0.12,0.98 0.24,1.02 1,1");
CustomEase.create("morphEase", "M0,0 C0.4,0 0.1,1 1,1");
CustomEase.create("silkySmooth", "M0,0 C0.25,0.1 0.25,1 1,1");
CustomEase.create("gentleOut", "M0,0 C0.16,1 0.3,1 1,1");

// Build character spans for input text only
function buildInputSpans() {
  inputText.innerHTML = '';
  textToType.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    inputText.appendChild(span);
  });
}

// Set chat text directly (no spans)
function setupChatText() {
  userText1.textContent = userMessage1;
  botText.textContent = botMessage;
  userText2.textContent = userMessage2;
}

// Build channels
function buildChannels() {
  channelsContainer.innerHTML = '';
  channelData.forEach((cat) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'channel-category';
    categoryDiv.dataset.category = cat.category;

    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <span class="category-arrow">▼</span>
      <span class="category-name">${cat.category}</span>
    `;
    categoryDiv.appendChild(header);

    cat.channels.forEach((channel) => {
      const channelDiv = document.createElement('div');
      channelDiv.className = 'channel';
      channelDiv.dataset.channel = channel.name.toLowerCase();
      if (cat.isVoice) {
        channelDiv.innerHTML = `
          <span class="channel-icon">${channel.emoji}</span>
          <span class="channel-name">${channel.name}</span>
        `;
      } else {
        channelDiv.innerHTML = `
          <span class="channel-icon">${channel.emoji}</span>
          <span class="channel-name">${channel.name}</span>
        `;
      }
      categoryDiv.appendChild(channelDiv);
    });

    channelsContainer.appendChild(categoryDiv);
  });
}

// Master Timeline
let masterTL;
let isPlaying = true;

function createTimeline() {
  buildInputSpans();
  setupChatText();
  buildChannels();

  // Reset all states
  gsap.set(morphBox, {
    scale: 0,
    opacity: 0,
    width: 'auto',
    height: 'auto',
    borderRadius: 100,
    background: '#fff',
    borderColor: '#e0e0e0',
    xPercent: -50,
    yPercent: -50,
    left: '50%',
    top: '50%'
  });
  gsap.set(inputContent, { opacity: 1 });
  gsap.set('#inputText .char', { opacity: 0, y: 20 });
  gsap.set(channelContent, { opacity: 0 });
  gsap.set('.channel-category', { opacity: 0, y: 40 });
  gsap.set(channelsContainer, { y: 0 });
  gsap.set([userBubble1, botBubble, userBubble2], { opacity: 0, y: 20 });

  // Create master timeline
  masterTL = gsap.timeline({
    onUpdate: updateControls,
    onComplete: () => {
      isPlaying = false;
      updatePlayPauseIcon();
    }
  });

  // ========== PHASE 1: Box Appears ==========
  masterTL.to(morphBox, {
    scale: 1,
    opacity: 1,
    duration: 0.7,
    ease: "gentleOut"
  });

  // ========== PHASE 1: Smooth Text Reveal ==========
  masterTL.to('#inputText .char', {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.02,
    ease: "silkySmooth"
  }, "-=0.4");

  // ========== PHASE 2: MORPH TRANSITION (stays centered) ==========
  masterTL.to(inputContent, {
    opacity: 0,
    scale: 0.97,
    duration: 0.4,
    ease: "silkySmooth"
  }, "-=0.3");

  masterTL.to(morphBox, {
    width: 420,
    height: 724,
    borderRadius: 28,
    background: '#2b2d31',
    borderColor: '#2b2d31',
    xPercent: -50,
    yPercent: -50,
    duration: 0.8,
    ease: "morphEase"
  }, "-=0.35");

  // ========== PHASE 3: Channel Content Fades In ==========
  masterTL.to(channelContent, {
    opacity: 1,
    duration: 0.4,
    ease: "silkySmooth"
  }, "-=0.4");

  masterTL.to('.channel-category', {
    opacity: 1,
    y: 0,
    duration: 0.45,
    stagger: {
      each: 0.08,
      ease: "power2.in"
    },
    ease: "gentleOut"
  }, "-=0.3");

  // ========== PHASE 4: Scroll Through Channels ==========
  masterTL.to(channelsContainer, {
    y: -300,
    duration: 1.2,
    ease: "morphEase"
  }, "-=0.2");

  // ========== PHASE 4.5: Move Server to the Right ==========
  masterTL.to(morphBox, {
    left: '68%',
    duration: 1,
    ease: "morphEase"
  }, "-=0.3");

  // ========== PHASE 5: Chat Conversation ==========

  // User message 1 appears
  masterTL.to(userBubble1, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "gentleOut"
  }, "-=0.5");

  // Pause before bot responds
  masterTL.to({}, { duration: 0.4 });

  // Bot response appears
  masterTL.to(botBubble, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "gentleOut"
  });

  // Pause before user responds
  masterTL.to({}, { duration: 0.4 });

  // User message 2 appears
  masterTL.to(userBubble2, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "gentleOut"
  });

  // Brief pause before action
  masterTL.to({}, { duration: 0.5 });

  // ========== PHASE 6: Channel Rearranges ==========

  // Scroll back up smoothly
  masterTL.to(channelsContainer, {
    y: 0,
    duration: 0.8,
    ease: "silkySmooth"
  });

  masterTL.to({}, { duration: 0.2 });

  // Drag streams to top of INFO (above welcome)
  masterTL.call(() => {
    const streamsChannel = document.querySelector('[data-channel="streams"]');
    const infoCategory = document.querySelector('[data-category="INFO"]');
    const generalCategory = document.querySelector('[data-category="GENERAL"]');
    const gamesCategory = document.querySelector('[data-category="GAMES"]');
    const contentCategory = document.querySelector('[data-category="CONTENT"]');
    const welcomeChannel = document.querySelector('[data-channel="welcome"]');

    if (streamsChannel && infoCategory && welcomeChannel) {
      // Use offsetTop for accurate positions (not affected by GSAP transforms)
      // Calculate total offset from container top
      const streamsOffsetTop = streamsChannel.offsetTop + contentCategory.offsetTop;
      const welcomeOffsetTop = welcomeChannel.offsetTop + infoCategory.offsetTop;

      // Distance to move up
      const moveUpDistance = streamsOffsetTop - welcomeOffsetTop;

      // Height of streams channel for pushing others down
      const streamsHeight = streamsChannel.offsetHeight + 2;

      // Highlight streams
      streamsChannel.classList.add('highlight');
      streamsChannel.classList.add('dragging');

      const dragTL = gsap.timeline();

      // Step 1: Lift streams
      dragTL.to(streamsChannel, {
        scale: 1.15,
        x: 15,
        zIndex: 100,
        duration: 0.3,
        ease: "power2.out"
      });

      // Step 2: Move streams up to welcome's position
      dragTL.to(streamsChannel, {
        y: -moveUpDistance,
        duration: 0.9,
        ease: "power2.inOut"
      });

      // Step 3: Push all INFO channels down
      const infoChannels = infoCategory.querySelectorAll('.channel');
      dragTL.to(infoChannels, {
        y: streamsHeight,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.02
      }, "-=0.7");

      // Push GENERAL and GAMES categories down (they're between INFO and streams source)
      dragTL.to([generalCategory, gamesCategory], {
        y: streamsHeight,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.03
      }, "<");

      // Step 4: Place streams down
      dragTL.to(streamsChannel, {
        scale: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  masterTL.to({}, { duration: 2.4 });

  // Remove highlight
  masterTL.call(() => {
    const streamsChannel = document.querySelector('[data-channel="streams"]');
    if (streamsChannel) {
      streamsChannel.classList.remove('dragging');
      streamsChannel.classList.remove('highlight');
    }
  });

  masterTL.to({}, { duration: 0.3 });

  // Fade out chat smoothly
  masterTL.to([userBubble1, botBubble, userBubble2], {
    opacity: 0,
    y: -15,
    duration: 0.5,
    stagger: 0.08,
    ease: "silkySmooth"
  });

  return masterTL;
}

// Update controls
function updateControls() {
  const progress = masterTL.progress() * 100;
  const time = masterTL.time();

  timelineProgress.style.width = progress + '%';
  timelineHandle.style.left = progress + '%';
  timeline.value = progress;
  timeDisplay.textContent = time.toFixed(2) + 's';
}

function updatePlayPauseIcon() {
  if (isPlaying) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }
}

// Event listeners
playPauseBtn.addEventListener('click', () => {
  if (masterTL.progress() === 1) {
    masterTL.kill();
    createTimeline();
    isPlaying = true;
  } else if (isPlaying) {
    masterTL.pause();
    isPlaying = false;
  } else {
    masterTL.play();
    isPlaying = true;
  }
  updatePlayPauseIcon();
});

restartBtn.addEventListener('click', () => {
  masterTL.kill();
  createTimeline();
  isPlaying = true;
  updatePlayPauseIcon();
});

timeline.addEventListener('input', (e) => {
  const progress = e.target.value / 100;
  masterTL.pause();
  masterTL.progress(progress);
  isPlaying = false;
  updatePlayPauseIcon();
});

speedSelect.addEventListener('change', (e) => {
  masterTL.timeScale(parseFloat(e.target.value));
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    playPauseBtn.click();
  } else if (e.code === 'KeyR') {
    restartBtn.click();
  } else if (e.code === 'ArrowLeft') {
    masterTL.seek(Math.max(0, masterTL.time() - 0.25));
    updateControls();
  } else if (e.code === 'ArrowRight') {
    masterTL.seek(Math.min(masterTL.duration(), masterTL.time() + 0.25));
    updateControls();
  }
});

// Initialize
createTimeline();
