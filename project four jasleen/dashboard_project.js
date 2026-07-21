/**
 * Project 4: Express Integration & Front-End REST API Fetching
 */

let activities = [];
let descendingOrder = true;

// UI Helpers
function showLoading(show) {
  const loader = document.getElementById('loading-indicator');
  const logList = document.getElementById('log-list');
  if (show) {
    loader.classList.remove('hidden');
    logList.style.opacity = '0.3';
  } else {
    loader.classList.add('hidden');
    logList.style.opacity = '1';
  }
}

function displayBanner(elementId, message, duration = 4000) {
  const banner = document.getElementById(elementId);
  banner.innerHTML = message;
  banner.classList.remove('hidden');
  if (duration > 0) {
    setTimeout(() => {
      banner.classList.add('hidden');
    }, duration);
  }
}

// -------------------------------------------------------------
// API FETCH OPERATIONS (GET & POST)
// -------------------------------------------------------------

async function fetchLogsFromAPI() {
  showLoading(true);
  try {
    const response = await fetch('/api/items');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const resData = await response.json();
    activities = resData.data || [];
    
    // Update environment indicator UI
    const envBadge = document.getElementById('env-badge');
    if (envBadge && resData.environment) {
      envBadge.textContent = `Env: ${resData.environment}`;
    }

    processAndRenderLogs();
  } catch (err) {
    console.error('Failed to retrieve logs:', err);
    displayBanner('error-banner', `⚠️ API Error: Unable to sync with backend server.`, 0);
  } finally {
    showLoading(false);
  }
}

async function createLogItemAPI(actionText, categoryType = 'profile') {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionText, category: categoryType })
    });

    if (!response.ok) throw new Error(`Server returned status ${response.status}`);

    const resData = await response.json();
    
    // Append the newly created item returned from Express API
    activities.push(resData.data);
    processAndRenderLogs();
    displayBanner('status-banner', '✅ Sync successful! Record stored on server.');
  } catch (err) {
    console.error('Failed to post activity:', err);
    displayBanner('error-banner', '⚠️ Failed to persist update on cloud server.');
  }
}

// -------------------------------------------------------------
// UI RENDERING & FILTERING
// -------------------------------------------------------------

function processAndRenderLogs() {
  const logListContainer = document.getElementById('log-list');
  const selectedFilter = document.getElementById('filter-type').value;

  let processedArray = activities.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  processedArray.sort((a, b) => {
    return descendingOrder ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
  });

  if (processedArray.length === 0) {
    logListContainer.innerHTML = `<p class="empty-state">No dynamic logs match this filter constraint.</p>`;
    return;
  }

  logListContainer.innerHTML = processedArray.map(item => {
    const formattedTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `
      <div class="log-card border-${item.category}">
        <div class="log-details">
          <span class="category-indicator color-${item.category}">${item.category}</span>
          <p class="log-text">${item.action}</p>
        </div>
        <span class="log-time">${formattedTime}</span>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// FORM SUBMISSION & EVENT LISTENERS
// -------------------------------------------------------------

document.getElementById('user-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name').value.trim();
  const emailInput = document.getElementById('email').value.trim();
  const colorInput = document.getElementById('fav-color').value.trim().toLowerCase();

  if (nameInput.length < 2) {
    displayBanner('error-banner', '⚠️ Please enter a valid name (2+ characters).');
    return;
  }

  // Clear previous errors
  document.getElementById('error-banner').classList.add('hidden');

  // Local DOM update
  document.getElementById('display-name').textContent = nameInput;
  document.getElementById('display-email').textContent = emailInput;
  document.getElementById('display-color-badge').textContent = `Favorite Color: ${colorInput}`;

  const card = document.getElementById('profile-card');
  if (colorInput === 'pink' || colorInput === 'lightpink') {
    card.style.background = 'linear-gradient(135deg, #ffe4e1, #ffb6c1)';
  } else {
    card.style.background = colorInput;
  }

  // Save new record directly to Express API
  await createLogItemAPI(`Updated profile details to: "${nameInput}"`, 'profile');
});

document.getElementById('filter-type').addEventListener('change', processAndRenderLogs);

document.getElementById('sort-btn').addEventListener('click', function() {
  descendingOrder = !descendingOrder;
  processAndRenderLogs();
});

// Initial Page Load
window.addEventListener('DOMContentLoaded', () => {
  fetchLogsFromAPI();
});
