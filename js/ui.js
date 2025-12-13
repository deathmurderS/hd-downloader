// ui.js - Manajemen UI
const UI = {
  app: null,

  init() {
    this.app = document.getElementById('app');
    this.render();
  },

  render() {
    const user = AuthManager.getCurrentUser();
    
    if (!user) {
      this.renderLoginPage();
    } else {
      this.renderMainApp();
    }
  },

  // Login Page
  renderLoginPage() {
    this.app.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <div class="login-icon">
            <i data-lucide="download"></i>
          </div>
          <h1 class="login-title">HD Downloader</h1>
          <p class="login-subtitle">Upload & download file dengan kualitas HD terbaik</p>
          
          <button class="google-btn" onclick="handleGoogleSignIn()">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in dengan Google</span>
          </button>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  // Main App
  renderMainApp() {
    const user = AuthManager.getCurrentUser();
    const files = FileManager.getAllFiles();
    const quality = FileManager.getHDQuality();

    this.app.innerHTML = `
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-icon">
              <i data-lucide="download"></i>
            </div>
            <h1 class="logo-text">HD Downloader</h1>
          </div>
          <div class="header-right">
            <button class="icon-btn" onclick="showSettings()" title="Pengaturan">
              <i data-lucide="settings"></i>
            </button>
            <button class="profile-btn" onclick="showProfile()">
              <img src="${user.picture}" alt="Profile" class="profile-img">
              <div class="profile-info">
                <p class="profile-name">${user.name}</p>
                <p class="profile-email">${user.email}</p>
              </div>
            </button>
            <button class="icon-btn logout-btn" onclick="handleSignOut()" title="Sign Out">
              <i data-lucide="log-out"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Upload Section -->
        <div class="card">
          <h2 class="card-title">Upload File (${quality})</h2>
          <div class="upload-area">
            <input type="file" id="fileInput" multiple accept="image/*,video/*" style="display:none" onchange="handleFileUpload(event)">
            <label for="fileInput" class="upload-label">
              <div class="upload-icon">
                <i data-lucide="download"></i>
              </div>
              <p class="upload-text">Klik untuk upload file</p>
              <p class="upload-subtext">Gambar atau Video • Kualitas ${quality}</p>
            </label>
          </div>
          <div id="uploadStatus"></div>
        </div>

        <!-- Files Grid -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              <i data-lucide="folder-open"></i>
              File Anda (${files.length})
            </h2>
          </div>
          
          <div id="filesGrid" class="files-grid">
            ${files.length === 0 ? `
              <div class="empty-state">
                <i data-lucide="user"></i>
                <p>Belum ada file yang diupload</p>
              </div>
            ` : files.map(file => `
              <div class="file-card">
                <div class="file-preview">
                  ${file.type === 'image' 
                    ? `<img src="${file.url}" alt="${file.name}" class="file-media">`
                    : `<video src="${file.url}" class="file-media" controls></video>`
                  }
                  <div class="file-type-badge">
                    <i data-lucide="${file.type === 'image' ? 'image' : 'video'}"></i>
                  </div>
                  <div class="file-quality-badge">${file.quality}</div>
                </div>
                <div class="file-info">
                  <p class="file-name" title="${file.name}">${file.name}</p>
                  <p class="file-meta">${file.size} • ${file.uploadedAt}</p>
                  <div class="file-actions">
                    <button class="btn btn-primary" onclick="downloadFile(${file.id})">
                      <i data-lucide="download"></i>
                      Download
                    </button>
                    <button class="btn btn-secondary" onclick="editFile(${file.id})">
                      <i data-lucide="edit-3"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Modals will be injected here -->
      <div id="modalContainer"></div>
    `;
    lucide.createIcons();
  },

  // Show Profile Modal
  showProfileModal() {
    const user = AuthManager.getCurrentUser();
    const history = AuthManager.getLoginHistory();

    const modal = `
      <div class="modal-overlay" onclick="closeModal()">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>Profil Saya</h2>
            <button class="icon-btn" onclick="closeModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="profile-section">
              <div class="profile-picture-wrapper">
                <img src="${user.picture}" alt="Profile" class="profile-picture">
                <label class="profile-picture-edit">
                  <i data-lucide="camera"></i>
                  <input type="file" accept="image/*" onchange="handleProfilePictureChange(event)" style="display:none">
                </label>
              </div>
              <h3 class="profile-modal-name">${user.name}</h3>
              <p class="profile-modal-email">${user.email}</p>
            </div>

            <div class="login-history-section">
              <h3 class="section-title">
                <i data-lucide="clock"></i>
                Riwayat Login
              </h3>
              <div class="login-history-list">
                ${history.length === 0 ? `
                  <p class="empty-text">Belum ada riwayat login</p>
                ` : history.slice().reverse().map(log => `
                  <div class="login-history-item">
                    <div class="login-history-info">
                      <div class="login-history-day">
                        <i data-lucide="calendar"></i>
                        <span>${log.day}</span>
                      </div>
                      <p class="login-history-date">${log.date}</p>
                      <div class="login-history-time">
                        <i data-lucide="clock"></i>
                        <span>${log.time}</span>
                      </div>
                    </div>
                    <button class="icon-btn delete-btn" onclick="deleteLoginHistory(${log.id})">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modalContainer').innerHTML = modal;
    lucide.createIcons();
  },

  // Show Settings Modal
  showSettingsModal() {
    const currentQuality = FileManager.getHDQuality();

    const modal = `
      <div class="modal-overlay" onclick="closeModal()">
        <div class="modal modal-small" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>Pengaturan</h2>
            <button class="icon-btn" onclick="closeModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <label class="settings-label">Kualitas HD</label>
              <div class="quality-options">
                ${CONFIG.hdQualities.map(quality => `
                  <label class="quality-option">
                    <input type="radio" name="quality" value="${quality}" 
                      ${currentQuality === quality ? 'checked' : ''}>
                    <span>${quality}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <button class="btn btn-primary btn-full" onclick="saveSettings()">
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modalContainer').innerHTML = modal;
    lucide.createIcons();
  },

  // Show Edit File Modal
  showEditFileModal(fileId) {
    const file = FileManager.getFile(fileId);
    if (!file) return;

    const modal = `
      <div class="modal-overlay" onclick="closeModal()">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit File</h2>
            <button class="icon-btn" onclick="closeModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="edit-preview">
              ${file.type === 'image' 
                ? `<img src="${file.url}" alt="${file.name}" class="edit-media">`
                : `<video src="${file.url}" class="edit-media" controls></video>`
              }
            </div>

            <div class="edit-form">
              <div class="form-group">
                <label class="form-label">Nama File</label>
                <input type="text" id="editFileName" class="form-input" value="${file.name}">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label-small">Ukuran</label>
                  <p class="form-text">${file.size}</p>
                </div>
                <div class="form-group">
                  <label class="form-label-small">Kualitas</label>
                  <p class="form-text">${file.quality}</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label-small">Diupload</label>
                <p class="form-text">${file.uploadedAt}</p>
              </div>

              <div class="edit-actions">
                <button class="btn btn-primary flex-1" onclick="saveFileEdit(${file.id})">
                  Simpan Perubahan
                </button>
                <button class="btn btn-danger" onclick="deleteFileConfirm(${file.id})">
                  Hapus File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modalContainer').innerHTML = modal;
    lucide.createIcons();
  },

  closeModal() {
    document.getElementById('modalContainer').innerHTML = '';
  },

  showUploadStatus(message, type = 'info') {
    const status = document.getElementById('uploadStatus');
    if (status) {
      status.innerHTML = `<div class="upload-status upload-status-${type}">${message}</div>`;
      
      if (type === 'success') {
        setTimeout(() => {
          status.innerHTML = '';
        }, 3000);
      }
    }
  }
};