/**
 * Home Page JavaScript
 */

(function() {
  'use strict';

  // Banner Carousel
  class BannerCarousel {
    constructor(element) {
      this.element = element;
      this.wrapper = element.querySelector('.banner-wrapper');
      this.slides = element.querySelectorAll('.banner-slide');
      this.dots = element.querySelectorAll('.dot');
      this.currentIndex = 0;
      this.autoplayInterval = null;

      this.init();
    }

    init() {
      // Auto play
      this.startAutoplay();

      // Touch/drag support
      let startX = 0;
      let currentX = 0;

      this.element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        this.stopAutoplay();
      });

      this.element.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
      });

      this.element.addEventListener('touchend', () => {
        const diff = currentX - startX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.prev();
          } else {
            this.next();
          }
        }
        this.startAutoplay();
      });
    }

    goTo(index) {
      if (index < 0) {
        index = this.slides.length - 1;
      } else if (index >= this.slides.length) {
        index = 0;
      }

      this.currentIndex = index;
      this.wrapper.style.transform = `translateX(-${index * 100}%)`;

      // Update dots
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    next() {
      this.goTo(this.currentIndex + 1);
    }

    prev() {
      this.goTo(this.currentIndex - 1);
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, 4000);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  }

  // Initialize carousel when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.banner-carousel');
    if (carousel) {
      new BannerCarousel(carousel);
    }
  });
})();
