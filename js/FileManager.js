// fileManager.js - Manajemen File
const FileManager = {
  // Upload file
  uploadFile(file, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const fileId = Date.now() + Math.random();
        const newFile = {
          id: fileId,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          sizeBytes: file.size,
          url: event.target.result,
          uploadedAt: new Date().toLocaleString('id-ID'),
          quality: quality || CONFIG.defaultQuality
        };

        // Simpan file secara TERPISAH
        const key = `${CONFIG.storageKeys.filePrefix}${fileId}`;
        if (StorageManager.set(key, newFile)) {
          resolve(newFile);
        } else {
          reject(new Error('Failed to save file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },

  // Get all files
  getAllFiles() {
    return StorageManager.getAllFiles();
  },

  // Get single file
  getFile(id) {
    const key = `${CONFIG.storageKeys.filePrefix}${id}`;
    return StorageManager.get(key);
  },

  // Update file
  updateFile(id, updates) {
    const key = `${CONFIG.storageKeys.filePrefix}${id}`;
    const file = this.getFile(id);
    
    if (file) {
      const updatedFile = { ...file, ...updates };
      return StorageManager.set(key, updatedFile) ? updatedFile : null;
    }
    return null;
  },

  // Delete file
  deleteFile(id) {
    const key = `${CONFIG.storageKeys.filePrefix}${id}`;
    return StorageManager.remove(key);
  },

  // Download file
  downloadFile(file) {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Get/Set HD Quality
  getHDQuality() {
    return StorageManager.get(CONFIG.storageKeys.hdQuality) || CONFIG.defaultQuality;
  },

  setHDQuality(quality) {
    return StorageManager.set(CONFIG.storageKeys.hdQuality, quality);
  }
};