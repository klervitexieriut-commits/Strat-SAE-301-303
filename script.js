 // Afficher le menu hamburger uniquement en desktop
    const menuIcon = document.querySelector('.menu-icon');
    
    function updateMenuVisibility() {
      if (window.innerWidth >= 1024) {
        menuIcon.style.display = 'flex';
      } else {
        menuIcon.style.display = 'none';
      }
    }

    updateMenuVisibility();
    window.addEventListener('resize', updateMenuVisibility);

    // Menu mobile toggle
    menuIcon.addEventListener('click', () => {
      alert('Menu à implémenter');
    });

    // Bouton filtre flottant
    const floatingFilter = document.querySelector('.floating-filter');
    floatingFilter.addEventListener('click', () => {
      alert('Panneau de filtres à implémenter');
    });