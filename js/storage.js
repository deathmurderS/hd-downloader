// storage.js - Storage Manager
const Storage = {
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting storage:', error);
      return null;
    }
  },

  /**
   * Set item to storage
   * @param {string}
   * @param {any}
   */
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting storage:', error);
      return false;
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing storage:', error);
      return false;
    }
  },

  /**
   * Get all files from storage
   * @returns {Array} Array of file objects sorted by timestamp
   */
  getAllFiles() {
    try {
      const keys = Object.keys(sessionStorage).filter(k => k.startsWith('file_'));
      return keys
        .map(k => this.get(k))
        .filter(file => file !== null)
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting all files:', error);
      return [];
    }
  },

  /**
   * Clear all storage
   */
  clearAll() {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};