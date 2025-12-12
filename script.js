function initializeMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    if (!menuIcon) return;

    function updateMenuVisibility() {
        const isDesktop = window.innerWidth >= 1024;
        menuIcon.style.display = isDesktop ? 'flex' : 'none';
    }

    updateMenuVisibility();
    window.addEventListener('resize', updateMenuVisibility);

    const dropdownMenu = document.querySelector('.dropdown-menu');
    menuIcon.addEventListener('click', () => {
        dropdownMenu?.classList.toggle('active');
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownMenu?.classList.remove('active');
        });
    });
}

function initializeHomePageButtons() {
    const isHomePage = document.querySelector('.container-accueil') !== null;
    if (!isHomePage) return;

    console.log('Page d\'accueil détectée');

    const btnPrimaryAccueil = document.querySelector('.btn-primary-accueil');
    if (btnPrimaryAccueil) {
        btnPrimaryAccueil.addEventListener('click', () => {
            window.location.href = 'explorer.html';
        });
    }

    const btnSecondaryAccueil = document.querySelector('.btn-secondary-accueil');
    if (btnSecondaryAccueil) {
        btnSecondaryAccueil.addEventListener('click', () => {
            window.location.href = 'info.html';
        });
    }

    const heroImageAccueil = document.querySelector('.hero-image-accueil');
    if (heroImageAccueil) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImageAccueil.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }
}



document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    initializeHomePageButtons();
});
