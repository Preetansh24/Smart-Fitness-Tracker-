// Preset exercise images bank with keywords for search filtering
const presetImages = [
  { name: "Cardio Running", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400", tags: "running, cardio, run, outdoor, pace" },
  { name: "Interval Swimming", url: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400", tags: "swimming, endurance, swim, pool, water" },
  { name: "Push Ups", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", tags: "pushups, strength, chest, push, upperbody" },
  { name: "Barbell Squats", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", tags: "squats, strength, legs, squat, glutes, lowerbody" },
  { name: "Yoga Stretch", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", tags: "yoga, flexibility, stretch, zen, balance, warmdown" },
  { name: "Plank Hold", url: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?w=400", tags: "plank, core, abs, hold, stomach" },
  { name: "Outdoor Cycling", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400", tags: "cycling, cardio, bike, ride, cycling, bicycle" },
  { name: "Dumbbell Press", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400", tags: "dumbbells, strength, chest, weights, lift" },
  { name: "Gym Treadmill", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", tags: "treadmill, cardio, walk, gym, indoor" }
];

// Default fallback exercises if Local Storage is empty
const defaultExercises = [
  { id: 1, name: "Push Ups", category: "Strength", duration: "3 sets x 15 reps", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", completed: false },
  { id: 2, name: "Barbell Squats", category: "Strength", duration: "4 sets x 12 reps", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", completed: false },
  { id: 3, name: "Cardio Running", category: "Cardio", duration: "25 mins", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400", completed: true },
  { id: 4, name: "Yoga Stretch", category: "Flexibility", duration: "15 mins", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", completed: false }
];

// Local Storage Keys
const STORAGE_KEY_EXERCISES = "fittrack_premium_exercises";
const STORAGE_KEY_LOCATION = "fittrack_premium_location";

// State variables
let exercises = [];
let selectedFormImage = ""; // Holds currently dragged/selected image for new exercise form

// Initialize application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initExercises();
  initDragAndDrop();
  initImageBank();
  initLocation();
  initDebugger();
  initAudioExperience();
  initAddWorkoutForm(); // ← moved here so DOM is ready
});

// =========================================================================
// AI AUDIO EXPERIENCE (Web Speech API)
// =========================================================================
function initAudioExperience() {
  const overlay = document.getElementById('startOverlay');
  const startBtn = document.getElementById('startAppBtn');
  
  if (overlay && startBtn) {
    startBtn.addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 500);
      
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance("Welcome to Fit Track Premium. Time to crush your fitness goals. Let's train smart!");
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      
      // Wait for voices to load (some browsers need a tiny delay)
      const trySpeak = () => {
        const voices = synth.getVoices();
        const goodVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
        if (goodVoice) utterance.voice = goodVoice;
        synth.speak(utterance);
      };
      if (synth.getVoices().length > 0) trySpeak();
      else synth.onvoiceschanged = trySpeak;
    });
  }
}

// =========================================================================
// MOTIVATIONAL QUOTE MODAL  (diet card click)
// =========================================================================
const motivationalQuotes = {
  Breakfast: [
    "Rise and grind! A nutritious breakfast fires up your metabolism and powers your morning workout. 🌅",
    "Champions eat breakfast. Fuel your body right from the first bite of the day! 🏆",
    "Your breakfast is your first win of the day. Own it! 💪"
  ],
  Lunch: [
    "Midday fuel matters. A protein-rich lunch keeps your energy soaring through the afternoon grind! 🔥",
    "Great athletes refuel smartly. Your lunch is your recharge — eat with purpose! ⚡",
    "Feed your ambition. A powerful lunch fuels a powerful afternoon session! 💥"
  ],
  Snacks: [
    "Smart snacking = smart training. Nuts and fruit keep your energy stable and your mind sharp! 🎯",
    "Winners don't skip snacks — they choose them wisely. You're on the right track! 🌟",
    "Your body is a performance machine. Refuel it between meals and it will never let you down! 🚀"
  ],
  Dinner: [
    "Recovery starts at the dinner table. Eat clean tonight and wake up stronger tomorrow! 🌙",
    "End your day with purpose. A balanced dinner repairs muscles and prepares you for tomorrow's challenge! 💫",
    "Great nights lead to great mornings. Your recovery meal tonight powers tomorrow's victory! 🏅"
  ]
};

window.openQuoteModal = function(meal, icon, kcal, nutrients) {
  const modal    = document.getElementById('quoteModal');
  const iconEl   = document.getElementById('quoteMealIcon');
  const textEl   = document.getElementById('quoteText');
  const labelEl  = document.getElementById('quoteMealLabel');
  const nutrEl   = document.getElementById('quoteNutrition');

  if (!modal) return;

  // Pick a random quote for this meal
  const quotes = motivationalQuotes[meal] || motivationalQuotes.Breakfast;
  const quote  = quotes[Math.floor(Math.random() * quotes.length)];

  // Populate modal content
  iconEl.textContent  = icon;
  textEl.textContent  = `"${quote}"`;
  labelEl.textContent = `${meal} — ${kcal}`;

  // Build nutrition chips
  nutrEl.innerHTML = nutrients.map(n =>
    `<span style="display:inline-flex;align-items:center;gap:4px;
                  background:#fff7ed;border:1px solid #fed7aa;
                  color:#c2410c;border-radius:999px;
                  padding:4px 12px;font-size:11px;font-weight:600;">${n}</span>`
  ).join('');

  // Open modal with animation
  modal.classList.add('open');

  // Speak the quote via Web Speech API
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(quote);
    utter.rate  = 0.95;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  }
};

window.closeQuoteModal = function() {
  const modal = document.getElementById('quoteModal');
  if (modal) modal.classList.remove('open');
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// Close modal when clicking the backdrop
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeQuoteModal();
    });
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeQuoteModal();
});

// =========================================================================
// I. AUTHENTICATION (Login / Logout)
// =========================================================================

function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;
  
  const hasUser = localStorage.getItem('fittrack_user');
  const isLoggedIn = localStorage.getItem('fittrack_session');
  
  if (isLoggedIn === 'true') {
    authBtn.textContent = "Logout";
    authBtn.href = "#";
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('fittrack_session');
      window.location.reload();
    });
  } else {
    // If not logged in, but user exists, point to Login
    if (hasUser) {
      authBtn.textContent = "Login";
      authBtn.href = "login-offline.html";
    } else {
      authBtn.textContent = "Register Account";
      authBtn.href = "registration-offline.html";
    }
  }
}

// =========================================================================
// II. LOCAL STORAGE & CRUD OPERATIONS
// =========================================================================

// Load exercises from Local Storage or load defaults
function initExercises() {
  const saved = localStorage.getItem(STORAGE_KEY_EXERCISES);
  if (saved) {
    try {
      exercises = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing local storage exercises, loading defaults.", e);
      exercises = [...defaultExercises];
    }
  } else {
    exercises = [...defaultExercises];
    saveExercises();
  }
  renderExercises();
}

// Save active exercise array to Local Storage
function saveExercises() {
  localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(exercises));
}

// Render dynamic exercise grid in right column
function renderExercises() {
  const grid = document.getElementById("exerciseGrid");
  const countBadge = document.getElementById("cardCount");
  
  if (!grid || !countBadge) return;
  
  grid.innerHTML = "";
  countBadge.textContent = `${exercises.length} Exercise${exercises.length !== 1 ? 's' : ''}`;

  if (exercises.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center p-10 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
        <p class="text-gray-600 mb-2 font-medium">No exercises in your tracked list.</p>
        <p class="text-gray-500 text-sm">Add a new workout or drag images to start!</p>
      </div>
    `;
    return;
  }

  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = `exercise-card relative overflow-hidden bg-white border ${ex.completed ? 'border-green-400 opacity-80' : 'border-gray-200'} shadow-sm hover:shadow-md rounded-2xl group hover:-translate-y-1 transition-all duration-300`;
    card.setAttribute("data-id", ex.id);
    
    const categoryColors = {
      'strength': 'bg-red-100 text-red-700 border-red-200',
      'cardio': 'bg-blue-100 text-blue-700 border-blue-200',
      'flexibility': 'bg-purple-100 text-purple-700 border-purple-200',
      'endurance': 'bg-green-100 text-green-700 border-green-200'
    };
    const categoryClass = categoryColors[ex.category ? ex.category.toLowerCase() : "strength"] || 'bg-gray-100 text-gray-700 border-gray-200';

    const imgUrl = ex.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400";

    card.innerHTML = `
      <div class="relative h-40">
        <img src="${imgUrl}" alt="${ex.name}" loading="lazy" class="w-full h-full object-cover">
        <span class="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold border backdrop-blur-md bg-white/80 ${categoryClass}">${ex.category}</span>
        ${ex.completed ? '<div class="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center"><span class="text-4xl shadow-sm rounded-full bg-white leading-none">✅</span></div>' : ''}
      </div>
      <div class="p-4 space-y-3">
        <h4 class="font-display font-semibold text-lg text-gray-900 truncate">${ex.name}</h4>
        <span class="inline-block text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">⏱️ ${ex.duration}</span>
        <div class="flex gap-2 pt-2">
          <button class="flex-1 ${ex.completed ? 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200' : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'} px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors" onclick="toggleExercise(${ex.id})">
            ${ex.completed ? 'Undo' : 'Mark Done'}
          </button>
          <button class="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors" onclick="deleteExercise(${ex.id})">
            Remove
          </button>
        </div>
      </div>
    `;

    // Attach card Drag and Drop listeners to support direct image drop swapping
    card.addEventListener("dragover",  handleCardDragOver);
    card.addEventListener("dragenter", handleCardDragEnter);
    card.addEventListener("dragleave", handleCardDragLeave);
    card.addEventListener("drop",      handleCardDrop);

    // ── Exercise card click → pump animation ──────────────────────────
    card.addEventListener("click", (e) => {
      // Skip if clicking the action buttons
      if (e.target.closest('button')) return;
      card.classList.remove('card-pump');          // reset if already animating
      void card.offsetWidth;                       // force reflow
      card.classList.add('card-pump');
      card.addEventListener('animationend', () => {
        card.classList.remove('card-pump');
      }, { once: true });
    });

    grid.appendChild(card);
  });
  
  updateDebuggerMetrics();
}

// Toggle completion status
window.toggleExercise = function(id) {
  exercises = exercises.map(ex => {
    if (ex.id === id) {
      return { ...ex, completed: !ex.completed };
    }
    return ex;
  });
  saveExercises();
  renderExercises();
};

// Delete exercise
window.deleteExercise = function(id) {
  if (confirm("Are you sure you want to remove this exercise from your tracked routine?")) {
    exercises = exercises.filter(ex => ex.id !== id);
    saveExercises();
    renderExercises();
  }
};

// ── Add Workout Form handler (called from DOMContentLoaded) ──
function initAddWorkoutForm() {
  const btn = document.getElementById("addWorkoutBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const nameInput     = document.getElementById("workoutName");
    const categorySelect= document.getElementById("workoutCategory");
    const durationInput = document.getElementById("workoutDuration");

    const name     = nameInput.value.trim();
    const category = categorySelect.value;
    const duration = durationInput.value.trim() || "Self-paced";

    if (!name) {
      alert("Please enter a name for the exercise.");
      return;
    }

    const newId = exercises.length ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
    const imgUrl = selectedFormImage || presetImages[0].url;

    exercises.unshift({ id: newId, name, category, duration, image: imgUrl, completed: false });
    saveExercises();
    renderExercises();

    nameInput.value = "";
    durationInput.value = "";
    resetFormDropzone();
  });
}

// =========================================================================
// III. DRAG AND DROP API & SEARCH IMAGES
// =========================================================================

// Initialize Draggable Image Bank in Sidebar
function initImageBank() {
  renderImageBank(presetImages);
}

// Render searchable image bank grid
function renderImageBank(imagesList) {
  const container = document.getElementById("imageBankGrid");
  if (!container) return;

  container.innerHTML = "";

  if (imagesList.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center p-4 text-gray-500 text-sm">
        No matching images.
      </div>
    `;
    return;
  }

  imagesList.forEach(img => {
    const item = document.createElement("div");
    item.className = "image-bank-item relative cursor-grab rounded-lg overflow-hidden group border border-gray-200 hover:border-orange-500 transition-colors shadow-sm";
    item.setAttribute("draggable", "true");
    item.setAttribute("data-url", img.url);

    item.innerHTML = `
      <img src="${img.url}" alt="${img.name}" loading="lazy" class="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500">
      <div class="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm p-1 border-t border-gray-100 text-center">
        <span class="text-[10px] text-gray-800 font-semibold block truncate">${img.name}</span>
      </div>
    `;

    // Attach drag start event
    item.addEventListener("dragstart", handleDragStart);

    container.appendChild(item);
  });
}

// Search and filter image bank
window.filterImages = function() {
  const query = document.getElementById("imageSearch").value.toLowerCase().trim();
  
  if (!query) {
    renderImageBank(presetImages);
    return;
  }

  const filtered = presetImages.filter(img => 
    img.name.toLowerCase().includes(query) || 
    img.tags.toLowerCase().includes(query)
  );

  renderImageBank(filtered);
};

// Drag Start Handler: Save standard data transfer url
function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.getAttribute("data-url"));
  e.dataTransfer.effectAllowed = "copy";
}

// Set up Form and Card Drop targets
function initDragAndDrop() {
  const dropZone = document.getElementById("formDropZone");
  if (!dropZone) return;

  // Add form dropzone listeners
  dropZone.addEventListener("dragover", handleFormDragOver);
  dropZone.addEventListener("dragenter", handleFormDragEnter);
  dropZone.addEventListener("dragleave", handleFormDragLeave);
  dropZone.addEventListener("drop", handleFormDrop);
}

// Form Dropzone handlers
function handleFormDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function handleFormDragEnter(e) {
  e.preventDefault();
  document.getElementById("formDropZone").classList.add("drag-over");
}

function handleFormDragLeave(e) {
  document.getElementById("formDropZone").classList.remove("drag-over");
}

function handleFormDrop(e) {
  e.preventDefault();
  const dropZone = document.getElementById("formDropZone");
  dropZone.classList.remove("drag-over");

  const imgUrl = e.dataTransfer.getData("text/plain");
  if (imgUrl && imgUrl.startsWith("http")) {
    selectedFormImage = imgUrl;
    
    // Update preview display
    const previewImg = document.getElementById("formImagePreview");
    previewImg.src = imgUrl;
    previewImg.style.display = "block";
    
    // Hide standard texts
    dropZone.querySelectorAll("span").forEach(el => el.style.display = "none");
  }
}

// Reset Dropzone back to empty placeholder state
function resetFormDropzone() {
  selectedFormImage = "";
  const dropZone = document.getElementById("formDropZone");
  if (!dropZone) return;

  const previewImg = document.getElementById("formImagePreview");
  previewImg.src = "";
  previewImg.style.display = "none";
  
  // Show standard placeholder text spans
  dropZone.querySelectorAll("span").forEach(el => el.style.display = "block");
}

// Card Target drag handlers: Allow swapping images by dropping directly onto cards
function handleCardDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function handleCardDragEnter(e) {
  e.preventDefault();
  // Find parent card element
  const card = e.target.closest(".exercise-card");
  if (card) {
    card.classList.add("drag-over");
  }
}

function handleCardDragLeave(e) {
  const card = e.target.closest(".exercise-card");
  if (card) {
    card.classList.remove("drag-over");
  }
}

function handleCardDrop(e) {
  e.preventDefault();
  const card = e.target.closest(".exercise-card");
  if (!card) return;

  card.classList.remove("drag-over");

  const imgUrl = e.dataTransfer.getData("text/plain");
  const exerciseId = parseInt(card.getAttribute("data-id"));

  if (imgUrl && imgUrl.startsWith("http") && !isNaN(exerciseId)) {
    exercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, image: imgUrl };
      }
      return ex;
    });
    saveExercises();
    renderExercises();
  }
}

// =========================================================================
// I. GEOLOCATION API INTEGRATION
// =========================================================================

// Initialize location retrieval on load (pull from localStorage if exists)
function initLocation() {
  const savedLoc = localStorage.getItem(STORAGE_KEY_LOCATION);
  if (savedLoc) {
    try {
      const data = JSON.parse(savedLoc);
      displayLocationData(data.lat, data.lon, data.address);
    } catch (e) {
      console.warn("Could not load stored geolocation parameters.");
    }
  }
}

// Main function triggered by "Detect Location" button
window.detectLocation = function() {
  const addressDetails = document.getElementById("locationDetails");
  if (!addressDetails) return;

  addressDetails.textContent = "📍 Accessing GPS coordinates...";

  if (!navigator.geolocation) {
    addressDetails.textContent = "❌ Geolocation API not supported in your browser.";
    return;
  }

  // Request high accuracy coordinate check
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      
      addressDetails.textContent = "📍 Coordinates retrieved. Fetching zone details...";
      
      let addressName = `Latitude: ${lat}, Longitude: ${lon}`;

      try {
        // Reverse Geocoding with OSM Nominatim API (Free, no token required)
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: { "Accept-Language": "en" }
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          const addr = geoData.address;
          const city = addr.city || addr.town || addr.village || addr.suburb || "Local Zone";
          const state = addr.state || "";
          const country = addr.country || "";
          addressName = `${city}${state ? ', ' + state : ''}, ${country}`;
        }
      } catch (e) {
        console.warn("OSM reverse lookup failed, using raw coordinates.", e);
      }

      // Display results in UI
      displayLocationData(lat, lon, addressName);

      // Save parameters in Local Storage
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify({
        lat: lat,
        lon: lon,
        address: addressName
      }));
    },
    (error) => {
      console.warn("Geolocation request failed:", error);
      let errMsg = "❌ Access denied. Please enable location permissions.";
      if (error.code === error.POSITION_UNAVAILABLE) {
        errMsg = "❌ Network location check unavailable.";
      } else if (error.code === error.TIMEOUT) {
        errMsg = "❌ Request timed out. Try again.";
      }
      addressDetails.textContent = errMsg;
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
};

// Render location coordinates inside the HTML nodes
function displayLocationData(lat, lon, address) {
  document.getElementById("locLat").textContent = lat;
  document.getElementById("locLon").textContent = lon;
  document.getElementById("locationDetails").textContent = `📍 ${address}`;
}

// =========================================================================
// IV. RESPONSIVE BREAKPOINT DEBUGGER
// =========================================================================

function initDebugger() {
  const toggleBtn = document.getElementById("toggleDebugger");
  const widget = document.getElementById("debuggerWidget");
  const showBtn = document.getElementById("showDebuggerBtn");

  if (!toggleBtn || !widget || !showBtn) return;

  toggleBtn.addEventListener("click", () => {
    widget.style.display = "none";
    showBtn.style.display = "block";
  });

  showBtn.addEventListener("click", () => {
    widget.style.display = "block";
    showBtn.style.display = "none";
  });

  // Track window resizing event
  window.addEventListener("resize", updateDebuggerMetrics);
  
  // Run once initially
  updateDebuggerMetrics();
}

function updateDebuggerMetrics() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const viewportSize = document.getElementById("viewportSize");
  if (viewportSize) {
    viewportSize.textContent = `${width}px x ${height}px`;
  }
  
  let breakpointLabel = "Mobile (<641px)";
  let gridLayoutText = "1 Column";
  
  if (width >= 1025) {
    breakpointLabel = "Desktop (>=1025px)";
    gridLayoutText = "3 Columns";
  } else if (width >= 769) {
    breakpointLabel = "Tablet (769px - 1024px)";
    gridLayoutText = "2 Columns (Grid Shift)";
  } else if (width >= 641) {
    breakpointLabel = "Small Tablet (641px - 768px)";
    gridLayoutText = "2 Columns";
  }

  const bpVal   = document.getElementById("activeBreakpoint");
  const gridVal  = document.getElementById("gridCols");
  const titleVal = document.getElementById("titleFontSize");

  if (bpVal)   bpVal.textContent   = breakpointLabel;
  if (gridVal) gridVal.textContent = gridLayoutText;

  // Report h1 font-size in debugger
  const heroH1 = document.querySelector("h1");
  if (heroH1 && titleVal) {
    titleVal.textContent = window.getComputedStyle(heroH1).fontSize;
  }

  // Update image label based on viewport width
  const heroImg     = document.getElementById("heroImg");
  const imgLabel    = document.getElementById("imageLabel");
  const dbgImgLabel = document.getElementById("loadedImageSrc");

  if (heroImg) {
    const currentSrc = heroImg.currentSrc || heroImg.src;
    const basename   = currentSrc.substring(currentSrc.lastIndexOf('/') + 1) || "Image";
    const viewMode   = width >= 1025 ? "🖥️ Desktop" : width >= 641 ? "📱 Tablet" : "📱 Mobile";
    if (imgLabel)    imgLabel.textContent    = viewMode;
    if (dbgImgLabel) dbgImgLabel.textContent = basename.split('?')[0];
  }
}
