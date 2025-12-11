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

function initializeFormationFilters() {
    const filterBtn = document.querySelector('.filter-btn');
    if (!filterBtn) return;

    filterBtn.addEventListener('click', async () => {
        try {
            const formationId = new URLSearchParams(window.location.search).get('id');
            if (!formationId) return;

            const { getFormationById } = await import('./scripts/recupdedonne.js');
            const formation = await getFormationById(formationId);

            if (!formation) return;

            const filterOptions = buildFilterOptions(formation);
            displayFilterModal(filterOptions);
        } catch (error) {
            console.error('Erreur lors du chargement des filtres :', error);
        }
    });
}

function buildFilterOptions(formation) {
    return [
        {
            label: 'Établissement',
            value: formation.eta_nom
        },
        {
            label: 'Académie',
            value: formation.acad_lib
        },
        {
            label: 'Discipline',
            value: formation.disci_lib
        }
    ];
}

function displayFilterModal(options) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Filtres de formation';
    title.style.marginTop = '0';
    content.appendChild(title);

    options.forEach(option => {
        const div = document.createElement('div');
        div.style.padding = '10px 0';
        div.innerHTML = `<strong>${option.label}:</strong> ${option.value || 'Non spécifié'}`;
        content.appendChild(div);
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fermer';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: #0D79F2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    content.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    initializeHomePageButtons();
    initializeFormationFilters();
});
