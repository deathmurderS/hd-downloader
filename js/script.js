// script.js - Main Application Logic

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

// Auth Handlers
function handleGoogleSignIn() {
  AuthManager.signInWithGoogle();
  UI.render();
}

function handleSignOut() {
  if (confirm('Yakin ingin keluar?')) {
    AuthManager.signOut();
    UI.render();
  }
}

// File Handlers
async function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  UI.showUploadStatus('Uploading...', 'info');
  
  try {
    const quality = FileManager.getHDQuality();
    const promises = files.map(file => FileManager.uploadFile(file, quality));
    await Promise.all(promises);
    
    UI.showUploadStatus('Upload berhasil!', 'success');
    UI.render();
  } catch (error) {
    UI.showUploadStatus('Upload gagal: ' + error.message, 'error');
  }
  
  event.target.value = '';
}

function downloadFile(fileId) {
  const file = FileManager.getFile(fileId);
  if (file) {
    FileManager.downloadFile(file);
  }
}

function editFile(fileId) {
  UI.showEditFileModal(fileId);
}

function saveFileEdit(fileId) {
  const newName = document.getElementById('editFileName').value;
  if (newName.trim()) {
    FileManager.updateFile(fileId, { name: newName.trim() });
    UI.closeModal();
    UI.render();
  }
}

function deleteFileConfirm(fileId) {
  if (confirm('Yakin ingin menghapus file ini?')) {
    FileManager.deleteFile(fileId);
    UI.closeModal();
    UI.render();
  }
}

// Profile Handlers
function showProfile() {
  UI.showProfileModal();
}

function handleProfilePictureChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      AuthManager.updateProfilePicture(e.target.result);
      UI.closeModal();
      UI.render();
    };
    reader.readAsDataURL(file);
  }
}

function deleteLoginHistory(id) {
  AuthManager.deleteLoginHistory(id);
  UI.closeModal();
  showProfile();
}

// Settings Handlers
function showSettings() {
  UI.showSettingsModal();
}

function saveSettings() {
  const selected = document.querySelector('input[name="quality"]:checked');
  if (selected) {
    FileManager.setHDQuality(selected.value);
    UI.closeModal();
    UI.render();
  }
}

// Modal Handlers
function closeModal() {
  UI.closeModal();
}
