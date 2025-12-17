// fileManager.js - File Manager
const FileManager = {
  /**
   * Process and upload file
   * @param {File} file - File to upload
   * @returns {Promise} Promise that resolves with file data
   */
  async processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const now = new Date();
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          url: e.target.result,
          timestamp: Date.now(),
          uploadDate: now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          uploadTime: now.toLocaleTimeString('id-ID'),
          quality: 'HD 1080p'
        };

        // Simulate background removal for images
        if (fileData.type === 'image') {
          // Wait 1 second to simulate processing
          await new Promise(r => setTimeout(r, 5000));
          fileData.bgRemoved = true;
          
          // NOTE: For real background removal, integrate with API like remove.bg
          // See documentation in fileManager.js for implementation details
        }

        // Save file to storage
        Storage.set(`file_${fileData.id}`, fileData);
        resolve(fileData);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Get all files
   * @returns {Array} Array of file objects
   */
  getAllFiles() {
    return Storage.getAllFiles();
  },

  /**
   * Get single file by ID
   * @param {number} id - File ID
   * @returns {Object|null} File object or null
   */
  getFile(id) {
    return Storage.get(`file_${id}`);
  },

  /**
   * Delete file by ID
   * @param {number} id - File ID
   * @returns {boolean} Success status
   */
  deleteFile(id) {
    return Storage.remove(`file_${id}`);
  },

  /**
   * Download file
   * @param {number} id - File ID
   */
  downloadFile(id) {
    const file = this.getFile(id);
    if (!file) {
      console.error('File not found');
      return;
    }

    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
if (fileData.type === 'image') {
    try {
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');
      
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        response: 'never gonna tell you',
        method: 'POST',
        headers: {
          'X-Api-Key': 'aDDrnL64Cg8zVmZcNwLgDnqe'
        },
        body: formData
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        fileData.url = url;
        fileData.bgRemoved = true;
      }
    } catch (error) {
      console.error('Background removal failed:', error);
      // Keep original image if API fails
    }
   }