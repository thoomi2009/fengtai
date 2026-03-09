/**
 * Services Page JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const consultModal = document.getElementById('consultModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = consultModal?.querySelector('.modal-overlay');
  const consultForm = document.getElementById('consultForm');
  const categorySelect = document.getElementById('categorySelect');
  const consultBtns = document.querySelectorAll('.consult-btn');
  const categoryItems = document.querySelectorAll('.category-item');

  // Category names mapping
  const categoryNames = {
    'legal': '法律服务',
    'translation': '翻译服务',
    'talent': '人才服务',
    'exhibition': '展会服务',
    'promotion': '推广服务',
    'logistics': '物流服务',
    'warehouse': '仓储服务',
    'customs': '通关服务',
    'finance': '金融服务',
    'certification': '认证服务',
    'ip': '知识产权服务',
    'analysis': '经营分析服务'
  };

  // Initialize
  function init() {
    // Get current category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category') || 'legal';

    // Set active category
    setActiveCategory(currentCategory);

    // Bind events
    bindEvents();
  }

  // Bind events
  function bindEvents() {
    // Category items
    categoryItems.forEach(item => {
      item.addEventListener('click', handleCategoryClick);
    });

    // Consult buttons
    consultBtns.forEach(btn => {
      btn.addEventListener('click', handleConsultClick);
    });

    // Modal close
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Form submit
    if (consultForm) {
      consultForm.addEventListener('submit', handleFormSubmit);
    }
  }

  // Set active category
  function setActiveCategory(category) {
    categoryItems.forEach(item => {
      const itemCategory = item.dataset.category;
      item.classList.toggle('active', itemCategory === category);
    });

    // Update content title
    const contentTitle = document.querySelector('.content-title');
    const contentDesc = document.querySelector('.content-desc');

    if (contentTitle) {
      contentTitle.textContent = categoryNames[category] || '出海服务';
    }

    // Update select in form
    if (categorySelect) {
      categorySelect.value = category;
    }
  }

  // Handle category click
  function handleCategoryClick(e) {
    e.preventDefault();
    const item = e.currentTarget;
    const category = item.dataset.category;
    setActiveCategory(category);
  }

  // Handle consult button click
  function handleConsultClick(e) {
    const btn = e.currentTarget;
    const category = btn.dataset.category;

    // Set category in select
    if (categorySelect) {
      categorySelect.value = category;
    }

    // Open modal
    openModal();
  }

  // Open modal
  function openModal() {
    if (consultModal) {
      consultModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal
  function closeModal() {
    if (consultModal) {
      consultModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // Handle form submit
  function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(consultForm);
    const data = Object.fromEntries(formData.entries());

    // Validate phone number
    const phonePattern = /^1[3-9]\d{9}$/;
    if (!phonePattern.test(data.contact_phone)) {
      showToast('请输入正确的手机号码');
      return;
    }

    // Simulate API call
    console.log('Submitting consultation:', data);

    // Show success message
    showToast('咨询提交成功，我们会尽快与您联系');

    // Close modal
    closeModal();

    // Reset form
    if (consultForm) {
      consultForm.reset();
    }
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
