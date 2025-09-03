// Minecraft Server App JavaScript

let currentUser = "";

// Rank system
const ranks = {
  count: { name: 'Count', price: 0, badge: 'count-badge', level: 1 },
  baron: { name: 'Baron', price: 500, badge: 'baron-badge', level: 2 },
  duke: { name: 'Duke', price: 1200, badge: 'duke-badge', level: 3 },
  archon: { name: 'Archon', price: 2500, badge: 'archon-badge', level: 4 },
  marquis: { name: 'Marquis', price: 5000, badge: 'marquis-badge', level: 5 }
};

const rankOrder = ['count', 'baron', 'duke', 'archon', 'marquis'];

// Get user rank
function getUserRank(username) {
  return localStorage.getItem('rank_' + username) || 'count';
}

// Set user rank
function setUserRank(username, rank) {
  localStorage.setItem('rank_' + username, rank);
}

// Update rank display
function updateRankDisplay(username, rankKey) {
  const rank = ranks[rankKey];
  if (document.getElementById('rank-name')) {
    document.getElementById('rank-name').textContent = rank.name;
  }
  if (document.getElementById('rank-badge')) {
    document.getElementById('rank-badge').className = `rank-badge ${rank.badge}`;
  }
}

// Initialize particles and blocks on load
document.addEventListener('DOMContentLoaded', function() {
  createMinecraftParticles();
  createFloatingBlocks();
  
  // Recreate particles periodically
  setInterval(() => {
    createMinecraftParticles();
  }, 10000);
  
  setInterval(() => {
    createFloatingBlocks();
  }, 15000);
});

// Create floating particles
function createMinecraftParticles() {
  const container = document.querySelector('.minecraft-particles');
  if (!container) return;
  
  // Clear old particles
  container.innerHTML = '';
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const types = ['dirt', 'grass', 'stone', 'diamond'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    particle.className = `particle particle-${type}`;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
  }
}

// Create floating blocks
function createFloatingBlocks() {
  const container = document.querySelector('.floating-blocks');
  if (!container) return;
  
  // Clear old blocks
  container.innerHTML = '';
  
  for (let i = 0; i < 8; i++) {
    const block = document.createElement('div');
    const types = ['grass-block', 'dirt-block', 'stone-block', 'diamond-block', 'emerald-block'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    block.className = `minecraft-block ${type}`;
    block.style.left = Math.random() * 100 + 'vw';
    block.style.animationDelay = Math.random() * 25 + 's';
    block.style.animationDuration = (20 + Math.random() * 10) + 's';
    
    container.appendChild(block);
  }
}

// Play Minecraft sounds (placeholder - would need actual sound files)
function playMinecraftSound(soundType) {
  // Sound effects would go here
  // For now, just console log
  console.log(`Playing ${soundType} sound`);
}

// LOGIN FUNCTION
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!username || !password) {
    showMinecraftAlert("⚠️ Please enter both username and password!", "warning");
    return;
  }

  // Play login sound
  playMinecraftSound('click');

  // OWNER LOGIN
  if (username === "malifromtorino") {
    const savedPass = localStorage.getItem("user_" + username);
    if (savedPass && savedPass !== password) {
      showMinecraftAlert("🚫 Owner password incorrect!", "error");
      return;
    }
    localStorage.setItem("user_" + username, password);
    if (!localStorage.getItem("coins_" + username)) {
      localStorage.setItem("coins_" + username, "1000"); // Owner starts with coins
    }
    currentUser = username;
    showOwnerDashboard();
    return;
  }

  // NORMAL USER LOGIN/REGISTER
  const savedPass = localStorage.getItem("user_" + username);
  if (savedPass) {
    if (savedPass !== password) {
      showMinecraftAlert("🚫 Password does not match!", "error");
      return;
    }
    showMinecraftAlert("🎉 Welcome back, " + username + "!", "success");
  } else {
    localStorage.setItem("user_" + username, password);
    localStorage.setItem("coins_" + username, "50"); // New users get starter coins
    setUserRank(username, 'count'); // New users start as Count
    showMinecraftAlert("✅ Account created! Welcome to Alnership!", "success");
  }
  
  currentUser = username;
  showUserDashboard(username);
}

// Custom Minecraft-style alert
function showMinecraftAlert(message, type = "info") {
  const alert = document.createElement('div');
  alert.className = `minecraft-alert ${type}`;
  alert.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    border: 4px solid ${type === 'error' ? '#DC143C' : type === 'success' ? '#228B22' : '#FFD700'};
    color: white;
    padding: 20px;
    z-index: 1000;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  `;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// SHOW USER DASHBOARD
function showUserDashboard(username) {
  document.getElementById('login-container').style.display = "none";
  document.getElementById('dashboard').style.display = "block";
  document.getElementById('owner-dashboard').style.display = "none";
  
  document.getElementById('display-user-top').textContent = username;
  document.getElementById('user-avatar-top').src = `https://minotar.net/avatar/${username}/60`;
  
  const coins = localStorage.getItem("coins_" + username) || "0";
  document.getElementById('display-coins-top').innerHTML = `<span class="coin-animation">${coins} 🪙</span>`;
  
  // Update rank display
  const userRank = getUserRank(username);
  updateRankDisplay(username, userRank);
  
  playMinecraftSound('success');
}

// SHOW OWNER DASHBOARD
function showOwnerDashboard() {
  document.getElementById('login-container').style.display = "none";
  document.getElementById('dashboard').style.display = "none";
  document.getElementById('owner-dashboard').style.display = "block";
  
  const ownerCoins = localStorage.getItem("coins_malifromtorino") || "1000";
  document.getElementById('display-coins-top-owner').innerHTML = `<span class="coin-animation">${ownerCoins} 🪙</span>`;

  updateUsersTable();
  playMinecraftSound('success');
}

// UPDATE USERS TABLE
function updateUsersTable() {
  const tbody = document.getElementById('users-table');
  tbody.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("user_")) {
      const username = key.replace("user_", "");
      const coins = localStorage.getItem("coins_" + username) || "0";
      const userRank = getUserRank(username);
      const rankInfo = ranks[userRank];
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img class="minecraft-avatar" src="https://minotar.net/avatar/${username}/60" alt="${username}"></td>
        <td>${username}</td>
        <td>
          <div class="rank-badge ${rankInfo.badge}" style="width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></div>
          ${rankInfo.name}
        </td>
        <td><span class="coin-animation">${coins} 🪙</span></td>
        <td>
          <button class="minecraft-btn secondary" onclick="addCoins('${username}', 100)" title="Add 100 coins">+100 🪙</button>
          <button class="minecraft-btn secondary" onclick="removeCoins('${username}', 100)" title="Remove 100 coins">-100 🪙</button>
          <button class="minecraft-btn danger" onclick="banUser('${username}')" title="Ban user">🔨 Ban</button>
          <button class="minecraft-btn primary" onclick="promoteUser('${username}')" title="Promote rank">⬆️ Promote</button>
        </td>
      `;
      
      tbody.appendChild(row);
    }
  }
}

// OWNER ADD COINS
function addCoins(username, amount) {
  const coins = parseInt(localStorage.getItem("coins_" + username) || "0");
  localStorage.setItem("coins_" + username, coins + amount);
  updateUsersTable();
  showMinecraftAlert(`🪙 Added ${amount} coins to ${username}!`, "success");
  playMinecraftSound('coin');
}

// OWNER REMOVE COINS
function removeCoins(username, amount) {
  let coins = parseInt(localStorage.getItem("coins_" + username) || "0");
  coins = Math.max(0, coins - amount); // Can't go negative
  localStorage.setItem("coins_" + username, coins);
  updateUsersTable();
  showMinecraftAlert(`🪙 Removed ${amount} coins from ${username}!`, "warning");
  playMinecraftSound('break');
}

// OWNER BAN USER
function banUser(username) {
  if (username === "malifromtorino") {
    showMinecraftAlert("👑 Cannot ban the server owner!", "error");
    return;
  }
  
  // Custom Minecraft-style confirmation
  const confirmed = confirm(`🔨 Are you sure you want to ban ${username}?\n\nThis will permanently delete their account and cannot be undone!`);
  
  if (confirmed) {
    localStorage.removeItem("user_" + username);
    localStorage.removeItem("coins_" + username);
    updateUsersTable();
    showMinecraftAlert(`🔨 ${username} has been banned from the server!`, "error");
    playMinecraftSound('anvil');
  }
}

// SETTINGS TOGGLE
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('show');
  playMinecraftSound('click');
}

// CHANGE PASSWORD
function changePassword() {
  const newPassInput = document.getElementById('new-password');
  const newPass = newPassInput.value.trim();
  
  if (!newPass) {
    showMinecraftAlert("⚠️ Please enter a new password!", "warning");
    return;
  }
  
  if (newPass.length < 4) {
    showMinecraftAlert("⚠️ Password must be at least 4 characters!", "warning");
    return;
  }
  
  localStorage.setItem("user_" + currentUser, newPass);
  newPassInput.value = "";
  showMinecraftAlert("✅ Password changed successfully!", "success");
  playMinecraftSound('success');
}

// LOGOUT FUNCTION
function logout() {
  const confirmed = confirm("🚪 Are you sure you want to logout?");
  if (confirmed) {
    currentUser = "";
    document.getElementById('login-container').style.display = "block";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('owner-dashboard').style.display = "none";
    
    // Clear login form
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    
    // Hide settings panel
    document.getElementById('settings-panel').classList.remove('show');
    
    showMinecraftAlert("👋 Logged out successfully!", "info");
    playMinecraftSound('click');
  }
}

// Close settings panel when clicking outside
document.addEventListener('click', function(event) {
  const settingsPanel = document.getElementById('settings-panel');
  const settingsBtn = event.target.closest('.settings-btn');
  
  if (!settingsBtn && !settingsPanel.contains(event.target)) {
    settingsPanel.classList.remove('show');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Enter to login on login page
  if (event.key === 'Enter') {
    if (document.getElementById('login-container').style.display !== 'none') {
      login();
    }
  }
  
  // Escape to close settings
  if (event.key === 'Escape') {
    document.getElementById('settings-panel').classList.remove('show');
  }
});

// Add some fun Easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(event) {
  konamiCode.push(event.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    if (currentUser) {
      const currentCoins = parseInt(localStorage.getItem("coins_" + currentUser) || "0");
      localStorage.setItem("coins_" + currentUser, currentCoins + 1000);
      
      if (currentUser === "malifromtorino") {
        document.getElementById('display-coins-top-owner').innerHTML = `<span class="coin-animation">${currentCoins + 1000} 🪙</span>`;
      } else {
        document.getElementById('display-coins-top').innerHTML = `<span class="coin-animation">${currentCoins + 1000} 🪙</span>`;
      }
      
      showMinecraftAlert("🎉 Konami Code activated! +1000 coins!", "success");
      playMinecraftSound('levelup');
    }
    konamiCode = [];
  }
});

// Store Functions
function openStore() {
  const storeModal = document.getElementById('store-modal');
  storeModal.classList.add('show');
  
  // Update store displays
  if (currentUser) {
    const userRank = getUserRank(currentUser);
    const coins = localStorage.getItem('coins_' + currentUser) || '0';
    
    document.getElementById('current-rank-display').textContent = ranks[userRank].name;
    document.getElementById('store-coins-display').textContent = coins + ' 🪙';
    
    updateStoreButtons();
  }
  
  playMinecraftSound('click');
}

function closeStore() {
  const storeModal = document.getElementById('store-modal');
  storeModal.classList.remove('show');
  playMinecraftSound('click');
}

function showStoreTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.store-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.store-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  event.target.classList.add('active');
  
  playMinecraftSound('click');
}

function updateStoreButtons() {
  if (!currentUser) return;
  
  const userRank = getUserRank(currentUser);
  const userCoins = parseInt(localStorage.getItem('coins_' + currentUser) || '0');
  const currentRankLevel = ranks[userRank].level;
  
  // Update rank buttons
  document.querySelectorAll('.rank-item').forEach(item => {
    const rankKey = item.dataset.rank;
    const rank = ranks[rankKey];
    const button = item.querySelector('button');
    
    if (rank.level <= currentRankLevel) {
      button.textContent = 'Owned';
      button.disabled = true;
      button.className = 'minecraft-btn secondary';
    } else if (userCoins >= rank.price) {
      button.disabled = false;
      button.className = 'minecraft-btn primary';
    } else {
      button.disabled = true;
      button.className = 'minecraft-btn secondary';
    }
  });
}

function buyRank(rankKey, price) {
  if (!currentUser) return;
  
  const userCoins = parseInt(localStorage.getItem('coins_' + currentUser) || '0');
  const currentRankLevel = ranks[getUserRank(currentUser)].level;
  const targetRankLevel = ranks[rankKey].level;
  
  if (targetRankLevel <= currentRankLevel) {
    showMinecraftAlert('❌ You already own this rank or higher!', 'error');
    return;
  }
  
  if (userCoins < price) {
    showMinecraftAlert('❌ Not enough coins!', 'error');
    return;
  }
  
  // Purchase rank
  localStorage.setItem('coins_' + currentUser, userCoins - price);
  setUserRank(currentUser, rankKey);
  
  // Update displays
  updateRankDisplay(currentUser, rankKey);
  const newCoins = userCoins - price;
  document.getElementById('display-coins-top').innerHTML = `<span class="coin-animation">${newCoins} 🪙</span>`;
  document.getElementById('store-coins-display').textContent = newCoins + ' 🪙';
  document.getElementById('current-rank-display').textContent = ranks[rankKey].name;
  
  updateStoreButtons();
  
  showMinecraftAlert(`🎉 Congratulations! You are now a ${ranks[rankKey].name}!`, 'success');
  playMinecraftSound('levelup');
}

function buyItem(itemKey, price, requiredRank) {
  if (!currentUser) return;
  
  const userCoins = parseInt(localStorage.getItem('coins_' + currentUser) || '0');
  const userRank = getUserRank(currentUser);
  const userRankLevel = ranks[userRank].level;
  const requiredRankLevel = ranks[requiredRank].level;
  
  if (userRankLevel < requiredRankLevel) {
    showMinecraftAlert(`❌ You need ${ranks[requiredRank].name} rank or higher!`, 'error');
    return;
  }
  
  if (userCoins < price) {
    showMinecraftAlert('❌ Not enough coins!', 'error');
    return;
  }
  
  // Purchase item
  localStorage.setItem('coins_' + currentUser, userCoins - price);
  
  // Add item to user's inventory (simplified)
  const userItems = JSON.parse(localStorage.getItem('items_' + currentUser) || '[]');
  userItems.push(itemKey);
  localStorage.setItem('items_' + currentUser, JSON.stringify(userItems));
  
  // Update coin display
  const newCoins = userCoins - price;
  document.getElementById('display-coins-top').innerHTML = `<span class="coin-animation">${newCoins} 🪙</span>`;
  document.getElementById('store-coins-display').textContent = newCoins + ' 🪙';
  
  showMinecraftAlert(`✅ Successfully purchased ${itemKey.replace('_', ' ')}!`, 'success');
  playMinecraftSound('success');
}

// Owner Functions
function promoteUser(username) {
  if (currentUser !== 'malifromtorino') return;
  
  const currentRank = getUserRank(username);
  const currentIndex = rankOrder.indexOf(currentRank);
  
  if (currentIndex < rankOrder.length - 1) {
    const newRank = rankOrder[currentIndex + 1];
    setUserRank(username, newRank);
    updateUsersTable();
    showMinecraftAlert(`⬆️ Promoted ${username} to ${ranks[newRank].name}!`, 'success');
  } else {
    showMinecraftAlert(`❌ ${username} is already at maximum rank!`, 'error');
  }
}

// Close store when clicking outside
document.addEventListener('click', function(event) {
  const storeModal = document.getElementById('store-modal');
  if (event.target === storeModal) {
    closeStore();
  }
});

// Auto-save prevention message
window.addEventListener('beforeunload', function(event) {
  if (currentUser) {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to leave the Minecraft server?';
  }
});