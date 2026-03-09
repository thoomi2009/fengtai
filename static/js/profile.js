/**
 * Profile JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const loggedInProfile = document.getElementById('loggedInProfile');
  const loginPrompt = document.getElementById('loginPrompt');
  const logoutSection = document.getElementById('logoutSection');
  const logoutBtn = document.getElementById('logoutBtn');

  // Initialize
  function init() {
    // Check login status
    updateUI();

    // Bind events
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  // Update UI based on login status
  function updateUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      loggedInProfile?.classList.remove('hidden');
      loginPrompt?.classList.add('hidden');
      logoutSection?.classList.remove('hidden');

      // Update phone number
      const userPhone = localStorage.getItem('userPhone');
      if (userPhone) {
        const phoneEl = loggedInProfile?.querySelector('.profile-phone');
        if (phoneEl) {
          phoneEl.textContent = userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
      }
    } else {
      loggedInProfile?.classList.add('hidden');
      loginPrompt?.classList.remove('hidden');
      logoutSection?.classList.add('hidden');
    }
  }

  // Handle logout
  function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userPhone');
      showToast('已退出登录');
      updateUI();
    }
  }

  // Show toast
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
