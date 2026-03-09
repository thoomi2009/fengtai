/**
 * Classroom Detail Page JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const playButton = document.getElementById('playButton');
  const videoPlayer = document.getElementById('videoPlayer');
  const favoriteBtn = document.getElementById('favoriteBtn');
  const shareBtn = document.getElementById('shareBtn');

  // State
  let isFavorited = false;
  let isPlaying = false;

  // Initialize
  function init() {
    // Check if course is already favorited
    const courseId = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('courseFavorites') || '{}');
    isFavorited = favorites[courseId] || false;
    updateFavoriteButton();

    // Bind events
    if (playButton) {
      playButton.addEventListener('click', togglePlay);
    }

    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', toggleFavorite);
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', shareCourse);
    }
  }

  // Toggle play/pause
  function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayButton();

    if (isPlaying) {
      // In a real implementation, this would load and play the video
      showToast('开始播放');
      // For demo, show playing state
      if (videoPlayer) {
        videoPlayer.innerHTML = `
          <div class="video-playing-state">
            <div class="video-playing-info">
              <span class="video-playing-badge">播放中</span>
              <p>视频加载中...</p>
            </div>
          </div>
          <style>
            .video-playing-state {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              color: #fff;
            }
            .video-playing-info {
              text-align: center;
            }
            .video-playing-badge {
              display: inline-block;
              padding: 4px 12px;
              background-color: rgba(0, 204, 102, 0.2);
              border: 1px solid #00cc66;
              border-radius: 20px;
              font-size: 12px;
              margin-bottom: 12px;
            }
            .video-playing-info p {
              margin: 0;
              opacity: 0.7;
            }
          </style>
        `;
      }
    } else {
      // Reset to placeholder
      if (videoPlayer) {
        videoPlayer.innerHTML = `
          <div class="video-player-placeholder">
            <div class="video-play-button" id="playButton">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p>点击播放视频</p>
          </div>
        `;
        // Re-bind play button
        const newPlayButton = document.getElementById('playButton');
        if (newPlayButton) {
          newPlayButton.addEventListener('click', togglePlay);
        }
      }
    }
  }

  // Update play button appearance
  function updatePlayButton() {
    const button = document.querySelector('.video-play-button');
    if (button) {
      if (isPlaying) {
        button.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        `;
      } else {
        button.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `;
      }
    }
  }

  // Toggle favorite
  function toggleFavorite() {
    isFavorited = !isFavorited;
    updateFavoriteButton();

    // Save to localStorage
    const courseId = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('courseFavorites') || '{}');
    favorites[courseId] = isFavorited;
    localStorage.setItem('courseFavorites', JSON.stringify(favorites));

    // Show feedback
    if (isFavorited) {
      showToast('收藏成功');
    } else {
      showToast('已取消收藏');
    }
  }

  // Update favorite button appearance
  function updateFavoriteButton() {
    if (favoriteBtn) {
      favoriteBtn.classList.toggle('active', isFavorited);
      const textEl = favoriteBtn.querySelector('.action-btn-text');
      if (textEl) {
        textEl.textContent = isFavorited ? '已收藏' : '收藏';
      }
      const iconEl = favoriteBtn.querySelector('.action-btn-icon');
      if (iconEl) {
        if (isFavorited) {
          iconEl.setAttribute('fill', 'currentColor');
        } else {
          iconEl.setAttribute('fill', 'none');
        }
      }
    }
  }

  // Share course
  function shareCourse() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: document.querySelector('.course-detail-title')?.textContent || '',
        url: window.location.href
      }).catch(() => {
        // User cancelled or error occurred
      });
    } else {
      copyToClipboard(window.location.href);
      showToast('链接已复制');
    }
  }

  // Copy to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.error('Failed to copy', e);
    }
    document.body.removeChild(textarea);
  }

  // Show toast message
  function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
