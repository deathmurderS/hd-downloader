const CONFIG = {
  // Kualitas HD yang tersedia
  hdQualities: ['720p', '1080p', '1440p', '2160p (4K)'],
  
  // Kualitas default
  defaultQuality: '1080p',
  
  // Format file yang diterima
  acceptedFormats: {
    image: 'image/*',
    video: 'video/*'
  },
  
  // Ukuran maksimal file (dalam MB) - opsional
  maxFileSize: 1000,
  
  // Storage keys
  storageKeys: {
    user: 'user',
    loginHistory: 'loginHistory',
    hdQuality: 'hdQuality',
    filePrefix: 'file_'
  },
  
  // Google OAuth Config (untuk production)
  google: {
    clientId: '822370966022-btc7e57okk2ui56g7p17d3a31ropqh3c.apps.googleusercontent.com', // Ganti dengan client ID Anda
    redirectUri: window.location.origin
  },
  
  // UI Config
  ui: {
    maxLoginHistoryDisplay: 10,
    uploadTimeout: 1000,
    animationDuration: 300
  }
};