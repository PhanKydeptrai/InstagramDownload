// Instagram Ultimate Downloader - All Methods Combined
class InstagramUltimateDownloader {
  constructor() {
    this.methods = ['canvas', 'iframe', 'proxy', 'copy'];
    this.currentMethodIndex = 0;
    this.init();
  }

  init() {
    console.log('🔥 Instagram Ultimate Downloader v3.4 - Advanced video extraction loaded');
    
    // Add global bypass button
    this.addGlobalBypassButton();
    
    // Add keyboard shortcuts
    this.addKeyboardShortcuts();
    
    // Initialize advanced video extraction
    this.initAdvancedVideoExtraction();
    
    // Start monitoring for new images
    this.startObserver();
    
    // Initial scan for images
    this.scanForMedia();
  }

  initAdvancedVideoExtraction() {
    console.log('Initializing advanced video extraction');
    
    // Check if we're on a post page that might have video
    if (window.location.pathname.includes('/p/') || 
        window.location.pathname.includes('/reel/') ||
        window.location.pathname.includes('/tv/')) {
      
      // Wait for the page to load completely
      setTimeout(async () => {
        try {
          // Try to find DASH manifest for high-quality streams
          const postUrl = this.findCurrentPostUrl();
          if (postUrl) {
            console.log('Found post URL:', postUrl);
            // Don't await this to avoid blocking the UI
            this.extractHighQualityFromPost(postUrl).catch(e => {
              console.log('Advanced extraction failed silently:', e);
            });
          }
        } catch (e) {
          console.log('Failed to initialize advanced video extraction:', e);
        }
      }, 2000);
    }
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
    // Add keyboard shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.downloadAllVisibleImages();
      }
    });
  }

  addDownloadButtons() {
    // Handle images
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

    // Handle videos
    const videos = document.querySelectorAll([
      'video',
      'video source[src*="cdninstagram"]',
      'video source[src*="fbcdn"]',
      'video source[src*="instagram"]',
      'article video'
    ].join(', '));

    videos.forEach(videoElement => {
      // If it's a source element, get its parent video
      const video = videoElement.tagName === 'SOURCE' ? videoElement.parentElement : videoElement;
      
      if (video.dataset.ultimateDownloadAdded) return;
      
      this.addBypassDownloadButton(video);
      video.dataset.ultimateDownloadAdded = 'true';
    });

    // Handle new Instagram video player format
    this.handleNewVideoPlayerFormat();
  }

  addDownloadButton(img) {
    const wrapper = img.closest('div') || img.parentElement;
    if (!wrapper || wrapper.querySelector('.ig-ultimate-btn')) return;

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
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    `;
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.background = 'linear-gradient(45deg, #ff5252, #d84315)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    });
    
    wrapper.appendChild(btn);
  }

  addBypassDownloadButton(video) {
    const wrapper = video.closest('div') || video.parentElement;
    if (!wrapper || wrapper.querySelector('.ig-bypass-download-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'ig-bypass-download-btn';
    btn.innerHTML = '📹';
    btn.title = 'Download Video (Bypass Protection)';
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.downloadVideo(video, btn);
    });
    
    wrapper.style.position = 'relative';
    wrapper.appendChild(btn);
  }

  async downloadVideo(video, btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '⏳';
    btn.disabled = true;

    try {
      console.log('🚀 Starting video download');
      
      // Get video source
      let videoSrc = '';
      
      // Try to get src directly from video element
      if (video.src) {
        videoSrc = video.src;
        console.log('Found direct video source:', videoSrc);
      } 
      // Try to get from source elements
      else if (video.querySelector('source')) {
        const sources = video.querySelectorAll('source');
        for (const source of sources) {
          if (source.src) {
            videoSrc = source.src;
            console.log('Found source element:', videoSrc);
            break;
          }
        }
      }
      
      // If we still don't have a source, try to find it in the page
      if (!videoSrc || videoSrc.includes('blob:')) {
        console.log('No direct source or blob URL found, searching in page...');
        videoSrc = this.findVideoSourceInPage(video);
        if (videoSrc) {
          console.log('Found video source in page:', videoSrc);
        }
      }

      // If still no source, try to extract from video attributes
      if (!videoSrc) {
        console.log('Trying to extract from video attributes...');
        if (video.dataset.dashManifest) {
          videoSrc = this.extractFromDashManifest(video.dataset.dashManifest);
          console.log('Extracted from DASH manifest:', videoSrc);
        } else if (video.poster) {
          // Try to derive video URL from poster URL
          videoSrc = this.deriveVideoUrlFromPoster(video.poster);
          console.log('Derived from poster:', videoSrc);
        }
      }

      if (!videoSrc) {
        // Try advanced extraction techniques
        videoSrc = await this.extractVideoFromPage();
        if (videoSrc) {
          console.log('Extracted using advanced techniques:', videoSrc);
        }
      }

      // Try to find DASH manifest for high-quality streams
      try {
        const postUrl = this.findCurrentPostUrl();
        if (postUrl) {
          const success = await this.extractHighQualityFromPost(postUrl);
          if (success) {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            return;
          }
        }
      } catch (e) {
        console.log('Failed to extract high-quality streams:', e);
      }

      if (!videoSrc) {
        throw new Error('Could not find video source');
      }

      // Clean up the URL if needed
      videoSrc = this.cleanVideoUrl(videoSrc);

      // Method 1: Direct download via fetch
      try {
        console.log('Attempting direct download via fetch:', videoSrc);
        await this.downloadVideoViaFetch(videoSrc);
        btn.innerHTML = '✅';
        this.showToast('✅ Video download thành công!', 'success');
        return;
      } catch (e) {
        console.log('Direct video download failed:', e.message);
      }

      // Method 2: Try download via iframe
      try {
        console.log('Attempting download via iframe');
        await this.downloadVideoViaIframe(videoSrc);
        btn.innerHTML = '✅';
        this.showToast('✅ Video download qua iframe thành công!', 'success');
        return;
      } catch (e) {
        console.log('Iframe download failed:', e.message);
      }

      // Method 3: Open in new tab
      console.log('Opening video in new tab:', videoSrc);
      window.open(videoSrc, '_blank', 'noopener,noreferrer');
      btn.innerHTML = '🔗';
      this.showToast('🔗 Video mở trong tab mới!', 'info');
      navigator.clipboard.writeText(videoSrc).catch(() => {
        // Fallback copy method if clipboard API fails
        const textArea = document.createElement('textarea');
        textArea.value = videoSrc;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });
      this.showToast('📋 Đã copy URL video vào clipboard!', 'info');

    } catch (error) {
      console.error('Video download failed:', error);
      btn.innerHTML = '❌';
      this.showToast('❌ Không thể tải video', 'error');
    } finally {
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;
      }, 3000);
    }
  }

  findCurrentPostUrl() {
    // Try to find the current post URL
    if (window.location.pathname.includes('/p/') || window.location.pathname.includes('/reel/')) {
      return window.location.href;
    }
    
    // Check if we're in a modal view
    const links = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    for (const link of links) {
      if (link.offsetParent !== null) { // Check if the link is visible
        return link.href;
      }
    }
    
    return null;
  }

  cleanVideoUrl(url) {
    // Remove URL encoding if present
    if (url.includes('%')) {
      try {
        url = decodeURIComponent(url);
      } catch (e) {
        console.log('Failed to decode URL:', e);
      }
    }
    
    // Remove escape characters
    url = url.replace(/\\u002F/g, '/');
    url = url.replace(/\\/g, '');

    // Ensure https protocol
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    return url;
  }

  deriveVideoUrlFromPoster(posterUrl) {
    // Instagram often uses similar patterns for video and poster URLs
    if (!posterUrl) return '';
    
    // Replace image extensions with video extensions
    const videoUrl = posterUrl
      .replace(/\.(jpg|jpeg|png|webp)/, '.mp4')
      .replace('/p_', '/v_')
      .replace('_image', '_video');
    
    return videoUrl;
  }

  extractFromDashManifest(manifest) {
    try {
      const parsed = JSON.parse(manifest);
      if (parsed && parsed.video_representations) {
        // Get highest quality video
        const videos = parsed.video_representations;
        if (videos.length > 0) {
          // Sort by width (quality)
          videos.sort((a, b) => b.width - a.width);
          return videos[0].url;
        }
      }
    } catch (e) {
      console.log('Failed to parse DASH manifest:', e);
    }
    return '';
  }

  async extractVideoFromPage() {
    // This is a more aggressive approach to find videos
    console.log('Extracting video using advanced techniques...');
    
    // Try to find DASH manifest first (highest quality)
    try {
      const manifestUrl = await this.findDashManifestUrl();
      if (manifestUrl) {
        console.log('Found DASH manifest URL:', manifestUrl);
        const videoData = await this.processDashManifest(manifestUrl);
        if (videoData && videoData.videoUrl) {
          return videoData.videoUrl;
        }
      }
    } catch (e) {
      console.log('Failed to process DASH manifest:', e);
    }
    
    // Check for video in XHR responses
    try {
      const videoUrl = await this.interceptVideoRequests();
      if (videoUrl) return videoUrl;
    } catch (e) {
      console.log('XHR interception failed:', e);
    }
    
    // Check for __additionalDataLoaded in window
    try {
      if (window.__additionalDataLoaded) {
        const data = Object.values(window._sharedData?.entry_data || {});
        if (data.length > 0) {
          const mediaData = this.findMediaInData(data);
          if (mediaData && mediaData.video_url) {
            return mediaData.video_url;
          }
        }
      }
    } catch (e) {
      console.log('Failed to extract from __additionalDataLoaded:', e);
    }
    
    // Try to find in JSON data in scripts
    try {
      const scripts = document.querySelectorAll('script:not([src])');
      for (const script of scripts) {
        if (!script.textContent) continue;
        
        // Look for JSON data
        const jsonMatches = script.textContent.match(/({".+})/g);
        if (jsonMatches) {
          for (const match of jsonMatches) {
            try {
              const data = JSON.parse(match);
              const videoUrl = this.findVideoUrlInObject(data);
              if (videoUrl) return videoUrl;
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (e) {
      console.log('Failed to extract from scripts:', e);
    }
    
    return '';
  }

  async findDashManifestUrl() {
    console.log('Looking for DASH manifest URL...');
    
    // Method 1: Look in script tags for manifest URL
    const scripts = document.querySelectorAll('script:not([src])');
    for (const script of scripts) {
      if (!script.textContent) continue;
      
      // Look for .mpd URLs
      const mpdMatches = script.textContent.match(/(https:\/\/[^"']*\.mpd[^"']*)/g);
      if (mpdMatches && mpdMatches.length > 0) {
        return this.cleanVideoUrl(mpdMatches[0]);
      }
      
      // Look for dash_manifest in JSON
      const dashMatches = script.textContent.match(/"dash_manifest":"([^"]+)"/);
      if (dashMatches && dashMatches[1]) {
        // This is a base64 encoded manifest
        try {
          const decoded = atob(dashMatches[1]);
          // Extract the URL from the XML
          const urlMatch = decoded.match(/<BaseURL>([^<]+)<\/BaseURL>/);
          if (urlMatch && urlMatch[1]) {
            return this.cleanVideoUrl(urlMatch[1]);
          }
          // If no direct URL found, return the XML for processing
          return { manifestXml: decoded };
        } catch (e) {
          console.log('Failed to decode dash_manifest:', e);
        }
      }
    }
    
    // Method 2: Check network requests for .mpd files
    return await this.interceptManifestRequests();
  }

  async interceptManifestRequests() {
    return new Promise((resolve) => {
      // Set a timeout to avoid hanging
      const timeout = setTimeout(() => resolve(''), 2000);
      
      // Create a proxy for XMLHttpRequest
      const originalXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        
        xhr.open = function() {
          const url = arguments[1];
          if (typeof url === 'string' && (url.includes('.mpd') || url.includes('dash_manifest'))) {
            clearTimeout(timeout);
            window.XMLHttpRequest = originalXHR; // Restore original
            resolve(url);
          }
          return originalOpen.apply(this, arguments);
        };
        
        return xhr;
      };
      
      // Restore original after timeout
      setTimeout(() => {
        window.XMLHttpRequest = originalXHR;
      }, 2000);
    });
  }

  async extractHighQualityFromPost(postUrl) {
    try {
      console.log('Analyzing post for high-quality streams:', postUrl);
      
      // Extract post ID from URL
      let postId = '';
      const match = postUrl.match(/\/p\/([^\/]+)/);
      if (match && match[1]) {
        postId = match[1];
      } else {
        const reelMatch = postUrl.match(/\/reel\/([^\/]+)/);
        if (reelMatch && reelMatch[1]) {
          postId = reelMatch[1];
        } else {
          throw new Error('Could not extract post ID');
        }
      }
      
      console.log('Extracted post ID:', postId);
      
      // Fetch the post page
      const response = await fetch(`https://www.instagram.com/p/${postId}/?__a=1&__d=1`, {
        method: 'GET',
        headers: {
          'User-Agent': navigator.userAgent,
          'Accept': 'application/json',
          'X-IG-App-ID': '936619743392459' // Instagram web app ID
        }
      });
      
      if (!response.ok) {
        console.log('Failed to fetch post data, status:', response.status);
        // Try alternative method
        return await this.extractFromEmbedPage(postId);
      }
      
      const data = await response.json();
      console.log('Post data:', data);
      
      // Look for dash_info or video_dash_manifest
      let dashManifest = null;
      
      if (data.items && data.items[0]) {
        const item = data.items[0];
        
        // Check for dash_manifest
        if (item.video_dash_manifest) {
          dashManifest = item.video_dash_manifest;
        } else if (item.dash_info && item.dash_info.video_dash_manifest) {
          dashManifest = item.dash_info.video_dash_manifest;
        }
      } else if (data.graphql && data.graphql.shortcode_media) {
        const media = data.graphql.shortcode_media;
        
        if (media.dash_info && media.dash_info.video_dash_manifest) {
          dashManifest = media.dash_info.video_dash_manifest;
        } else if (media.video_dash_manifest) {
          dashManifest = media.video_dash_manifest;
        }
      }
      
      if (dashManifest) {
        console.log('Found dash manifest in post data');
        // Process the manifest
        const videoData = await this.processDashManifest({ manifestXml: dashManifest });
        if (videoData && videoData.videoUrl) {
          return true;
        }
      }
      
      // If we couldn't find or process the manifest, try alternative method
      return await this.extractFromEmbedPage(postId);
    } catch (error) {
      console.error('Error extracting high-quality streams:', error);
      return false;
    }
  }

  async extractFromEmbedPage(postId) {
    try {
      console.log('Trying to extract from embed page');
      
      // Fetch the embed page
      const response = await fetch(`https://www.instagram.com/p/${postId}/embed/captioned/`, {
        method: 'GET',
        headers: {
          'User-Agent': navigator.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Look for dash_manifest in the HTML
      const dashMatch = html.match(/"dash_manifest":"([^"]+)"/);
      if (dashMatch && dashMatch[1]) {
        try {
          const decoded = atob(dashMatch[1]);
          console.log('Found and decoded dash_manifest from embed page');
          
          // Process the manifest
          const videoData = await this.processDashManifest({ manifestXml: decoded });
          if (videoData && videoData.videoUrl) {
            return true;
          }
        } catch (e) {
          console.log('Failed to decode dash_manifest:', e);
        }
      }
      
      // Look for video URL in the embed HTML
      const videoRegex = /"video_url":"([^"]+)"/g;
      const matches = [...html.matchAll(videoRegex)];
      
      if (matches.length > 0) {
        const videoUrl = matches[matches.length - 1][1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        await this.downloadVideoViaFetch(videoUrl);
        this.showToast('✅ Video downloaded successfully!', 'success');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error extracting from embed page:', error);
      return false;
    }
  }

  async processDashManifest(manifestUrl) {
    try {
      let manifestText;
      
      // Check if we have XML directly
      if (typeof manifestUrl === 'object' && manifestUrl.manifestXml) {
        manifestText = manifestUrl.manifestXml;
        console.log('Using provided manifest XML');
      } else {
        // Fetch the manifest file
        console.log('Fetching manifest from URL:', manifestUrl);
        const response = await fetch(manifestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/dash+xml,application/xml',
            'User-Agent': navigator.userAgent
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        manifestText = await response.text();
      }
      
      console.log('Manifest content:', manifestText.substring(0, 200) + '...');
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(manifestText, 'application/xml');
      
      // Extract video and audio streams
      const result = this.extractStreamsFromManifest(xmlDoc);
      
      // If we found both video and audio, show options to download separately
      if (result.videoUrl && result.audioUrl) {
        this.showAdvancedDownloadOptions(result.videoUrl, result.audioUrl);
      }
      
      // Return the highest quality video URL
      return result;
    } catch (e) {
      console.error('Error processing DASH manifest:', e);
      return null;
    }
  }

  extractStreamsFromManifest(xmlDoc) {
    const result = {
      videoUrl: '',
      audioUrl: '',
      videoQuality: '',
      audioQuality: ''
    };
    
    try {
      // Find all adaptation sets
      const adaptationSets = xmlDoc.querySelectorAll('AdaptationSet');
      
      // Process each adaptation set
      adaptationSets.forEach(adaptSet => {
        const mimeType = adaptSet.getAttribute('mimeType') || '';
        const contentType = adaptSet.getAttribute('contentType') || '';
        
        // Video stream
        if (mimeType.includes('video') || contentType === 'video') {
          // Get all representations (different qualities)
          const representations = adaptSet.querySelectorAll('Representation');
          let bestVideo = null;
          let maxBandwidth = 0;
          
          // Find the highest quality video
          representations.forEach(rep => {
            const bandwidth = parseInt(rep.getAttribute('bandwidth') || '0');
            if (bandwidth > maxBandwidth) {
              maxBandwidth = bandwidth;
              bestVideo = rep;
            }
          });
          
          if (bestVideo) {
            // Get the BaseURL
            const baseUrl = bestVideo.querySelector('BaseURL');
            if (baseUrl && baseUrl.textContent) {
              result.videoUrl = this.cleanVideoUrl(baseUrl.textContent);
              result.videoQuality = `${bestVideo.getAttribute('width') || ''}x${bestVideo.getAttribute('height') || ''} (${Math.round(maxBandwidth/1024)} Kbps)`;
            }
          }
        }
        
        // Audio stream
        if (mimeType.includes('audio') || contentType === 'audio') {
          // Get all representations
          const representations = adaptSet.querySelectorAll('Representation');
          let bestAudio = null;
          let maxBandwidth = 0;
          
          // Find the highest quality audio
          representations.forEach(rep => {
            const bandwidth = parseInt(rep.getAttribute('bandwidth') || '0');
            if (bandwidth > maxBandwidth) {
              maxBandwidth = bandwidth;
              bestAudio = rep;
            }
          });
          
          if (bestAudio) {
            // Get the BaseURL
            const baseUrl = bestAudio.querySelector('BaseURL');
            if (baseUrl && baseUrl.textContent) {
              result.audioUrl = this.cleanVideoUrl(baseUrl.textContent);
              result.audioQuality = `${Math.round(maxBandwidth/1024)} Kbps`;
            }
          }
        }
      });
      
      return result;
    } catch (e) {
      console.error('Error extracting streams from manifest:', e);
      return result;
    }
  }

  showAdvancedDownloadOptions(videoUrl, audioUrl) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'ig-modal-overlay';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'ig-modal-content';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Advanced Video Download';
    title.style.marginBottom = '20px';
    content.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.innerHTML = 'Đã tìm thấy luồng video và âm thanh riêng biệt.<br>Bạn có thể tải xuống từng phần riêng lẻ:';
    description.style.marginBottom = '15px';
    content.appendChild(description);
    
    // Add video download option
    const videoOption = document.createElement('div');
    videoOption.style.padding = '10px';
    videoOption.style.margin = '10px 0';
    videoOption.style.borderRadius = '8px';
    videoOption.style.background = '#f0f0f0';
    videoOption.style.cursor = 'pointer';
    videoOption.style.transition = 'all 0.2s ease';
    
    videoOption.innerHTML = `
      <strong>Tải xuống Video (không có âm thanh)</strong><br>
      <small>Định dạng: MP4</small>
    `;
    
    videoOption.addEventListener('mouseenter', () => {
      videoOption.style.background = '#e0e0e0';
    });
    
    videoOption.addEventListener('mouseleave', () => {
      videoOption.style.background = '#f0f0f0';
    });
    
    videoOption.addEventListener('click', async () => {
      overlay.remove();
      try {
        await this.downloadVideoViaFetch(videoUrl);
        this.showToast('✅ Video stream downloaded successfully!', 'success');
      } catch (error) {
        console.error('Error downloading video stream:', error);
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
        this.showToast('🔗 Video opened in new tab', 'info');
      }
    });
    
    content.appendChild(videoOption);
    
    // Add audio download option
    const audioOption = document.createElement('div');
    audioOption.style.padding = '10px';
    audioOption.style.margin = '10px 0';
    audioOption.style.borderRadius = '8px';
    audioOption.style.background = '#f0f0f0';
    audioOption.style.cursor = 'pointer';
    audioOption.style.transition = 'all 0.2s ease';
    
    audioOption.innerHTML = `
      <strong>Tải xuống Audio</strong><br>
      <small>Định dạng: M4A/AAC</small>
    `;
    
    audioOption.addEventListener('mouseenter', () => {
      audioOption.style.background = '#e0e0e0';
    });
    
    audioOption.addEventListener('mouseleave', () => {
      audioOption.style.background = '#f0f0f0';
    });
    
    audioOption.addEventListener('click', async () => {
      overlay.remove();
      try {
        await this.downloadAudioViaFetch(audioUrl);
        this.showToast('✅ Audio stream downloaded successfully!', 'success');
      } catch (error) {
        console.error('Error downloading audio stream:', error);
        window.open(audioUrl, '_blank', 'noopener,noreferrer');
        this.showToast('🔗 Audio opened in new tab', 'info');
      }
    });
    
    content.appendChild(audioOption);
    
    // Add combined download info
    const combinedInfo = document.createElement('div');
    combinedInfo.style.padding = '15px';
    combinedInfo.style.margin = '15px 0';
    combinedInfo.style.borderRadius = '8px';
    combinedInfo.style.background = '#e6f7ff';
    combinedInfo.style.border = '1px solid #91d5ff';
    
    combinedInfo.innerHTML = `
      <strong>Để có video hoàn chỉnh với âm thanh:</strong><br>
      1. Tải xuống cả hai luồng video và audio<br>
      2. Sử dụng phần mềm như <a href="https://www.ffmpeg.org/" target="_blank">FFmpeg</a> hoặc <a href="https://www.videoproc.com/" target="_blank">VideoProc</a> để ghép nối<br>
      3. Hoặc sử dụng dịch vụ trực tuyến như <a href="https://www.onlinevideoconverter.com/video-merger" target="_blank">Online Video Merger</a>
    `;
    
    content.appendChild(combinedInfo);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Đóng';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = '#dc3545';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    
    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });
    
    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  }

  async downloadAudioViaFetch(audioUrl) {
    console.log('Downloading audio via fetch:', audioUrl);
    
    try {
      const response = await fetch(audioUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Accept': 'audio/mp4,audio/*;q=0.9,*/*;q=0.8',
          'User-Agent': navigator.userAgent,
          'Referer': 'https://www.instagram.com/'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instagram_audio_${Date.now()}.m4a`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio via fetch:', error);
      throw error;
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

  addGlobalBypassButton() {
    // Don't add if already exists
    if (document.querySelector('#ig-global-bypass-btn')) return;
    
    const globalBtn = document.createElement('button');
    globalBtn.id = 'ig-global-bypass-btn';
    globalBtn.className = 'ig-bypass-download-btn';
    globalBtn.style.position = 'fixed';
    globalBtn.style.bottom = '20px';
    globalBtn.style.right = '20px';
    globalBtn.style.top = 'auto';
    globalBtn.innerHTML = '📥';
    globalBtn.title = 'Scan page for videos (Stories, Reels)';
    
    globalBtn.addEventListener('click', () => {
      this.scanPageForVideos();
    });
    
    document.body.appendChild(globalBtn);

    // Add a second button for direct media download
    const directBtn = document.createElement('button');
    directBtn.id = 'ig-direct-media-btn';
    directBtn.className = 'ig-bypass-download-btn';
    directBtn.style.position = 'fixed';
    directBtn.style.bottom = '20px';
    directBtn.style.right = '80px'; // Position to the left of the global button
    directBtn.style.top = 'auto';
    directBtn.style.background = 'rgba(0, 128, 255, 0.9) !important';
    directBtn.innerHTML = '🔍';
    directBtn.title = 'Direct Media Download (Advanced)';
    
    directBtn.addEventListener('click', () => {
      this.showDirectMediaDownloadDialog();
    });
    
    document.body.appendChild(directBtn);
  }

  async scanPageForVideos() {
    this.showToast('🔍 Scanning page for videos...', 'info');
    
    try {
      // Check if we're on a story page
      if (window.location.pathname.includes('/stories/')) {
        await this.handleInstagramStory();
        return;
      }
      
      // Check if we're on a reel page
      if (window.location.pathname.includes('/reel/')) {
        await this.handleInstagramReel();
        return;
      }

      // Check if we're on a post page that might contain video
      if (window.location.pathname.includes('/p/')) {
        await this.handleInstagramPost();
        return;
      }
      
      // General scan for videos
      const videoSources = this.findAllVideoSources();
      
      if (videoSources.length > 0) {
        // Create a modal with video options
        this.showVideoOptionsModal(videoSources);
      } else {
        // Try one more aggressive scan
        const videoUrl = await this.extractVideoFromPage();
        if (videoUrl) {
          try {
            await this.downloadVideoViaFetch(this.cleanVideoUrl(videoUrl));
            this.showToast('✅ Video downloaded successfully!', 'success');
          } catch (error) {
            window.open(this.cleanVideoUrl(videoUrl), '_blank', 'noopener,noreferrer');
            this.showToast('🔗 Video opened in new tab', 'info');
          }
        } else {
          this.showToast('❌ No videos found on this page', 'error');
        }
      }
    } catch (error) {
      console.error('Error scanning for videos:', error);
      this.showToast('❌ Error scanning for videos', 'error');
    }
  }

  async handleInstagramStory() {
    this.showToast('🔍 Scanning Instagram Story...', 'info');
    
    try {
      // Look for the video element in the story
      const storyVideo = document.querySelector('video[poster]');
      if (storyVideo && storyVideo.src) {
        await this.downloadVideoViaFetch(storyVideo.src);
        this.showToast('✅ Story video downloaded!', 'success');
        return;
      }
      
      // Try to find in the page source
      const videoUrl = this.findVideoInMetadata();
      if (videoUrl) {
        await this.downloadVideoViaFetch(videoUrl);
        this.showToast('✅ Story video downloaded!', 'success');
        return;
      }
      
      // If no video found, try to find the story image
      const storyImg = document.querySelector('img[decoding="sync"]');
      if (storyImg && storyImg.src) {
        await this.downloadViaBlob(storyImg);
        this.showToast('✅ Story image downloaded!', 'success');
        return;
      }
      
      this.showToast('❌ Could not find story media', 'error');
    } catch (error) {
      console.error('Error handling Instagram story:', error);
      this.showToast('❌ Error downloading story', 'error');
    }
  }

  async handleInstagramReel() {
    this.showToast('🔍 Scanning Instagram Reel...', 'info');
    
    try {
      // Look for the video element in the reel
      const reelVideo = document.querySelector('video');
      if (reelVideo && reelVideo.src) {
        await this.downloadVideoViaFetch(reelVideo.src);
        this.showToast('✅ Reel downloaded!', 'success');
        return;
      }
      
      // Try to find in the page source
      const videoUrl = this.findVideoInMetadata();
      if (videoUrl) {
        await this.downloadVideoViaFetch(videoUrl);
        this.showToast('✅ Reel downloaded!', 'success');
        return;
      }

      // Try the new Instagram Reels format
      const reelData = await this.extractInstagramReelData();
      if (reelData) {
        await this.downloadVideoViaFetch(reelData);
        this.showToast('✅ Reel downloaded!', 'success');
        return;
      }
      
      this.showToast('❌ Could not find reel video', 'error');
    } catch (error) {
      console.error('Error handling Instagram reel:', error);
      this.showToast('❌ Error downloading reel', 'error');
    }
  }

  async extractInstagramReelData() {
    console.log('Extracting Instagram Reel data...');
    
    // Method 1: Check for data in script tags
    try {
      const scripts = document.querySelectorAll('script[type="application/json"]');
      for (const script of scripts) {
        if (!script.textContent) continue;
        
        try {
          const data = JSON.parse(script.textContent);
          
          // Look for video data in the JSON structure
          const videoUrl = this.findVideoUrlInObject(data);
          if (videoUrl) {
            console.log('Found video URL in script data:', videoUrl);
            return videoUrl;
          }
        } catch (e) {
          console.log('Failed to parse JSON in script:', e);
        }
      }
    } catch (e) {
      console.log('Error searching script tags:', e);
    }
    
    // Method 2: Look for specific reel data attributes
    try {
      const reelContainers = document.querySelectorAll('[data-media-type="GraphVideo"]');
      for (const container of reelContainers) {
        const dataId = container.getAttribute('data-id');
        if (dataId) {
          // Try to find video data in window.__additionalData
          if (window.__additionalData && window.__additionalData[`/reel/${dataId}/`]) {
            const reelData = window.__additionalData[`/reel/${dataId}/`];
            const videoUrl = this.findVideoUrlInObject(reelData);
            if (videoUrl) return videoUrl;
          }
        }
      }
    } catch (e) {
      console.log('Error searching for reel containers:', e);
    }
    
    // Method 3: Extract from network requests
    try {
      // This is a more aggressive approach
      const pageSource = document.documentElement.outerHTML;
      
      // Look for video URLs in the page source
      const videoRegex = /"video_url":"([^"]+)"/g;
      const matches = [...pageSource.matchAll(videoRegex)];
      
      if (matches.length > 0) {
        // Get the last match (usually the highest quality)
        const videoUrl = matches[matches.length - 1][1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        return videoUrl;
      }
      
      // Try another pattern for reels
      const reelsRegex = /"playback_url":"([^"]+)"/g;
      const reelsMatches = [...pageSource.matchAll(reelsRegex)];
      
      if (reelsMatches.length > 0) {
        const videoUrl = reelsMatches[reelsMatches.length - 1][1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        return videoUrl;
      }
    } catch (e) {
      console.log('Error extracting from page source:', e);
    }
    
    return null;
  }

  async handleInstagramPost() {
    this.showToast('🔍 Scanning Instagram Post...', 'info');
    
    try {
      // Look for video elements
      const videos = document.querySelectorAll('video');
      if (videos.length > 0) {
        // Use the first video found
        const video = videos[0];
        if (video.src) {
          await this.downloadVideoViaFetch(video.src);
          this.showToast('✅ Video downloaded!', 'success');
          return;
        }
      }
      
      // Try to extract from page data
      const videoUrl = await this.extractVideoFromPage();
      if (videoUrl) {
        await this.downloadVideoViaFetch(this.cleanVideoUrl(videoUrl));
        this.showToast('✅ Video downloaded!', 'success');
        return;
      }
      
      // Check if this is an image post instead
      const images = document.querySelectorAll('img[sizes]');
      if (images.length > 0) {
        // Use the largest image
        let largestImage = images[0];
        let maxSize = 0;
        
        for (const img of images) {
          if (img.naturalWidth * img.naturalHeight > maxSize) {
            maxSize = img.naturalWidth * img.naturalHeight;
            largestImage = img;
          }
        }
        
        await this.downloadViaBlob(largestImage);
        this.showToast('✅ Image downloaded!', 'success');
        return;
      }
      
      this.showToast('❌ No media found in this post', 'error');
    } catch (error) {
      console.error('Error handling Instagram post:', error);
      this.showToast('❌ Error downloading media', 'error');
    }
  }

  findAllVideoSources() {
    const sources = [];
    
    // Check video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.src) {
        sources.push({
          url: video.src,
          type: 'Direct video source',
          quality: this.estimateVideoQuality(video.src)
        });
      }
      
      // Check source elements within video
      const videoSources = video.querySelectorAll('source');
      videoSources.forEach(source => {
        if (source.src) {
          sources.push({
            url: source.src,
            type: 'Video source element',
            quality: this.estimateVideoQuality(source.src)
          });
        }
      });
    });
    
    // Check metadata
    const ogVideo = document.querySelector('meta[property="og:video"]');
    if (ogVideo && ogVideo.content) {
      sources.push({
        url: ogVideo.content,
        type: 'Open Graph video',
        quality: 'High'
      });
    }
    
    // Check for video URLs in scripts
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (!script.textContent) return;
      
      const matches = script.textContent.match(/(https:\/\/[^"']*\.mp4[^"']*)/g);
      if (matches) {
        matches.forEach(match => {
          if (sources.some(s => s.url === match)) return; // Skip duplicates
          
          sources.push({
            url: match,
            type: 'Script embedded video',
            quality: this.estimateVideoQuality(match)
          });
        });
      }
    });
    
    return sources;
  }

  estimateVideoQuality(url) {
    if (!url) return 'Unknown';
    
    if (url.includes('1080p') || url.includes('1080_')) return '1080p (High)';
    if (url.includes('720p') || url.includes('720_')) return '720p (Medium)';
    if (url.includes('480p') || url.includes('480_')) return '480p (Low)';
    if (url.includes('high')) return 'High';
    if (url.includes('medium')) return 'Medium';
    if (url.includes('low')) return 'Low';
    
    return 'Unknown';
  }

  showVideoOptionsModal(videoSources) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'ig-modal-overlay';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'ig-modal-content';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Available Videos';
    title.style.marginBottom = '20px';
    content.appendChild(title);
    
    // Add video options
    videoSources.forEach((source, index) => {
      const option = document.createElement('div');
      option.style.padding = '10px';
      option.style.margin = '10px 0';
      option.style.borderRadius = '8px';
      option.style.background = '#f0f0f0';
      option.style.cursor = 'pointer';
      option.style.transition = 'all 0.2s ease';
      
      option.innerHTML = `
        <strong>Option ${index + 1}</strong> - ${source.type}<br>
        Quality: ${source.quality}
      `;
      
      option.addEventListener('mouseenter', () => {
        option.style.background = '#e0e0e0';
      });
      
      option.addEventListener('mouseleave', () => {
        option.style.background = '#f0f0f0';
      });
      
      option.addEventListener('click', async () => {
        overlay.remove();
        try {
          await this.downloadVideoViaFetch(source.url);
          this.showToast('✅ Video downloaded successfully!', 'success');
        } catch (error) {
          console.error('Error downloading video:', error);
          this.showToast('❌ Error downloading video', 'error');
          
          // Fallback to opening in new tab
          window.open(source.url, '_blank', 'noopener,noreferrer');
          this.showToast('🔗 Video opened in new tab', 'info');
        }
      });
      
      content.appendChild(option);
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = '#dc3545';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    
    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });
    
    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  }

  showDirectMediaDownloadDialog() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'ig-modal-overlay';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'ig-modal-content';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Direct Media Download';
    title.style.marginBottom = '20px';
    content.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Enter a direct Instagram media URL or post URL:';
    description.style.marginBottom = '15px';
    content.appendChild(description);
    
    // Add input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'https://www.instagram.com/p/XXXX/ or direct media URL';
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.marginBottom = '20px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ccc';
    content.appendChild(input);
    
    // Add advanced option checkbox
    const advancedOption = document.createElement('div');
    advancedOption.style.marginBottom = '20px';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'advanced-option';
    checkbox.style.marginRight = '8px';
    checkbox.checked = true; // Enable by default
    
    const label = document.createElement('label');
    label.htmlFor = 'advanced-option';
    label.textContent = 'Tìm kiếm luồng video và âm thanh chất lượng cao (DASH)';
    
    advancedOption.appendChild(checkbox);
    advancedOption.appendChild(label);
    content.appendChild(advancedOption);
    
    // Add download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.style.padding = '8px 16px';
    downloadBtn.style.marginRight = '10px';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.border = 'none';
    downloadBtn.style.background = '#28a745';
    downloadBtn.style.color = 'white';
    downloadBtn.style.cursor = 'pointer';
    
    downloadBtn.addEventListener('click', async () => {
      const url = input.value.trim();
      if (!url) return;
      
      overlay.remove();
      this.showToast('🔍 Processing URL...', 'info');
      
      try {
        const useAdvanced = checkbox.checked;
        await this.processDirectMediaUrl(url, useAdvanced);
      } catch (error) {
        console.error('Error processing URL:', error);
        this.showToast('❌ Error processing URL', 'error');
      }
    });
    
    content.appendChild(downloadBtn);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = '#dc3545';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    
    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });
    
    content.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Focus the input field
    setTimeout(() => input.focus(), 100);
  }

  async processDirectMediaUrl(url, useAdvanced = false) {
    // Check if it's a direct media URL or a post URL
    if (url.includes('.mp4') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
      // It's a direct media URL
      try {
        if (url.includes('.mp4')) {
          await this.downloadVideoViaFetch(url);
        } else {
          // Create a temporary image element
          const img = document.createElement('img');
          img.src = url;
          await this.downloadViaBlob(img);
        }
        this.showToast('✅ Media downloaded successfully!', 'success');
      } catch (error) {
        console.error('Error downloading direct media:', error);
        this.showToast('❌ Error downloading media', 'error');
        
        // Fallback to opening in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
        this.showToast('🔗 Media opened in new tab', 'info');
      }
    } else if (url.includes('instagram.com')) {
      // It's a post URL, we need to fetch it
      try {
        this.showToast('🔄 Fetching post data...', 'info');
        
        if (useAdvanced) {
          // Try to extract high-quality streams using manifest
          const success = await this.extractHighQualityFromPost(url);
          if (success) return;
        }
        
        // If advanced extraction failed or wasn't requested, use standard methods
        // Create an iframe to load the post
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        
        // Wait for iframe to load
        await new Promise((resolve, reject) => {
          iframe.onload = resolve;
          iframe.onerror = reject;
          document.body.appendChild(iframe);
          
          // Set a timeout in case the iframe doesn't load
          setTimeout(resolve, 5000);
        });
        
        // Try to extract video from the iframe
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const video = iframeDoc.querySelector('video');
          
          if (video && video.src) {
            await this.downloadVideoViaFetch(video.src);
            this.showToast('✅ Video downloaded successfully!', 'success');
          } else {
            // Try to extract from page data
            const videoUrl = this.findVideoUrlInObject(iframe.contentWindow._sharedData);
            if (videoUrl) {
              await this.downloadVideoViaFetch(videoUrl);
              this.showToast('✅ Video downloaded successfully!', 'success');
            } else {
              // Check if it's an image post
              const img = iframeDoc.querySelector('img[sizes]');
              if (img && img.src) {
                await this.downloadViaBlob(img);
                this.showToast('✅ Image downloaded successfully!', 'success');
              } else {
                this.showToast('❌ Could not find media in post', 'error');
              }
            }
          }
        } catch (e) {
          console.error('Error extracting from iframe:', e);
          
          // Try using fetch API instead
          await this.fetchAndProcessPostUrl(url);
        }
        
        // Clean up
        document.body.removeChild(iframe);
      } catch (error) {
        console.error('Error processing post URL:', error);
        this.showToast('❌ Error processing post URL', 'error');
      }
    } else {
      this.showToast('❌ Invalid URL format', 'error');
    }
  }

  async fetchAndProcessPostUrl(url) {
    try {
      // Fetch the post page
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': navigator.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Create a temporary DOM to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Look for video in the parsed document
      const video = doc.querySelector('video');
      if (video && video.src) {
        await this.downloadVideoViaFetch(video.src);
        this.showToast('✅ Video downloaded successfully!', 'success');
        return;
      }
      
      // Look for video URL in the page source
      const videoRegex = /"video_url":"([^"]+)"/g;
      const matches = [...html.matchAll(videoRegex)];
      
      if (matches.length > 0) {
        const videoUrl = matches[matches.length - 1][1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        await this.downloadVideoViaFetch(videoUrl);
        this.showToast('✅ Video downloaded successfully!', 'success');
        return;
      }
      
      // Check if it's an image post
      const img = doc.querySelector('img[sizes]');
      if (img && img.src) {
        await this.downloadViaBlob(img);
        this.showToast('✅ Image downloaded successfully!', 'success');
        return;
      }
      
      this.showToast('❌ Could not find media in post', 'error');
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  handleNewVideoPlayerFormat() {
    // Look for Instagram's new video player format
    const videoContainers = document.querySelectorAll([
      'div[data-media-type="GraphVideo"]',
      'div[role="button"][tabindex="0"]',
      'div[data-visualcompletion="loading-state"]'
    ].join(', '));

    videoContainers.forEach(container => {
      // Check if container already has a download button
      if (container.querySelector('.ig-bypass-download-btn')) return;
      
      // Check if container contains a video element
      const video = container.querySelector('video');
      if (video) {
        if (!video.dataset.ultimateDownloadAdded) {
          this.addBypassDownloadButton(video);
          video.dataset.ultimateDownloadAdded = 'true';
        }
        return;
      }
      
      // If no video element found, but it's likely a video container
      // (e.g. it has a play button or video icon)
      const hasVideoIndicator = 
        container.querySelector('svg[aria-label*="video"]') || 
        container.innerHTML.includes('play_arrow') ||
        container.innerHTML.includes('PlayButton');
      
      if (hasVideoIndicator || this.looksLikeVideoContainer(container)) {
        this.addVideoContainerButton(container);
      }
    });
  }

  looksLikeVideoContainer(element) {
    // Check various indicators that this might be a video container
    
    // Check for common video container classes
    const classNames = element.className || '';
    if (
      classNames.includes('video') || 
      classNames.includes('reel') || 
      classNames.includes('media')
    ) {
      return true;
    }
    
    // Check for play button icon
    const hasPlayIcon = element.querySelector('svg[aria-label*="Play"]');
    if (hasPlayIcon) return true;
    
    // Check for video duration indicator
    const hasDuration = element.querySelector('div[class*="duration"]');
    if (hasDuration) return true;
    
    // Check if it's in a video section of the page
    if (
      window.location.pathname.includes('/reels/') || 
      window.location.pathname.includes('/tv/') ||
      window.location.pathname.includes('/video/')
    ) {
      return true;
    }
    
    return false;
  }

  addVideoContainerButton(container) {
    if (!container || container.querySelector('.ig-bypass-download-btn')) return;
    
    // Make sure container has position relative for button positioning
    container.style.position = 'relative';
    
    const btn = document.createElement('button');
    btn.className = 'ig-bypass-download-btn';
    btn.innerHTML = '📹';
    btn.title = 'Download Video (Bypass Protection)';
    
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Try to find video source associated with this container
      const videoUrl = await this.findVideoForContainer(container);
      
      if (videoUrl) {
        try {
          await this.downloadVideoViaFetch(videoUrl);
          this.showToast('✅ Video download thành công!', 'success');
        } catch (error) {
          console.error('Error downloading container video:', error);
          window.open(videoUrl, '_blank', 'noopener,noreferrer');
          this.showToast('🔗 Video opened in new tab', 'info');
        }
      } else {
        this.showToast('❌ Could not find video source', 'error');
      }
    });
    
    container.appendChild(btn);
  }

  async findVideoForContainer(container) {
    console.log('Finding video for container:', container);
    
    // Method 1: Check for video element that might have loaded after our initial scan
    const video = container.querySelector('video');
    if (video && video.src) {
      console.log('Found video element with src:', video.src);
      return video.src;
    }
    
    // Method 2: Check for data attributes that might contain video info
    const dataId = container.getAttribute('data-id') || 
                  container.getAttribute('data-media-id') ||
                  this.findMediaIdInElement(container);
    
    if (dataId) {
      console.log('Found data ID:', dataId);
      
      // Try to find in shared data
      if (window._sharedData) {
        const mediaData = this.findMediaInSharedData(window._sharedData, dataId);
        if (mediaData && mediaData.video_url) {
          console.log('Found video in shared data:', mediaData.video_url);
          return mediaData.video_url;
        }
      }
    }
    
    // Method 3: Check for nearby links that might be the post URL
    const nearbyLinks = this.findNearbyLinks(container);
    if (nearbyLinks.length > 0) {
      console.log('Found nearby links:', nearbyLinks);
      
      // Try each link
      for (const link of nearbyLinks) {
        try {
          // Extract post ID from link
          const match = link.href.match(/\/p\/([^\/]+)/);
          if (match && match[1]) {
            const postId = match[1];
            console.log('Extracted post ID:', postId);
            
            // Try to find video for this post
            const videoUrl = await this.extractVideoFromPostId(postId);
            if (videoUrl) {
              console.log('Found video for post ID:', videoUrl);
              return videoUrl;
            }
          }
        } catch (e) {
          console.log('Error processing link:', e);
        }
      }
    }
    
    // Method 4: As a last resort, try to extract from the page
    console.log('Trying advanced extraction...');
    return await this.extractVideoFromPage();
  }

  findMediaIdInElement(element) {
    // Try to find media ID in element's attributes or child elements
    
    // Check for common ID patterns in the element's HTML
    const html = element.outerHTML;
    const idMatches = html.match(/\"media_id\":\"(\d+)\"/);
    if (idMatches && idMatches[1]) return idMatches[1];
    
    // Check for ID in data attributes of child elements
    const childrenWithData = element.querySelectorAll('[data-id]');
    if (childrenWithData.length > 0) {
      return childrenWithData[0].getAttribute('data-id');
    }
    
    return null;
  }

  findNearbyLinks(element) {
    // Find links that might point to the post
    const links = [];
    
    // Check parent elements for links
    let parent = element.parentElement;
    for (let i = 0; i < 3 && parent; i++) {
      const parentLinks = parent.querySelectorAll('a[href*="/p/"]');
      if (parentLinks.length > 0) {
        links.push(...parentLinks);
      }
      parent = parent.parentElement;
    }
    
    // Check child elements for links
    const childLinks = element.querySelectorAll('a[href*="/p/"]');
    if (childLinks.length > 0) {
      links.push(...childLinks);
    }
    
    return links;
  }

  findMediaInSharedData(sharedData, mediaId) {
    // Try to find media with the given ID in Instagram's shared data
    if (!sharedData) return null;
    
    // Check in entry_data
    if (sharedData.entry_data) {
      const entries = Object.values(sharedData.entry_data);
      for (const entry of entries) {
        if (Array.isArray(entry)) {
          for (const item of entry) {
            if (item && item.graphql) {
              const media = this.findMediaInObject(item.graphql, mediaId);
              if (media) return media;
            }
          }
        }
      }
    }
    
    // Check in feed
    if (sharedData.feed) {
      const media = this.findMediaInObject(sharedData.feed, mediaId);
      if (media) return media;
    }
    
    return null;
  }

  findMediaInObject(obj, mediaId, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 5) return null;
    
    // Check if this object has the media we're looking for
    if (obj.id === mediaId || obj.media_id === mediaId) {
      if (obj.video_url) return obj;
      if (obj.video_versions && obj.video_versions.length > 0) {
        return { video_url: obj.video_versions[0].url };
      }
    }
    
    // Recursively search in object properties
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = this.findMediaInObject(obj[key], mediaId, depth + 1);
        if (result) return result;
      }
    }
    
    return null;
  }

  async extractVideoFromPostId(postId) {
    try {
      // Try to find video for this post ID
      const response = await fetch(`https://www.instagram.com/p/${postId}/embed/captioned/`, {
        method: 'GET',
        headers: {
          'User-Agent': navigator.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Look for video URL in the embed HTML
      const videoRegex = /"video_url":"([^"]+)"/g;
      const matches = [...html.matchAll(videoRegex)];
      
      if (matches.length > 0) {
        const videoUrl = matches[matches.length - 1][1].replace(/\\u0025/g, '%').replace(/\\/g, '');
        return videoUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting video from post ID:', error);
      return null;
    }
  }
}

// Initialize Ultimate Downloader
new InstagramUltimateDownloader();
