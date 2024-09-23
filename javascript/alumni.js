let alumniProfiles = [];

const addProfileButton = document.getElementById("addProfileButton");
const formContainer = document.getElementById("formContainer");
const cancelButton = document.getElementById("cancelButton");
const alumniForm = document.getElementById("alumniForm");
const profileGrid = document.getElementById("profileGrid");

// Save data to localStorage
function saveData() {
  localStorage.setItem("alumniData", JSON.stringify(alumniProfiles));
}

// Load data from localStorage
function loadData() {
  const data = localStorage.getItem("alumniData");
  if (data) {
    alumniProfiles = JSON.parse(data);
  }
}

// Create a new profile
function createProfile(profile) {
  const newId = alumniProfiles.length ? Math.max(...alumniProfiles.map(p => p.id)) + 1 : 0;
  alumniProfiles.push({ id: newId, ...profile });
  saveData();
  renderProfiles();
}

// Update an existing profile
function updateProfile(id, updatedProfile) {
  const index = alumniProfiles.findIndex(profile => profile.id === id);
  if (index !== -1) {
    alumniProfiles[index] = { ...alumniProfiles[index], ...updatedProfile };
    saveData();
    renderProfiles();
  }
}

// Delete a profile
function deleteProfile(id) {
  alumniProfiles = alumniProfiles.filter(profile => profile.id !== id);
  saveData();
  renderProfiles();
}

// Edit a profile
function editProfile(id) {
  const profile = alumniProfiles.find(profile => profile.id === id);
  if (profile) {
    document.getElementById("profileId").value = id;
    document.getElementById("alumniName").value = profile.name;
    document.getElementById("alumniMajor").value = profile.major;
    document.getElementById("alumniYear").value = profile.year;
    document.getElementById("alumniJob").value = profile.job;

    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = profile.photoUrl ? `<img src="${profile.photoUrl}" alt="Preview Image" id="previewImage">` : "";
    showForm();
  }
}

// Preview image before upload
function previewPhoto(event) {
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = document.createElement("img");
      imgElement.src = e.target.result;
      imgElement.alt = "Preview Image";
      imgElement.id = "previewImage";
      previewContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  }
}

// Handle form submit
function addOrUpdateProfile(event) {
  event.preventDefault();
  const id = document.getElementById("profileId").value;
  const name = document.getElementById("alumniName").value;
  const major = document.getElementById("alumniMajor").value;
  const year = document.getElementById("alumniYear").value;
  const job = document.getElementById("alumniJob").value;

  const previewImage = document.getElementById("previewImage");
  const photoUrl = previewImage ? previewImage.src : "";

  if (id) {
    updateProfile(parseInt(id), { name, major, year, job, photoUrl });
  } else {
    createProfile({ name, major, year, job, photoUrl });
  }

  resetForm();
  hideForm();
}

// Reset form inputs
function resetForm() {
  alumniForm.reset();
  document.getElementById("profileId").value = "";
  document.getElementById("previewContainer").innerHTML = "";
}

// Render all alumni profiles
function renderProfiles() {
  profileGrid.innerHTML = "";

  alumniProfiles.forEach((profile) => {
    const profileElement = document.createElement("div");
    profileElement.className = "profile";
    profileElement.innerHTML = `
      <img src="${profile.photoUrl || "../img/default_avatar.png"}" alt="${profile.name}">
      <h2>${profile.name}</h2>
      <p>Lulusan ${profile.major}, Angkatan ${profile.year}</p>
      <p>Saat ini bekerja sebagai ${profile.job}</p>
      <div class="profile-buttons">
        <button onclick="editProfile(${profile.id})">Edit</button>
        <button onclick="deleteProfile(${profile.id})">Delete</button>
      </div>
    `;
    profileGrid.appendChild(profileElement);
  });
}

// Show form to add/edit profiles
function showForm() {
  formContainer.style.display = "block";
  addProfileButton.style.display = "none";
}

// Hide form
function hideForm() {
  formContainer.style.display = "none";
  addProfileButton.style.display = "flex";
}

// Event listeners
addProfileButton.addEventListener("click", showForm);
cancelButton.addEventListener("click", () => {
  hideForm();
  resetForm();
});
alumniForm.addEventListener("submit", addOrUpdateProfile);
document.getElementById("alumniPhoto").addEventListener("change", previewPhoto);

// Initial setup
window.onload = () => {
  loadData();
  renderProfiles();
};
