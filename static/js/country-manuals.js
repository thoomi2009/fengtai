/**
 * Country Manuals JavaScript
 */

(function() {
  'use strict';

  // DOM Elements
  const continentTabs = document.querySelectorAll('.continent-tab');
  const countryLists = document.querySelectorAll('.country-list');

  // Initialize
  function init() {
    continentTabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });
  }

  // Handle tab click
  function handleTabClick(e) {
    const tab = e.currentTarget;
    const continent = tab.dataset.continent;

    // Update active tab
    continentTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show corresponding country list
    countryLists.forEach(list => {
      if (list.dataset.continent === continent) {
        list.classList.add('active');
      } else {
        list.classList.remove('active');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
