const API_BASE = `${window.location.origin}/api/resource`;
const AUTH_BASE = `${window.location.origin}/api/auth`;
const USER_BASE = `${window.location.origin}/api/users`;
const TOKEN_KEY = "pet_adoption_token";

const petsGrid = document.getElementById("petsGrid");
const emptyState = document.getElementById("emptyState");
const loginPrompt = document.getElementById("loginPrompt");

let currentUser = null;
let allPets = [];

function setMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type || ""}`;
}

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

async function fetchProfile() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${USER_BASE}/profile`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    clearToken();
    return null;
  }

  const data = await res.json();
  return data.user || null;
}

function initNav() {
  const authLinks = document.getElementById("authLinks");
  const logoutBtn = document.getElementById("logoutBtn");
  const token = getToken();

  if (authLinks) {
    authLinks.innerHTML = token
      ? '<a href="profile.html">Profile</a>'
      : '<a href="login.html">Login</a> <a href="register.html">Register</a>';
  }

  if (logoutBtn) {
    logoutBtn.style.display = token ? "inline-block" : "none";
    logoutBtn.addEventListener("click", () => {
      clearToken();
      window.location.href = "index.html";
    });
  }
}

function renderPets(pets) {
  if (!petsGrid) return;

  if (!pets.length) {
    petsGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  petsGrid.innerHTML = pets
    .map((p) => {
      const isUser = currentUser && currentUser.role === "user";
      const isAdmin = currentUser && currentUser.role === "admin";
      const showAdopt = isUser;
      const adoptDisabled = p.status !== "available";
      const adoptText = adoptDisabled ? "Adopted" : "Adopt";

      return `
        <div class="card pet-card" data-pet-id="${p._id}">
          <img src="${p.imageUrl}" alt="${p.name}">
          <h3>${p.name}</h3>
          <div class="pet-meta">${p.species} • ${p.breed}</div>
          <div class="pet-meta">Age: ${p.age}</div>
          <span class="status">${p.status}</span>
          <div class="card-actions">
            ${showAdopt ? `<button class="btn btn-accent" data-adopt="${p._id}" ${adoptDisabled ? "disabled" : ""}>${adoptText}</button>` : ""}
            ${isAdmin ? `<button class="btn btn-outline" data-edit="${p._id}">Edit</button>` : ""}
            ${isAdmin ? `<button class="btn btn-danger" data-delete="${p._id}">Delete</button>` : ""}
          </div>
        </div>
      `;
    })
    .join("");
}

async function fetchPets() {
  const res = await fetch(API_BASE, { headers: authHeaders() });
  if (res.status === 401) {
    if (loginPrompt) {
      setMessage(loginPrompt, "Please login to view pets.", "error");
    }
    return [];
  }
  if (!res.ok) {
    if (loginPrompt) {
      setMessage(loginPrompt, "Failed to load pets.", "error");
    }
    return [];
  }
  const data = await res.json();
  return data.pets || [];
}

function initFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      if (filter === "all") {
        renderPets(allPets);
      } else {
        renderPets(allPets.filter((p) => p.species === filter));
      }
    });
  });
}

async function adoptPet(id) {
  if (!currentUser || currentUser.role !== "user") {
    if (loginPrompt) {
      setMessage(loginPrompt, "Login as a user to adopt.", "error");
    }
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/${id}/adopt`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const idx = allPets.findIndex((p) => p._id === id);
      if (idx !== -1) {
        allPets[idx] = { ...allPets[idx], status: "adopted" };
      }

      const card = petsGrid.querySelector(`[data-pet-id="${id}"]`);
      if (card) {
        const statusEl = card.querySelector(".status");
        if (statusEl) statusEl.textContent = "adopted";
        const adoptBtn = card.querySelector(`[data-adopt="${id}"]`);
        if (adoptBtn) {
          adoptBtn.textContent = "Adopted";
          adoptBtn.disabled = true;
        }
      }

      return;
    }

    alert(data.message || "Adopt failed.");
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
}

function toggleAdminPanel() {
  const panel = document.getElementById("adminPanel");
  if (!panel) return;
  if (currentUser && currentUser.role === "admin") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

function initCreateForm() {
  const form = document.getElementById("createPetForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("petName").value.trim(),
      species: document.getElementById("petSpecies").value,
      breed: document.getElementById("petBreed").value.trim(),
      age: Number(document.getElementById("petAge").value),
      imageUrl: document.getElementById("petImageUrl").value.trim(),
      status: document.getElementById("petStatus").value,
      description: document.getElementById("petDescription").value.trim(),
    };

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    const msg = document.getElementById("createMessage");
    if (res.ok) {
      setMessage(msg, "Pet created.", "success");
      form.reset();
      await loadPets();
    } else {
      const data = await res.json();
      const text = data.message || "Create failed.";
      setMessage(msg, text, "error");
    }
  });
}

function openEdit(id) {
  const pet = allPets.find((p) => p._id === id);
  if (!pet) return;

  document.getElementById("editPetId").value = pet._id;
  document.getElementById("editName").value = pet.name;
  document.getElementById("editSpecies").value = pet.species;
  document.getElementById("editBreed").value = pet.breed;
  document.getElementById("editAge").value = pet.age;
  document.getElementById("editImageUrl").value = pet.imageUrl;
  document.getElementById("editStatus").value = pet.status;
  document.getElementById("editDescription").value = pet.description || "";

  document.getElementById("editModal").classList.add("open");
}

function closeEdit() {
  document.getElementById("editModal").classList.remove("open");
  const msg = document.getElementById("editMessage");
  if (msg) msg.textContent = "";
}

function initEditForm() {
  const form = document.getElementById("editPetForm");
  const cancelBtn = document.getElementById("editCancel");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeEdit);
  }

  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editPetId").value;
    const payload = {
      name: document.getElementById("editName").value.trim(),
      species: document.getElementById("editSpecies").value,
      breed: document.getElementById("editBreed").value.trim(),
      age: Number(document.getElementById("editAge").value),
      imageUrl: document.getElementById("editImageUrl").value.trim(),
      status: document.getElementById("editStatus").value,
      description: document.getElementById("editDescription").value.trim(),
    };

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    const msg = document.getElementById("editMessage");
    if (res.ok) {
      setMessage(msg, "Pet updated.", "success");
      await loadPets();
      closeEdit();
    } else {
      const data = await res.json();
      setMessage(msg, data.message || "Update failed.", "error");
    }
  });
}

async function deletePet(id) {
  if (!currentUser || currentUser.role !== "admin") return;
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (res.ok) {
    await loadPets();
  }
}

async function loadPets() {
  allPets = await fetchPets();
  renderPets(allPets);
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const msg = document.getElementById("loginMessage");

    const res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok && data.token) {
      setToken(data.token);
      window.location.href = "index.html";
    } else {
      setMessage(msg, data.message || "Login failed.", "error");
    }
  });
}

function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("registerConfirm").value.trim();
    const msg = document.getElementById("registerMessage");

    if (password !== confirm) {
      setMessage(msg, "Passwords do not match.", "error");
      return;
    }

    const res = await fetch(`${AUTH_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (res.ok && data.token) {
      setToken(data.token);
      window.location.href = "index.html";
    } else {
      setMessage(msg, data.message || "Registration failed.", "error");
    }
  });
}

async function initProfile() {
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const roleEl = document.getElementById("profileRole");
  const msg = document.getElementById("profileMessage");
  if (!nameEl || !emailEl || !roleEl) return;

  const user = await fetchProfile();
  if (!user) {
    setMessage(msg, "Please login first.", "error");
    return;
  }

  nameEl.textContent = user.name || "";
  emailEl.textContent = user.email || "";
  roleEl.textContent = user.role || "user";
}

document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  initLogin();
  initRegister();
  initEditForm();

  currentUser = await fetchProfile();
  toggleAdminPanel();

  if (petsGrid) {
    petsGrid.addEventListener("click", (event) => {
      const adoptBtn = event.target.closest("[data-adopt]");
      if (adoptBtn) {
        adoptPet(adoptBtn.dataset.adopt);
        return;
      }

      const editBtn = event.target.closest("[data-edit]");
      if (editBtn) {
        openEdit(editBtn.dataset.edit);
        return;
      }

      const deleteBtn = event.target.closest("[data-delete]");
      if (deleteBtn) {
        deletePet(deleteBtn.dataset.delete);
      }
    });
    initFilters();
    initCreateForm();
    await loadPets();
  }

  initProfile();
});
