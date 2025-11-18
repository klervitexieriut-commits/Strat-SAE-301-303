 document.addEventListener('DOMContentLoaded', () => {
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

    // Menu desktop toggle
    const dropdownMenu = document.querySelector('.dropdown-menu');
    menuIcon.addEventListener('click', () => {
      dropdownMenu.classList.toggle('active');
    });

    // Fermer le menu en cliquant sur un item
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
      });
    });

    // Bouton filtre flottant
    const floatingFilter = document.querySelector('.floating-filter');
    floatingFilter.addEventListener('click', () => {
      alert('Panneau de filtres à implémenter');
    });
});