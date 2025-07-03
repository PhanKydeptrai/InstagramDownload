// Instagram Ultimate Downloader - All Methods Combined
class InstagramUltimateDownloader {
  constructor() {
    this.methods = ['canvas', 'iframe', 'proxy', 'copy'];
    this.currentMethodIndex = 0;
    this.init();
  }

  init() {
    console.log('🔥 Instagram Ultimate Downloader v3.0 - All bypass methods loaded');
    this.addDownloadButtons();
    this.observeChanges();
    this.addKeyboardShortcuts();
  }

  observeChanges() {
    const observer = new MutationObserver(() => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.addDownloadButtons();
      }, 800);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  addKeyboardShortcuts() {
    // Ctrl+Shift+D = Download all visible images
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.downloadAllVisibleImages();
      }
    });
  }

  addDownloadButtons() {
    const images = document.querySelectorAll([
      'img[src*="cdninstagram"]',
      'img[src*="fbcdn"]', 
      'img[src*="instagram"]',
      'article img'
    ].join(', '));
    
    images.forEach(img => {
      if (img.dataset.ultimateDownloadAdded) return;
      if (img.width < 120 || img.height < 120 || !img.src) return;
      if (img.alt && (img.alt.includes('profile') || img.alt.includes('avatar'))) return;
      
      this.addDownloadButton(img);
      img.dataset.ultimateDownloadAdded = 'true';
    });
  }

  addDownloadButton(img) {
    const wrapper = img.closest('div') || img.parentElement;
    if (!wrapper || wrapper.querySelector('.ig-ultimate-btn')) return;

    // Tạo vùng hover phủ toàn bộ ảnh
    const hoverArea = document.createElement('div');
    hoverArea.className = 'ig-hover-area';
    hoverArea.style.cssText = `
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 1004 !important;
      background: transparent !important;
      cursor: pointer !important;
    `;

    const btn = document.createElement('button');
    btn.className = 'ig-ultimate-btn';
    btn.innerHTML = '💾';
    btn.title = 'Ultimate Download (All methods)';
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.downloadWithAllMethods(img, btn);
    });

    // Smart positioning
    wrapper.style.position = 'relative';
    btn.style.cssText = `
      position: absolute !important;
      top: 5px !important;
      right: 5px !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      border: none !important;
      background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
      color: white !important;
      font-size: 16px !important;
      cursor: pointer !important;
      z-index: 1005 !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
      opacity: 0 !important; /* Ẩn nút tải mặc định */
      pointer-events: auto !important; /* Đảm bảo nút vẫn có thể nhận sự kiện chuột */
    `;
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.background = 'linear-gradient(45deg, #ff5252, #d84315)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    });
    
    wrapper.appendChild(hoverArea);
    wrapper.appendChild(btn);
    
    // Thêm sự kiện hover cho cả ảnh và wrapper
    const showDownloadButton = () => {
      btn.style.opacity = '1';
    };
    
    const hideDownloadButton = () => {
      // Kiểm tra xem chuột có đang hover trên nút không
      if (!btn.matches(':hover')) {
        btn.style.opacity = '0';
      }
    };
    
    // Thêm sự kiện cho wrapper và vùng hover
    wrapper.addEventListener('mouseenter', showDownloadButton);
    wrapper.addEventListener('mouseleave', hideDownloadButton);
    hoverArea.addEventListener('mouseenter', showDownloadButton);
    
    // Thêm sự kiện trực tiếp cho ảnh
    img.addEventListener('mouseenter', showDownloadButton);
    
    // Đảm bảo nút vẫn hiển thị khi hover trực tiếp lên nút
    btn.addEventListener('mouseenter', showDownloadButton);
    
    // Debug để kiểm tra
    console.log('🔍 Download button added to image:', img.src.substring(0, 50) + '...');
  }

  async downloadWithAllMethods(img, btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '⏳';
    btn.disabled = true;

    try {
      console.log('🚀 Starting ultimate download for:', img.src);

      // Method 1: Canvas (Best quality)
      try {
        await this.downloadViaCanvas(img);
        btn.innerHTML = '✅';
        this.showToast('✅ Canvas download thành công!', 'success');
        return;
      } catch (e) {
        console.log('Canvas failed:', e.message);
      }

      // Method 2: Blob fetch with proper headers
      try {
        await this.downloadViaBlob(img);
        btn.innerHTML = '✅';
        this.showToast('✅ Blob download thành công!', 'success');
        return;
      } catch (e) {
        console.log('Blob failed:', e.message);
      }

      // Method 3: Proxy via data URL
      try {
        await this.downloadViaDataURL(img);
        btn.innerHTML = '✅';
        this.showToast('✅ DataURL download thành công!', 'success');
        return;
      } catch (e) {
        console.log('DataURL failed:', e.message);
      }

      // Method 4: Smart copy with auto-open
      this.smartCopyAndOpen(img);
      btn.innerHTML = '📋';
      this.showToast('📋 URL copied - Auto opening!', 'info');

    } catch (error) {
      console.error('All methods failed:', error);
      btn.innerHTML = '❌';
      this.showToast('❌ Tất cả phương pháp đều thất bại', 'error');
    } finally {
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }, 3000);
    }
  }

  downloadViaCanvas(img) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const newImg = new Image();
      
      newImg.crossOrigin = 'anonymous';
      newImg.onload = function() {
        try {
          canvas.width = this.naturalWidth || this.width;
          canvas.height = this.naturalHeight || this.height;
          
          ctx.drawImage(this, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `instagram_${Date.now()}.jpg`;
              a.click();
              URL.revokeObjectURL(url);
              resolve();
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/jpeg', 0.95);
        } catch (err) {
          reject(err);
        }
      };
      
      newImg.onerror = () => reject(new Error('Image load failed'));
      newImg.src = img.src;
    });
  }

  async downloadViaBlob(img) {
    const response = await fetch(img.src, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Accept': 'image/*',
        'User-Agent': navigator.userAgent
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_blob_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadViaDataURL(img) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      try {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
        
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `instagram_data_${Date.now()}.jpg`;
        a.click();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  smartCopyAndOpen(img) {
    // Copy to clipboard
    navigator.clipboard.writeText(img.src).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = img.src;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });

    // Auto open in new tab
    setTimeout(() => {
      window.open(img.src, '_blank', 'noopener,noreferrer');
    }, 500);
  }

  downloadAllVisibleImages() {
    const buttons = document.querySelectorAll('.ig-ultimate-btn');
    let delay = 0;
    
    buttons.forEach((btn, index) => {
      setTimeout(() => {
        if (!btn.disabled) {
          btn.click();
        }
      }, delay);
      delay += 1000; // 1 second between downloads
    });
    
    this.showToast(`🚀 Downloading ${buttons.length} images...`, 'info');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      padding: 12px 20px !important;
      border-radius: 8px !important;
      color: white !important;
      font-weight: 600 !important;
      z-index: 10000 !important;
      max-width: 300px !important;
      animation: slideInFromRight 0.3s ease-out !important;
    `;
    
    const colors = {
      success: '#28a745',
      error: '#dc3545', 
      info: '#17a2b8'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}

// Initialize Ultimate Downloader
new InstagramUltimateDownloader();
