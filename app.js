// app.js - Main Application Logic

/**
 * Initialize application
 */
function init() {
  ThemeManager.init();
  UI.init();
}

/**
 * Handle file upload
 * @param {Event} event - File input change event
 */
async function handleUpload(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  // Show processing overlay
  UI.showProcessing();

  try {
    // Process all files
    const promises = files.map(file => FileManager.processFile(file));
    await Promise.all(promises);

    // Hide processing and show success
    setTimeout(() => {
      UI.hideProcessing();
      UI.renderFiles();
      UI.showNotification(`${files.length} file berhasil diupload!`, 'success');
    }, 1500);

  } catch (error) {
    console.error('Upload error:', error);
    UI.hideProcessing();
    UI.showNotification('Upload gagal. Silakan coba lagi.', 'error');
  }

  // Reset input
  event.target.value = '';
}

/**
 * Download file
 * @param {number} id - File ID
 */
function downloadFile(id) {
  FileManager.downloadFile(id);
  UI.showNotification('File downloaded!', 'success');
}

/**
 * Delete file
 * @param {number} id - File ID
 */
function deleteFile(id) {
  if (confirm('Yakin ingin menghapus file ini?')) {
    const success = FileManager.deleteFile(id);
    if (success) {
      UI.renderFiles();
      UI.showNotification('File berhasil dihapus', 'success');
    } else {
      UI.showNotification('Gagal menghapus file', 'error');
    }
  }
}

/**
 * Open settings modal
 */
function openSettings() {
  UI.openSettings();
}

/**
 * Close settings modal
 */
function closeSettings() {
  UI.closeSettings();
}

/**
 * Change theme
 * @param {string} theme - Theme name
 */
function changeTheme(theme) {
  ThemeManager.changeTheme(theme);
  UI.showNotification('Tema berhasil diubah!', 'success');
}

/**
 * Upload custom background
 * @param {Event} event - File input change event
 */
function uploadCustomBG(event) {
  const file = event.target.files[0];
  if (file) {
    ThemeManager.uploadCustomBackground(file);
    UI.showNotification('Background berhasil diubah!', 'success');
  }
  event.target.value = '';
}

/**
 * Clear all data (for testing)
 */
function clearAllData() {
  if (confirm('Yakin ingin menghapus semua data?')) {
    Storage.clearAll();
    ThemeManager.init();
    UI.renderFiles();
    UI.showNotification('Semua data berhasil dihapus', 'success');
  }
}

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', init);

// Export functions to global scope for onclick handlers
window.handleUpload = handleUpload;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.changeTheme = changeTheme;
window.uploadCustomBG = uploadCustomBG;
window.clearAllData = clearAllData;