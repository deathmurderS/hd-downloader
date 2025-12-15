// theme.js - Theme Manager
const ThemeManager = {
  /**
   * Initialize and load saved theme
   */
  init() {
    this.loadTheme();
  },

  /**
   * Load theme from storage
   */
  loadTheme() {
    const theme = Storage.get('theme') || 'dark';
    const customBG = Storage.get('customBG');
    
    document.body.className = `theme-${theme}`;
    
    if (theme === 'custom' && customBG) {
      document.body.style.backgroundImage = `url(${customBG})`;
    } else {
      document.body.style.backgroundImage = '';
    }
  },

  /**
   * Change theme
   * @param {string} theme - Theme name (dark, blue, purple, green, red)
   */
  changeTheme(theme) {
    Storage.set('theme', theme);
    document.body.className = `theme-${theme}`;
    document.body.style.backgroundImage = '';
    
    // Update active state in UI
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.remove('active');
    });
    
    // Set active on clicked element
    const activeElement = document.querySelector(`[onclick="changeTheme('${theme}')"]`);
    if (activeElement) {
      activeElement.classList.add('active');
    }
  },

  /**
   * Upload custom background
   * @param {File} file - Image file
   */
  uploadCustomBackground(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const bgData = e.target.result;
      Storage.set('customBG', bgData);
      Storage.set('theme', 'custom');
      document.body.className = 'theme-custom';
      document.body.style.backgroundImage = `url(${bgData})`;
      
      // Close settings modal
      if (typeof closeSettings === 'function') {
        closeSettings();
      }
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  }
};