// auth.js - Manajemen Autentikasi
const AuthManager = {
  currentUser: null,

  // Login dengan Google (simulasi)
  signInWithGoogle() {
    const now = new Date();
    
    // Mock user - untuk production gunakan Google OAuth
    const user = {
      name: 'User Demo',
      email: 'user@gmail.com',
      picture: 'https://ui-avatars.com/api/?name=User+Demo&background=6366f1&color=fff'
    };

    // Simpan user
    StorageManager.set(CONFIG.storageKeys.user, user);
    this.currentUser = user;

    // Catat login history
    this.addLoginHistory();

    return user;
  },

  // Sign out
  signOut() {
    this.currentUser = null;
    StorageManager.remove(CONFIG.storageKeys.user);
    return true;
  },

  // Get current user
  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = StorageManager.get(CONFIG.storageKeys.user);
    }
    return this.currentUser;
  },

  // Add login history
  addLoginHistory() {
    const now = new Date();
    const loginRecord = {
      id: Date.now(),
      date: now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('id-ID'),
      day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
      fullDate: now.toLocaleDateString('id-ID'),
      year: now.getFullYear(),
      month: now.toLocaleDateString('id-ID', { month: 'long' })
    };

    const history = StorageManager.get(CONFIG.storageKeys.loginHistory) || [];
    history.push(loginRecord);
    StorageManager.set(CONFIG.storageKeys.loginHistory, history);
  },

  // Get login history
  getLoginHistory() {
    return StorageManager.get(CONFIG.storageKeys.loginHistory) || [];
  },

  // Delete login history item
  deleteLoginHistory(id) {
    const history = this.getLoginHistory();
    const filtered = history.filter(h => h.id !== id);
    StorageManager.set(CONFIG.storageKeys.loginHistory, filtered);
    return filtered;
  },

  // Update profile picture
  updateProfilePicture(pictureData) {
    if (this.currentUser) {
      this.currentUser.picture = pictureData;
      StorageManager.set(CONFIG.storageKeys.user, this.currentUser);
      return true;
    }
    return false;
  }
};