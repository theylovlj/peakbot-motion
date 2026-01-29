// PeakBot Motion v1.7 - 10% slower
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
const darkOverlay = document.getElementById('darkOverlay');
const editCursor = document.getElementById('editCursor');

// Phase 3 elements
const chatContainer2 = document.getElementById('chatContainer2');
const userBubble3 = document.getElementById('userBubble3');
const userText3 = document.getElementById('userText3');
const botBubble2 = document.getElementById('botBubble2');
const botText2 = document.getElementById('botText2');
const serverIcon = document.getElementById('serverIcon');
const serverName = document.getElementById('serverName');

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
const textToType = "build me a community for my fans";
const userMessage1 = "can you simplify it?";
const botMessage = "sure, how minimal?";
const userMessage2 = "just the basics";

// Phase 3 messages
const userMessage3 = "can you brand it to peak?";
const botMessage2 = "say less";

const channelData = [
  { category: "INFO", channels: [
    { name: "welcome", emoji: "👋" },
    { name: "rules", emoji: "📜" },
    { name: "announcements", emoji: "📢" },
    { name: "server-updates", emoji: "🔔" }
  ]},
  { category: "CHAT", channels: [
    { name: "general", emoji: "💬" },
    { name: "introductions", emoji: "🙋" },
    { name: "off-topic", emoji: "🎲" },
    { name: "memes", emoji: "😂" },
    { name: "media", emoji: "🖼️" }
  ]},
  { category: "CONTENT", channels: [
    { name: "fan-art", emoji: "🎨" },
    { name: "videos", emoji: "🎬" },
    { name: "screenshots", emoji: "📸" },
    { name: "highlights", emoji: "🏆" }
  ]},
  { category: "VOICE", channels: [
    { name: "lounge", emoji: "🔊" },
    { name: "gaming", emoji: "🎮" },
    { name: "music", emoji: "🎵" }
  ], isVoice: true },
  { category: "SUPPORT", channels: [
    { name: "help", emoji: "❓" },
    { name: "feedback", emoji: "💡" },
    { name: "suggestions", emoji: "📝" }
  ]}
];

// Simplified channels (after "simplify it")
const simplifiedChannelData = [
  { category: "INFO", channels: [
    { name: "welcome", emoji: "👋" },
    { name: "rules", emoji: "📜" },
    { name: "announcements", emoji: "📢" }
  ]},
  { category: "CHAT", channels: [
    { name: "general", emoji: "💬" },
    { name: "media", emoji: "🖼️" }
  ]},
  { category: "VOICE", channels: [
    { name: "lounge", emoji: "🔊" },
    { name: "gaming", emoji: "🎮" }
  ], isVoice: true }
];

// Register plugins
gsap.registerPlugin(CustomEase);
CustomEase.create("snappySpring", "M0,0 C0.12,0.98 0.24,1.02 1,1");
CustomEase.create("morphEase", "M0,0 C0.4,0 0.1,1 1,1");
CustomEase.create("silkySmooth", "M0,0 C0.25,0.1 0.25,1 1,1");
CustomEase.create("gentleOut", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("popOut", "M0,0 C0.2,1.3 0.4,1 1,1"); // overshoot then settle
CustomEase.create("snapBack", "M0,0 C0.6,0 0.4,1.1 1,1"); // quick with slight overshoot

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
  // Phase 3
  userText3.textContent = userMessage3;
  botText2.textContent = botMessage2;
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
  gsap.set('.channel-category', { opacity: 0, y: 40, scale: 0.92 });
  gsap.set(channelsContainer, { y: 0 });
  gsap.set([userBubble1, botBubble, userBubble2], { opacity: 0, y: 20 });
  gsap.set([userBubble3, botBubble2], { opacity: 0, y: 20 });
  gsap.set(darkOverlay, { opacity: 0 });
  darkOverlay.classList.remove('right-focus');
  gsap.set(editCursor, { opacity: 0 });

  // Reset server branding
  const iconLetter = serverIcon.querySelector('.icon-letter');
  const iconImage = serverIcon.querySelector('.icon-image');
  gsap.set(iconLetter, { opacity: 1 });
  gsap.set(iconImage, { opacity: 0, display: 'none' });
  serverName.textContent = 'my community';

  // Create master timeline
  masterTL = gsap.timeline({
    onUpdate: updateControls,
    onComplete: () => {
      isPlaying = false;
      updatePlayPauseIcon();
    }
  });

  // Base speed - 10% slower than coded values
  masterTL.timeScale(0.9);

  // ========== PHASE 1: Box Appears ==========
  masterTL.to(morphBox, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: "gentleOut"
  });

  // ========== PHASE 1: Smooth Text Reveal ==========
  masterTL.to('#inputText .char', {
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.018,
    ease: "silkySmooth"
  }, "-=0.35");

  // ========== PHASE 2: MORPH TRANSITION (stays centered) ==========
  // Anticipation - slight scale up before transform
  masterTL.to(morphBox, {
    scale: 1.03,
    duration: 0.1,
    ease: "power2.in"
  });

  // Scale down with snap
  masterTL.to(morphBox, {
    scale: 0.96,
    duration: 0.12,
    ease: "power2.out"
  });

  // Fade out input content
  masterTL.to(inputContent, {
    opacity: 0,
    scale: 0.94,
    duration: 0.2,
    ease: "power2.in"
  }, "-=0.1");

  // Main morph - expand and transform
  masterTL.to(morphBox, {
    width: 420,
    height: 724,
    borderRadius: 28,
    background: '#2b2d31',
    borderColor: '#2b2d31',
    scale: 1,
    xPercent: -50,
    yPercent: -50,
    duration: 0.5,
    ease: "morphEase"
  }, "-=0.12");

  // ========== PHASE 3: Channel Content Fades In ==========
  masterTL.to(channelContent, {
    opacity: 1,
    duration: 0.25,
    ease: "silkySmooth"
  }, "-=0.3");

  // Categories appear with scale and slide
  masterTL.to('.channel-category', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    stagger: {
      each: 0.05,
      ease: "power1.in"
    },
    ease: "snappySpring"
  }, "-=0.2");

  // ========== PHASE 4: Scroll Through Channels ==========
  masterTL.to(channelsContainer, {
    y: -580,
    duration: 1.3,
    ease: "morphEase"
  }, "-=0.15");

  // ========== PHASE 4.5: Move Server to the Right ==========
  masterTL.to(morphBox, {
    left: '68%',
    duration: 0.7,
    ease: "morphEase"
  }, "-=0.35");

  // ========== PHASE 5: Chat Conversation ==========

  // Fade in dark overlay with feathered mask
  masterTL.to(darkOverlay, {
    opacity: 1,
    duration: 0.35,
    ease: "power2.out"
  }, "-=0.25");

  // User message 1 appears - "can you simplify it?"
  masterTL.to(userBubble1, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "gentleOut"
  }, "-=0.2");

  // Pause before bot responds
  masterTL.to({}, { duration: 0.35 });

  // Bot response appears - "sure, how minimal?"
  masterTL.to(botBubble, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "gentleOut"
  });

  // Pause before user responds
  masterTL.to({}, { duration: 0.35 });

  // User message 2 appears - "just the basics"
  masterTL.to(userBubble2, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "gentleOut"
  });

  // Pause before action
  masterTL.to({}, { duration: 0.4 });

  // ========== PHASE 6: Simplify Channels ==========

  // Fade out chat bubbles and overlay
  masterTL.to([userBubble1, botBubble, userBubble2], {
    opacity: 0,
    y: -15,
    duration: 0.3,
    stagger: 0.05,
    ease: "silkySmooth"
  });

  masterTL.to(darkOverlay, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      // Pre-set right-focus class while invisible for smooth transition to third chat
      darkOverlay.classList.add('right-focus');
    }
  }, "-=0.25");

  // ========== PHASE 6: Move Server Back to Center FIRST ==========
  masterTL.to(morphBox, {
    left: '50%',
    duration: 0.5,
    ease: "morphEase"
  }, "-=0.2");

  // Scroll back up smoothly
  masterTL.to(channelsContainer, {
    y: 0,
    duration: 0.4,
    ease: "silkySmooth"
  }, "-=0.4");

  masterTL.to({}, { duration: 0.15 });

  // ========== PHASE 7: BATCH SELECT & DELETE (IMPROVED) ==========

  const channelsToDelete = ['server-updates', 'introductions', 'off-topic', 'memes', 'music'];
  const channelsToKeep = ['welcome', 'rules', 'announcements', 'general', 'media', 'lounge', 'gaming'];
  const categoriesToRemove = ['CONTENT', 'SUPPORT'];

  // --- Step 1: Channels to delete get red selection ---
  masterTL.call(() => {
    channelsToDelete.forEach((name, i) => {
      const ch = document.querySelector(`.channel[data-channel="${name}"]`);
      if (ch) {
        gsap.to(ch, {
          backgroundColor: 'rgba(237, 66, 69, 0.4)',
          boxShadow: '0 0 15px rgba(237, 66, 69, 0.6)',
          scale: 1.02,
          delay: i * 0.06,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    });

    // Categories get marked
    categoriesToRemove.forEach((catName, i) => {
      const cat = document.querySelector(`.channel-category[data-category="${catName}"]`);
      if (cat) {
        gsap.to(cat, {
          backgroundColor: 'rgba(237, 66, 69, 0.12)',
          boxShadow: '0 0 10px rgba(237, 66, 69, 0.3)',
          delay: 0.3 + i * 0.08,
          duration: 0.25,
          ease: "power2.out"
        });
      }
    });
  });

  masterTL.to({}, { duration: 0.7 });

  // --- Step 3: Glow pulses brighter (confirmation) ---
  masterTL.call(() => {
    channelsToDelete.forEach((name) => {
      const ch = document.querySelector(`.channel[data-channel="${name}"]`);
      if (ch) {
        gsap.to(ch, {
          boxShadow: '0 0 25px rgba(237, 66, 69, 0.8)',
          duration: 0.15,
          ease: "power2.in"
        });
      }
    });
  });

  masterTL.to({}, { duration: 0.3 });

  // --- Step 4: Delete all selected (smooth slide out) ---
  masterTL.call(() => {
    // Channels to delete that are NOT in categories being fully removed
    const channelsInSurvivingCategories = ['server-updates', 'introductions', 'off-topic', 'memes', 'music'];

    channelsInSurvivingCategories.forEach((name, i) => {
      const ch = document.querySelector(`.channel[data-channel="${name}"]`);
      if (ch) {
        const currentHeight = ch.offsetHeight;
        gsap.set(ch, { height: currentHeight, overflow: 'hidden' });

        const exitTL = gsap.timeline({ delay: i * 0.05 });

        // Slight anticipation
        exitTL.to(ch, {
          x: 8,
          scale: 1.04,
          duration: 0.1,
          ease: "power2.out"
        });

        // Main slide out with blur and fade
        exitTL.to(ch, {
          x: -120,
          scale: 0.92,
          opacity: 0,
          rotation: -3,
          filter: 'blur(4px)',
          duration: 0.4,
          ease: "power2.inOut"
        });

        // Smooth height collapse
        exitTL.to(ch, {
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
          duration: 0.3,
          ease: "power3.inOut"
        }, "-=0.2");
      }
    });

    // Entire categories slide out as one clean unit
    categoriesToRemove.forEach((catName, i) => {
      const cat = document.querySelector(`.channel-category[data-category="${catName}"]`);
      if (cat) {
        const currentHeight = cat.offsetHeight;
        gsap.set(cat, { height: currentHeight, overflow: 'hidden' });

        // Stagger after individual channels start leaving
        const exitTL = gsap.timeline({ delay: 0.15 + i * 0.1 });

        // Subtle anticipation for the whole section
        exitTL.to(cat, {
          x: 5,
          scale: 1.01,
          duration: 0.08,
          ease: "power2.out"
        });

        // Clean slide out - whole section together
        exitTL.to(cat, {
          x: -80,
          opacity: 0,
          filter: 'blur(2px)',
          duration: 0.4,
          ease: "power2.inOut"
        });

        // Smooth height collapse - sneaky close the gap
        exitTL.to(cat, {
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          duration: 0.35,
          ease: "power3.inOut"
        }, "-=0.18");
      }
    });
  });

  masterTL.to({}, { duration: 0.8 });

  // --- Step 5: Clean up deleted elements & settle ---
  masterTL.call(() => {
    // Remove collapsed elements from DOM (they have height: 0)
    channelsToDelete.forEach((name) => {
      const ch = document.querySelector(`.channel[data-channel="${name}"]`);
      if (ch) ch.remove();
    });

    categoriesToRemove.forEach((catName) => {
      const cat = document.querySelector(`.channel-category[data-category="${catName}"]`);
      if (cat) cat.remove();
    });

    // Reset only the selection highlight styles on remaining channels
    const remainingChannels = document.querySelectorAll('.channel');
    remainingChannels.forEach((ch) => {
      gsap.to(ch, {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        duration: 0.2,
        ease: "power2.out"
      });
    });

    const remainingCategories = document.querySelectorAll('.channel-category');
    remainingCategories.forEach((cat) => {
      gsap.to(cat, {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        duration: 0.2,
        ease: "power2.out"
      });
    });
  });

  masterTL.to({}, { duration: 0.2 });

  // ========== PHASE 8: THIRD CHAT - BRANDING ==========

  // Brief pause before next phase
  masterTL.to({}, { duration: 0.5 });

  // Move server to left side
  masterTL.to(morphBox, {
    left: '32%',
    duration: 0.6,
    ease: "morphEase"
  });

  // Fade in dark overlay (already has right-focus class from phase 6)
  masterTL.to(darkOverlay, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  }, "-=0.3");

  // User message 3 appears - "can you brand it"
  masterTL.to(userBubble3, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "gentleOut"
  }, "-=0.15");

  // Pause before bot responds
  masterTL.to({}, { duration: 0.35 });

  // Bot response appears - "on it"
  masterTL.to(botBubble2, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "gentleOut"
  });

  // Pause before action
  masterTL.to({}, { duration: 0.35 });

  // Fade out chat and overlay
  masterTL.to([userBubble3, botBubble2], {
    opacity: 0,
    y: -15,
    duration: 0.3,
    stagger: 0.05,
    ease: "silkySmooth"
  });

  masterTL.to(darkOverlay, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out"
  }, "-=0.25");

  masterTL.call(() => {
    darkOverlay.classList.remove('right-focus');
  });

  // Move server back to center
  masterTL.to(morphBox, {
    left: '50%',
    duration: 0.45,
    ease: "morphEase"
  }, "-=0.2");

  // ========== PHASE 9: BRANDING CHANGE ==========

  masterTL.to({}, { duration: 0.2 });

  // Animate server icon and name change
  masterTL.call(() => {
    const iconLetter = serverIcon.querySelector('.icon-letter');
    const iconImage = serverIcon.querySelector('.icon-image');

    // Fade out letter, fade in image
    gsap.to(iconLetter, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        iconImage.style.display = 'block';
        gsap.fromTo(iconImage,
          { opacity: 0, scale: 1.2 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    });

    // Animate server name change
    gsap.to(serverName, {
      opacity: 0,
      x: -10,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        serverName.textContent = 'peak community';
        gsap.fromTo(serverName,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }
        );
      }
    });
  });

  // Wait for branding animation
  masterTL.to({}, { duration: 0.7 });

  // --- Final hold ---
  masterTL.to({}, { duration: 3 });

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
    lastProgress = 0;
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
  lastProgress = 0;
  createTimeline();
  isPlaying = true;
  updatePlayPauseIcon();
});

let lastProgress = 0;
timeline.addEventListener('input', (e) => {
  const progress = e.target.value / 100;

  // If seeking backwards significantly, rebuild timeline
  if (progress < lastProgress - 0.05) {
    masterTL.kill();
    createTimeline();
    masterTL.pause();
    masterTL.progress(progress);
  } else {
    masterTL.pause();
    masterTL.progress(progress);
  }

  lastProgress = progress;
  isPlaying = false;
  updatePlayPauseIcon();
});

const BASE_SPEED = 0.9; // 10% slower
speedSelect.addEventListener('change', (e) => {
  masterTL.timeScale(parseFloat(e.target.value) * BASE_SPEED);
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
