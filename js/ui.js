// ui.js - UI Manager
const UI = {
  /**
   * Initialize UI
   */
  init() {
    this.renderFiles();
    this.setupEventListeners();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close modal on outside click
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
          this.closeSettings();
        }
      });
    }
  },

  /**
   * Render all files
   */
  renderFiles() {
    const files = FileManager.getAllFiles();
    const grid = document.getElementById('filesGrid');
    const fileCount = document.getElementById('fileCount');
    
    if (!grid || !fileCount) return;

    fileCount.textContent = files.length;

    if (files.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">📭</div>
          <div>Belum ada file yang diupload</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = files.map(file => `
      <div class="file-card">
        <div class="file-preview">
          ${file.type === 'image' 
            ? `<img src="${file.url}" alt="${file.name}">`
            : `<video src="${file.url}" controls></video>`
          }
          <div class="file-badge">${file.quality}</div>
        </div>
        <div class="file-info">
          <div class="file-name" title="${file.name}">${file.name}</div>
          <div class="file-meta">
            📅 ${file.uploadDate}<br>
            🕐 ${file.uploadTime}<br>
            💾 ${file.size}
            ${file.bgRemoved ? '<br>✨ Background Removed' : ''}
          </div>
          <div class="file-actions">
            <button class="btn btn-primary" onclick="downloadFile(${file.id})">⬇️ Download</button>
            <button class="btn btn-danger" onclick="deleteFile(${file.id})">🗑️</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Show processing overlay
   */
  showProcessing() {
    const processing = document.getElementById('processing');
    if (processing) {
      processing.classList.add('active');
    }
  },

  /**
   * Hide processing overlay
   */
  hideProcessing() {
    const processing = document.getElementById('processing');
    if (processing) {
      processing.classList.remove('active');
    }
  },

  /**
   * Open settings modal
   */
  openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.classList.add('active');
    }
  },

  /**
   * Close settings modal
   */
  closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);