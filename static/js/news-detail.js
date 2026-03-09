/**
 * News Detail Page JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const favoriteBtn = document.getElementById('favoriteBtn');
  const shareBtn = document.getElementById('shareBtn');

  // State
  let isFavorited = false;

  // Initialize
  function init() {
    // Check if article is already favorited (from localStorage)
    const articleId = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    isFavorited = favorites[articleId] || false;
    updateFavoriteButton();

    // Bind events
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', toggleFavorite);
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', shareArticle);
    }
  }

  // Toggle favorite
  function toggleFavorite() {
    isFavorited = !isFavorited;
    updateFavoriteButton();

    // Save to localStorage
    const articleId = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    favorites[articleId] = isFavorited;
    localStorage.setItem('favorites', JSON.stringify(favorites));

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

  // Share article
  function shareArticle() {
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: document.querySelector('.article-title')?.textContent || '',
        url: window.location.href
      }).catch(() => {
        // User cancelled or error occurred
      });
    } else {
      // Fallback: copy link to clipboard
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
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove after delay
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
