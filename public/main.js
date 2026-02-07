const API_BASE = `${window.location.origin}/api`;
const TOKEN_KEY = "pet_adoption_token";

let allPets = [];
let filteredPets = [];
let currentFilter = "all";
let currentSearch = "";
let currentPetForAdoption = null;

const speciesMap = {
  dog: "dog",
  cat: "cat",
  other: "other"
};

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setMessage(el, text, ok) {
  if (!el) return;
  el.textContent = text;
  el.className = ok ? "message success" : "message error";
}

function mapSpeciesToCategory(species) {
  return speciesMap[(species || "").toLowerCase()] || "other";
}

function initNav() {
  const authNav = document.getElementById("authNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const token = getToken();

  if (authNav) {
    if (token) {
      authNav.innerHTML = '<a href="profile.html" class="nav-link">Profile</a>';
    } else {
      authNav.innerHTML =
        '<a href="login.html" class="nav-link">Login</a>' +
        '<a href="register.html" class="nav-link">Register</a>';
    }
  }

  if (logoutBtn) {
    logoutBtn.style.display = token ? "inline-block" : "none";
    logoutBtn.onclick = () => {
      clearToken();
      window.location.href = "index.html";
    };
  }
}

async function fetchPets() {
  try {
    const response = await fetch(`${API_BASE}/pets`);
    const data = await response.json();
    allPets = data.pets || [];
    applyFilters();
  } catch (error) {
    const grid = document.getElementById("petsGrid");
    if (grid) {
      grid.innerHTML = '<div class="empty-state"><p>Failed to load pets.</p></div>';
    }
  }
}

function applyFilters() {
  filteredPets = allPets.filter((pet) => {
    const categoryMatch =
      currentFilter === "all" || mapSpeciesToCategory(pet.species) === currentFilter;
    const searchMatch =
      currentSearch === "" ||
      (pet.name || "").toLowerCase().includes(currentSearch.toLowerCase()) ||
      (pet.breed || "").toLowerCase().includes(currentSearch.toLowerCase());
    return categoryMatch && searchMatch;
  });

  renderPets();
}

function renderPets() {
  const grid = document.getElementById("petsGrid");
  if (!grid) return;

  if (filteredPets.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No pets found.</p></div>';
    return;
  }

  grid.innerHTML = filteredPets
    .map(
      (pet) => `
    <div class="pet-card ${pet.status === "adopted" ? "disabled" : ""}" data-id="${pet._id}">
      <div class="pet-image-wrapper">
        <img src="${pet.imageUrl}" alt="${pet.name}" class="pet-image">
      </div>
      <div class="pet-card-body">
        <div class="pet-name">${pet.name}</div>
        <div class="pet-type">${pet.species}</div>
        <div class="pet-info-grid">
          <div class="pet-info-item">
            <strong>Breed</strong>
            ${pet.breed}
          </div>
          <div class="pet-info-item">
            <strong>Age</strong>
            ${pet.age}
          </div>
        </div>
        <div class="pet-description">${pet.description || ""}</div>
        <span class="pet-status ${pet.status === "adopted" ? "adopted" : "available"}">${pet.status}</span>
        <div class="pet-actions">
          <button class="btn-view" ${pet.status === "adopted" ? "disabled" : ""}>View Details</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll(".pet-card").forEach((card) => {
    card.addEventListener("click", () => openPetModal(card.dataset.id));
  });
}

function openPetModal(petId) {
  const pet = allPets.find((p) => p._id === petId);
  if (!pet) return;

  currentPetForAdoption = pet;

  document.getElementById("modalPetImage").src = pet.imageUrl;
  document.getElementById("modalPetName").textContent = pet.name;
  document.getElementById("modalPetType").textContent = pet.species;
  document.getElementById("modalPetBreed").textContent = pet.breed;
  document.getElementById("modalPetAge").textContent = String(pet.age);
  document.getElementById("modalPetDescription").textContent = pet.description || "";
  const badge = document.getElementById("statusBadge");
  badge.textContent = pet.status;
  badge.className = `status-badge ${pet.status === "adopted" ? "adopted" : ""}`;

  const modal = document.getElementById("petModal");
  modal.classList.add("active");
}

function closePetModal() {
  const modal = document.getElementById("petModal");
  modal.classList.remove("active");
  currentPetForAdoption = null;
}

async function adoptCurrentPet() {
  if (!currentPetForAdoption) return;
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }

  const response = await fetch(`${API_BASE}/pets/${currentPetForAdoption._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ status: "adopted" })
  });

  if (response.ok) {
    closePetModal();
    await fetchPets();
  } else {
    const msg = document.getElementById("adoptMessage");
    setMessage(msg, "Failed to adopt. Try again.", false);
  }
}

async function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const msg = document.getElementById("loginMessage");

    if (response.ok && data.token) {
      setToken(data.token);
      window.location.href = "index.html";
    } else {
      setMessage(msg, data.message || "Login failed.", false);
    }
  });
}

async function handleRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    const msg = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
      setMessage(msg, "Passwords do not match.", false);
      return;
    }

    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      setToken(data.token);
      window.location.href = "index.html";
    } else {
      setMessage(msg, data.message || "Registration failed.", false);
    }
  });
}

async function loadProfile() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const updateBtn = document.getElementById("updateProfileBtn");
  const msg = document.getElementById("profileMessage");

  if (!profileName || !profileEmail || !updateBtn) return;
  if (!getToken()) {
    window.location.href = "login.html";
    return;
  }

  const meResponse = await fetch(`${API_BASE}/users/me`, {
    headers: authHeaders()
  });

  if (!meResponse.ok) {
    clearToken();
    window.location.href = "login.html";
    return;
  }

  const meData = await meResponse.json();
  profileName.value = meData.user.name || "";
  profileEmail.value = meData.user.email || "";

  updateBtn.addEventListener("click", async () => {
    const payload = {
      name: profileName.value.trim(),
      email: profileEmail.value.trim()
    };
    const newPassword = document.getElementById("profileNewPassword").value.trim();
    if (newPassword) payload.password = newPassword;

    const response = await fetch(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(msg, "Profile updated.", true);
    } else {
      setMessage(msg, data.message || "Update failed.", false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();

  const modal = document.getElementById("petModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.id === "petModal") closePetModal();
    });
  }

  const modalClose = document.getElementById("modalCloseBtn");
  if (modalClose) modalClose.addEventListener("click", closePetModal);

  const adoptBtn = document.getElementById("adoptBtn");
  if (adoptBtn) adoptBtn.addEventListener("click", adoptCurrentPet);

  if (document.getElementById("petsGrid")) {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        currentFilter = e.target.dataset.category;
        currentSearch = document.getElementById("searchInput").value;
        applyFilters();
      });
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value;
      applyFilters();
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
      document.getElementById("searchInput").value = "";
      currentSearch = "";
      applyFilters();
    });

    setInterval(() => {
      const heroImg = document.getElementById("heroImg");
      if (filteredPets.length > 0 && heroImg) {
        const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];
        heroImg.src = randomPet.imageUrl;
      }
    }, 5000);

    fetchPets();
  }

  handleLogin();
  handleRegister();
  loadProfile();
});