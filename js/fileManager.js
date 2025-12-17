// fileManager.js
async function processFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const now = new Date();
      const quality = Storage.get('quality') || '1080p';
      
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        url: e.target.result,
        timestamp: Date.now(),
        uploadDate: now.toLocaleDateString('id-ID', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        }),
        uploadTime: now.toLocaleTimeString('id-ID'),
        quality: quality
      };
      
      // Remove background untuk image
      if (fileData.type === 'image') {
        try {
          // Kirim ke BACKEND kamu (bukan langsung ke remove.bg!)
          const response = await fetch('/api/remove-bg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: e.target.result.split(',')[1] // base64
            })
          });

          if (response.ok) {
            const blob = await response.blob();
            fileData.url = URL.createObjectURL(blob);
            fileData.bgRemoved = true;
          } else {
            console.error('Background removal failed');
            // Tetap pakai gambar original
          }
        } catch (error) {
          console.error('Error:', error);
          // Tetap pakai gambar original
        }
      }
      
      Storage.set(`file_${fileData.id}`, fileData);
      resolve();
    };
    reader.readAsDataURL(file);
  });
}