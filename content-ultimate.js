// Instagram Ultimate Downloader - All Methods Combined
class InstagramUltimateDownloader {
  constructor() {
    this.methods = ['canvas', 'iframe', 'proxy', 'copy'];
    this.videoMethods = ['mediarecorder', 'canvas', 'intercept', 'copy'];
    this.currentMethodIndex = 0;
    this.videoTypes = ['post', 'reel', 'story', 'igtv'];

    // Performance optimization properties
    this.processedElements = new WeakSet();
    this.blobUrls = new Set();
    this.intersectionObserver = null;

    this.init();
  }

  init() {
    console.log('🔥 Instagram Ultimate Downloader v3.0 - All bypass methods loaded');
    this.addDownloadButtons();
    this.observeChanges();
    this.addKeyboardShortcuts();
    this.setupCleanupHandlers();
  }

  setupCleanupHandlers() {
    // Clean up resources when page is unloaded
    window.addEventListener('beforeunload', () => {
      this.cleanupAllBlobUrls();
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
    });

    // Periodic cleanup every 5 minutes
    setInterval(() => {
      const memUsage = this.getMemoryUsage();
      console.log('🧠 Memory usage:', memUsage);

      // Clean up if we have too many blob URLs
      if (this.blobUrls.size > 50) {
        console.log('🧹 Too many blob URLs, cleaning up old ones');
        this.cleanupAllBlobUrls();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  observeChanges() {
    // Debounced mutation observer for DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.addDownloadButtons();
      }, 1000); // Increased to 1000ms for better performance with videos
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Intersection observer for viewport-based video processing
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const options = {
      root: null,
      rootMargin: '200px', // Process videos 200px before they enter viewport
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const videoElement = entry.target;
          if (videoElement.tagName === 'VIDEO' && !this.processedElements.has(videoElement)) {
            this.processVideoElement(videoElement);
          }
        }
      });
    }, options);
  }

  processVideoElement(videoElement) {
    if (this.processedElements.has(videoElement)) return;

    this.processedElements.add(videoElement);

    if (!this.isValidVideo(videoElement)) return;

    const videoType = this.classifyVideoType(videoElement);
    this.addDownloadButton(videoElement, 'video', videoType);
    videoElement.dataset.ultimateVideoDownloadAdded = 'true';
  }

  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+D = Download all visible images
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.downloadAllVisibleImages();
      }

      // Ctrl+Shift+V = Download all visible videos
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        this.downloadAllVisibleVideos();
      }
    });
  }

  addDownloadButtons() {
    // Process images
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
      
      this.addDownloadButton(img, 'image');
      img.dataset.ultimateDownloadAdded = 'true';
    });

    // Process videos
    this.detectAndProcessVideos();
  }

  detectAndProcessVideos() {
    const videos = this.detectVideos();
    videos.forEach(videoObj => {
      if (videoObj.element.dataset.ultimateVideoDownloadAdded) return;
      if (!this.isValidVideo(videoObj.element)) return;

      // Use intersection observer for performance if available
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(videoObj.element);
      } else {
        // Fallback to immediate processing
        this.processVideoElement(videoObj.element);
      }
    });
  }

  detectVideos() {
    const videoSelectors = [
      // Regular posts
      'article video',
      'div[role="button"] video',
      // Reels
      'section video',
      'div[data-testid*="reel"] video',
      // Stories
      'section[role="dialog"] video',
      'div[data-testid*="story"] video',
      // IGTV
      'article[data-testid*="igtv"] video',
      // General video elements
      'video[src*="cdninstagram"]',
      'video[src*="fbcdn"]',
      'video[src*="blob:"]'
    ];

    const videoElements = document.querySelectorAll(videoSelectors.join(', '));
    const videoObjects = [];

    videoElements.forEach(video => {
      // Skip if already processed
      if (video.dataset.videoProcessed) return;
      
      const videoType = this.classifyVideoType(video);
      videoObjects.push({
        element: video,
        type: videoType
      });
      
      // Mark as processed to avoid duplicate processing
      video.dataset.videoProcessed = 'true';
    });

    console.log(`🎬 Detected ${videoObjects.length} new videos`);
    return videoObjects;
  }

  classifyVideoType(videoElement) {
    // Check for Reels
    if (videoElement.closest('section') &&
        (videoElement.closest('[data-testid*="reel"]') ||
         window.location.pathname.includes('/reel'))) {
      return 'reel';
    }

    // Check for Stories
    if (videoElement.closest('section[role="dialog"]') ||
        videoElement.closest('[data-testid*="story"]') ||
        window.location.pathname.includes('/stories/')) {
      return 'story';
    }

    // Check for IGTV
    if (videoElement.closest('[data-testid*="igtv"]') ||
        window.location.pathname.includes('/tv/')) {
      return 'igtv';
    }

    // Default to post
    return 'post';
  }

  extractVideoSource(videoElement, videoType) {
    const sources = [];

    // Primary source from video element
    if (videoElement.src) {
      sources.push({
        url: videoElement.src,
        quality: this.estimateQuality(videoElement),
        format: this.getVideoFormat(videoElement.src),
        source: 'video.src'
      });
    }

    // Alternative source from currentSrc
    if (videoElement.currentSrc && videoElement.currentSrc !== videoElement.src) {
      sources.push({
        url: videoElement.currentSrc,
        quality: this.estimateQuality(videoElement),
        format: this.getVideoFormat(videoElement.currentSrc),
        source: 'video.currentSrc'
      });
    }

    // Sources from source elements
    const sourceElements = videoElement.querySelectorAll('source');
    sourceElements.forEach((source, index) => {
      if (source.src) {
        sources.push({
          url: source.src,
          quality: this.estimateQualityFromSource(source),
          format: this.getVideoFormat(source.src),
          source: `source[${index}]`
        });
      }
    });

    console.log(`🎬 Found ${sources.length} video sources for ${videoType}:`, sources);
    return sources;
  }

  getHighestQuality(videoSources) {
    if (!videoSources || videoSources.length === 0) {
      return null;
    }

    // Sort by quality (higher is better), prefer non-blob URLs, and prefer MP4 format
    const sortedSources = videoSources.sort((a, b) => {
      // Prefer non-blob URLs
      const aIsBlob = a.url.startsWith('blob:');
      const bIsBlob = b.url.startsWith('blob:');

      if (aIsBlob && !bIsBlob) return 1;
      if (!aIsBlob && bIsBlob) return -1;

      // Then sort by quality
      if (b.quality !== a.quality) {
        return b.quality - a.quality;
      }

      // If same quality, prefer MP4 format
      const aFormat = this.getVideoFormat(a.url);
      const bFormat = this.getVideoFormat(b.url);

      if (aFormat === 'mp4' && bFormat !== 'mp4') return -1;
      if (aFormat !== 'mp4' && bFormat === 'mp4') return 1;

      return 0;
    });

    return sortedSources[0];
  }

  estimateQuality(videoElement) {
    // Estimate quality based on video dimensions
    const width = videoElement.videoWidth || videoElement.clientWidth || 0;
    const height = videoElement.videoHeight || videoElement.clientHeight || 0;

    if (width >= 1920 || height >= 1080) return 1080;
    if (width >= 1280 || height >= 720) return 720;
    if (width >= 854 || height >= 480) return 480;
    if (width >= 640 || height >= 360) return 360;
    return 240; // default low quality
  }

  estimateQualityFromSource(sourceElement) {
    // Try to extract quality from source attributes or URL
    const media = sourceElement.getAttribute('media');
    const src = sourceElement.src;

    if (media && media.includes('1080')) return 1080;
    if (media && media.includes('720')) return 720;
    if (media && media.includes('480')) return 480;

    if (src.includes('1080')) return 1080;
    if (src.includes('720')) return 720;
    if (src.includes('480')) return 480;

    return 360; // default
  }

  getVideoFormat(url) {
    if (url.includes('.webm')) return 'webm';
    if (url.includes('.mov')) return 'mov';
    if (url.includes('.avi')) return 'avi';
    if (url.includes('.mkv')) return 'mkv';
    return 'mp4'; // default
  }

  isValidVideo(videoElement) {
    // Check if video has source (blob URLs are valid for Instagram videos)
    if (!videoElement.src && !videoElement.querySelector('source')) {
      return false;
    }

    // For videos that haven't loaded metadata yet, we'll be more lenient
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      // Check if video element has reasonable display size
      const rect = videoElement.getBoundingClientRect();
      if (rect.width < 200 || rect.height < 200) {
        return false;
      }
    } else {
      // Check minimum video dimensions for loaded videos
      if (videoElement.videoWidth < 200 || videoElement.videoHeight < 200) {
        return false;
      }
    }

    // Skip very small videos (likely thumbnails or icons)
    const computedStyle = window.getComputedStyle(videoElement);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      return false;
    }

    return true;
  }

  addDownloadButton(element, type = 'image', videoType = null) {
    const wrapper = element.closest('div') || element.parentElement;
    if (!wrapper || wrapper.querySelector('.ig-ultimate-btn')) return;

    // Tạo vùng hover phủ toàn bộ element
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
    
    // Different icons and colors for different types
    if (type === 'video') {
      btn.innerHTML = '🎬';
      btn.title = `Ultimate Video Download (${videoType})`;
      btn.dataset.mediaType = 'video';
      btn.dataset.videoType = videoType;
    } else {
      btn.innerHTML = '💾';
      btn.title = 'Ultimate Download (All methods)';
      btn.dataset.mediaType = 'image';
    }
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (type === 'video') {
        this.downloadVideoWithAllMethods(element, btn, videoType);
      } else {
        this.downloadWithAllMethods(element, btn);
      }
    });

    // Smart positioning
    wrapper.style.position = 'relative';
    
    // Different styling for video vs image buttons
    const baseStyle = `
      position: absolute !important;
      top: 5px !important;
      right: 5px !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      border: none !important;
      color: white !important;
      font-size: 16px !important;
      cursor: pointer !important;
      z-index: 1005 !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
      opacity: 0 !important;
      pointer-events: auto !important;
    `;
    
    if (type === 'video') {
      btn.style.cssText = baseStyle + `
        background: linear-gradient(45deg, #8e44ad, #3498db) !important;
      `;
    } else {
      btn.style.cssText = baseStyle + `
        background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
      `;
    }
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      if (type === 'video') {
        btn.style.background = 'linear-gradient(45deg, #9b59b6, #2980b9) !important';
      } else {
        btn.style.background = 'linear-gradient(45deg, #ff5252, #d84315) !important';
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      if (type === 'video') {
        btn.style.background = 'linear-gradient(45deg, #8e44ad, #3498db) !important';
      } else {
        btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24) !important';
      }
    });
    
    wrapper.appendChild(hoverArea);
    wrapper.appendChild(btn);
    
    // Thêm sự kiện hover cho cả element và wrapper
    const showDownloadButton = () => {
      btn.style.opacity = '1';
    };
    
    const hideDownloadButton = () => {
      if (!btn.matches(':hover')) {
        btn.style.opacity = '0';
      }
    };
    
    wrapper.addEventListener('mouseenter', showDownloadButton);
    wrapper.addEventListener('mouseleave', hideDownloadButton);
    hoverArea.addEventListener('mouseenter', showDownloadButton);
    element.addEventListener('mouseenter', showDownloadButton);
    btn.addEventListener('mouseenter', showDownloadButton);
    
    // Debug log
    if (type === 'video') {
      console.log(`🎬 Video download button added (${videoType}):`, element.src?.substring(0, 50) + '...' || 'No src');
    } else {
      console.log('🔍 Download button added to image:', element.src.substring(0, 50) + '...');
    }
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

  async downloadVideoViaBlob(videoElement, videoType) {
    // Extract all available video sources
    const videoSources = this.extractVideoSource(videoElement, videoType);

    if (!videoSources || videoSources.length === 0) {
      throw new Error('No video sources found');
    }

    // Get the highest quality non-blob source
    const bestSource = this.getHighestQuality(videoSources.filter(s => !s.url.startsWith('blob:')));

    if (!bestSource) {
      throw new Error('No downloadable video sources found (only blob URLs available)');
    }

    const videoUrl = bestSource.url;
    console.log(`🎬 Using best quality source (${bestSource.quality}p):`, videoUrl.substring(0, 50) + '...');

    const response = await fetch(videoUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Accept': 'video/*,*/*',
        'User-Agent': navigator.userAgent,
        'Referer': window.location.href
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Determine file extension based on content type
    const contentType = response.headers.get('content-type') || blob.type;
    let extension = 'mp4'; // default
    if (contentType.includes('webm')) extension = 'webm';
    else if (contentType.includes('mov')) extension = 'mov';
    else if (contentType.includes('avi')) extension = 'avi';

    const url = URL.createObjectURL(blob);
    this.trackBlobUrl(url);

    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram_${videoType}_${Date.now()}.${extension}`;
    a.click();

    // Clean up blob URL after a short delay
    this.scheduleCleanup(url, 1000);
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

  categorizeVideoError(error, method) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('cors') || errorMessage.includes('cross-origin')) {
      return {
        type: 'CORS',
        message: 'CORS policy blocked the download',
        userMessage: '🚫 CORS blocked - trying alternative method...',
        retryable: false
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'NETWORK',
        message: 'Network error during download',
        userMessage: '🌐 Network error - retrying...',
        retryable: true
      };
    }

    if (errorMessage.includes('blob') || errorMessage.includes('url')) {
      return {
        type: 'BLOB_URL',
        message: 'Cannot download blob URLs directly',
        userMessage: '🎬 Using video capture method...',
        retryable: false
      };
    }

    if (errorMessage.includes('mediarecorder') || errorMessage.includes('not supported')) {
      return {
        type: 'UNSUPPORTED',
        message: 'Browser does not support this method',
        userMessage: '⚠️ Method not supported - trying fallback...',
        retryable: false
      };
    }

    if (errorMessage.includes('403') || errorMessage.includes('401')) {
      return {
        type: 'PERMISSION',
        message: 'Access denied by server',
        userMessage: '🔒 Access denied - trying alternative...',
        retryable: false
      };
    }

    return {
      type: 'UNKNOWN',
      message: error.message,
      userMessage: `❓ ${method} failed - trying next method...`,
      retryable: true
    };
  }

  async downloadVideoWithAllMethods(videoElement, btn, videoType) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '⏳';
    btn.disabled = true;

    const methods = [
      { name: 'Video Blob Fetch', func: this.downloadVideoViaBlob, primary: true },
      { name: 'MediaRecorder', func: this.downloadViaMediaRecorder, primary: true },
      { name: 'Canvas Capture', func: this.downloadViaCanvasCapture, primary: false }
    ];

    try {
      console.log(`🎬 Starting video download for ${videoType}:`, videoElement.src);

      for (const method of methods) {
        try {
          await method.func.call(this, videoElement, videoType);
          btn.innerHTML = '✅';
          this.showToast(`✅ ${method.name} thành công!`, 'success');
          return;
        } catch (e) {
          const errorInfo = this.categorizeVideoError(e, method.name);
          console.log(`${method.name} failed:`, errorInfo.message);

          // Show user-friendly error message for primary methods
          if (method.primary) {
            this.showToast(errorInfo.userMessage, 'warning');
          }
        }
      }

      // Final fallback: Smart copy with auto-open
      this.smartCopyVideoURL(videoElement);
      btn.innerHTML = '📋';
      this.showToast('📋 Video URL copied - Auto opening!', 'info');

    } catch (error) {
      console.error('All video methods failed:', error);
      btn.innerHTML = '❌';
      this.showToast('❌ All video download methods failed', 'error');
    } finally {
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }, 3000);
    }
  }

  async downloadViaMediaRecorder(videoElement, videoType) {
    return new Promise((resolve, reject) => {
      // Try MP4 first, fallback to WebM
      let mimeType = 'video/mp4';
      let extension = 'mp4';

      if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
        mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        extension = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        extension = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9,opus"')) {
        mimeType = 'video/webm; codecs="vp9,opus"';
        extension = 'webm';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
        extension = 'webm';
      } else {
        reject(new Error('MediaRecorder not supported for any video format'));
        return;
      }

      const stream = videoElement.captureStream();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        this.trackBlobUrl(url);

        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram_${videoType}_${Date.now()}.${extension}`;
        a.click();

        this.scheduleCleanup(url, 1000);
        resolve();
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error: ' + event.error));
      };

      // Record for the duration of the video or 30 seconds max
      const duration = Math.min(videoElement.duration * 1000, 30000) || 10000;
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, duration);
    });
  }

  async downloadViaCanvasCapture(videoElement, videoType) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = videoElement.videoWidth || videoElement.clientWidth;
        canvas.height = videoElement.videoHeight || videoElement.clientHeight;
        
        // Capture current frame
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.trackBlobUrl(url);

            const a = document.createElement('a');
            a.href = url;
            a.download = `instagram_${videoType}_frame_${Date.now()}.jpg`;
            a.click();

            this.scheduleCleanup(url, 1000);
            resolve();
          } else {
            reject(new Error('Canvas capture failed'));
          }
        }, 'image/jpeg', 0.95);
      } catch (err) {
        reject(err);
      }
    });
  }

  smartCopyVideoURL(videoElement) {
    const videoUrl = videoElement.src || videoElement.currentSrc;
    
    // Copy to clipboard
    navigator.clipboard.writeText(videoUrl).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = videoUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });

    // Auto open in new tab
    setTimeout(() => {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
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

  downloadAllVisibleVideos() {
    const videoButtons = document.querySelectorAll('.ig-ultimate-btn[data-media-type="video"]');

    if (videoButtons.length === 0) {
      this.showToast('🎬 No videos found on this page', 'warning');
      return;
    }

    let delay = 0;
    let successCount = 0;
    let failureCount = 0;

    this.showToast(`🎬 Starting batch video download (${videoButtons.length} videos)...`, 'info');

    videoButtons.forEach((btn, index) => {
      setTimeout(() => {
        if (!btn.disabled) {
          // Add event listeners to track success/failure
          const handleSuccess = () => {
            successCount++;
            btn.removeEventListener('success', handleSuccess);
            btn.removeEventListener('error', handleError);
          };

          const handleError = () => {
            failureCount++;
            btn.removeEventListener('success', handleSuccess);
            btn.removeEventListener('error', handleError);
          };

          btn.addEventListener('success', handleSuccess);
          btn.addEventListener('error', handleError);

          btn.click();

          // Show completion summary after last video
          if (index === videoButtons.length - 1) {
            setTimeout(() => {
              this.showToast(
                `🎬 Batch download complete: ${successCount}/${videoButtons.length} videos downloaded successfully`,
                successCount === videoButtons.length ? 'success' : 'warning'
              );
            }, 5000); // Wait 5 seconds after last video starts
          }
        }
      }, delay);
      delay += 2000; // 2 seconds between video downloads (longer than images)
    });
  }

  // Memory management methods
  trackBlobUrl(url) {
    this.blobUrls.add(url);
    console.log(`🧠 Tracking blob URL: ${this.blobUrls.size} total URLs`);
  }

  scheduleCleanup(url, delay = 1000) {
    setTimeout(() => {
      this.cleanupBlobUrl(url);
    }, delay);
  }

  cleanupBlobUrl(url) {
    if (this.blobUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.blobUrls.delete(url);
      console.log(`🧹 Cleaned up blob URL: ${this.blobUrls.size} remaining`);
    }
  }

  cleanupAllBlobUrls() {
    this.blobUrls.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.blobUrls.clear();
    console.log('🧹 All blob URLs cleaned up');
  }

  // Performance monitoring
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        blobUrls: this.blobUrls.size
      };
    }
    return { blobUrls: this.blobUrls.size };
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
      info: '#17a2b8',
      warning: '#ffc107'
    };

    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}

// Initialize Ultimate Downloader
new InstagramUltimateDownloader();
