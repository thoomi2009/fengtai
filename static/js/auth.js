/**
 * Auth JavaScript (Login & Register)
 */

(function() {
  'use strict';

  // DOM Elements
  const authTabs = document.querySelectorAll('.auth-tab');
  const smsLoginForm = document.getElementById('smsLoginForm');
  const passwordLoginForm = document.getElementById('passwordLoginForm');
  const getCodeBtn = document.getElementById('getCodeBtn');
  const passwordToggle = document.getElementById('passwordToggle');
  const registerForm = document.getElementById('registerForm');

  // State
  let countdown = 0;
  let countdownTimer = null;

  // Initialize
  function init() {
    // Tab switching
    authTabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });

    // Get code button
    if (getCodeBtn) {
      getCodeBtn.addEventListener('click', handleGetCode);
    }

    // Password toggle
    if (passwordToggle) {
      passwordToggle.addEventListener('click', handlePasswordToggle);
    }

    // Form submissions
    if (smsLoginForm) {
      smsLoginForm.addEventListener('submit', handleSmsLogin);
    }
    if (passwordLoginForm) {
      passwordLoginForm.addEventListener('submit', handlePasswordLogin);
    }
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
  }

  // Handle tab click
  function handleTabClick(e) {
    const tab = e.currentTarget;
    const tabType = tab.dataset.tab;

    // Update active tab
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show corresponding form
    if (tabType === 'sms') {
      smsLoginForm?.classList.remove('hidden');
      passwordLoginForm?.classList.add('hidden');
    } else {
      smsLoginForm?.classList.add('hidden');
      passwordLoginForm?.classList.remove('hidden');
    }
  }

  // Handle get code
  function handleGetCode() {
    const phoneInput = getCodeBtn?.closest('.verify-code-group')?.querySelector('input[name="phone"]');
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    const phonePattern = /^1[3-9]\d{9}$/;

    if (!phone) {
      showToast('请输入手机号');
      return;
    }

    if (!phonePattern.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }

    if (countdown > 0) return;

    // Start countdown
    countdown = 60;
    getCodeBtn.disabled = true;
    getCodeBtn.textContent = `${countdown}s后重新获取`;

    countdownTimer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        getCodeBtn.disabled = false;
        getCodeBtn.textContent = '获取验证码';
      } else {
        getCodeBtn.textContent = `${countdown}s后重新获取`;
      }
    }, 1000);

    // Simulate sending code
    console.log('Sending code to:', phone);
    showToast('验证码已发送');
  }

  // Handle password toggle
  function handlePasswordToggle() {
    const toggle = passwordToggle;
    const input = toggle?.closest('.password-input-group')?.querySelector('input');

    if (input) {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.add('show-closed');
      } else {
        input.type = 'password';
        toggle.classList.remove('show-closed');
      }
    }
  }

  // Handle SMS login
  function handleSmsLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate
    if (!data.phone || !data.code) {
      showToast('请填写完整信息');
      return;
    }

    // Simulate login
    console.log('SMS Login:', data);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', data.phone);
    showToast('登录成功');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  // Handle password login
  function handlePasswordLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate
    if (!data.phone || !data.password) {
      showToast('请填写完整信息');
      return;
    }

    // Simulate login
    console.log('Password Login:', data);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', data.phone);
    showToast('登录成功');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  // Handle register
  function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate passwords match
    if (data.password !== data.confirm_password) {
      showToast('两次输入的密码不一致');
      return;
    }

    // Validate agreement
    if (!data.agree) {
      showToast('请阅读并同意用户协议');
      return;
    }

    // Simulate registration
    console.log('Register:', data);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', data.phone);
    showToast('注册成功');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
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

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
