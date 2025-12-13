// storage.js - Manajemen Storage
const StorageManager = {
  // Get item dari storage
  get(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting storage:', error);
      return null;
    }
  },

  // Set item ke storage
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting storage:', error);
      return false;
    }
  },

  // Remove item dari storage
  remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing storage:', error);
      return false;
    }
  },

  // Get all files
  getAllFiles() {
    try {
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(CONFIG.storageKeys.filePrefix)
      );
      
      return keys.map(key => this.get(key))
        .filter(file => file !== null)
        .sort((a, b) => b.id - a.id);
    } catch (error) {
      console.error('Error getting all files:', error);
      return [];
    }
  },

  // Clear all data
  clearAll() {
    sessionStorage.clear();
  }
};