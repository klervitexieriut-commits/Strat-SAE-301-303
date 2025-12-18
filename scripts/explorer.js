import { getFormations, getUniqueDomains } from './recupdedonne.js';

const state = {
    allFormations: [],
    filteredFormations: [],
    selectedFilters: new Set(),
    currentPage: 1,
    itemsPerPage: 20,
    isLoading: false
};

async function loadFormations() {
    try {
        state.allFormations = await getFormations();
        state.filteredFormations = [...state.allFormations];
        return state.allFormations;
    } catch (error) {
        console.error("Erreur lors du chargement des formations :", error);
        return [];
    }
}

function createFormationCard(formation) {
    const card = document.createElement('article');
    card.className = 'formation-card';
    
    const logoUrl = `https://monmaster.gouv.fr/api/logo/${formation.eta_uai}`;
    
    card.innerHTML = `
        <div class="formation-card-image">
            <img src="${logoUrl}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 20px; display: none;" 
                 onload="this.style.display='block'; this.parentElement.classList.add('has-logo');" 
                 onerror="this.style.display='none'; this.parentElement.style.backgroundColor='#f0f0f0';">
        </div>
        <div class="formation-card-content">
            <h2 class="formation-card-title">${formation.mention || 'Mention inconnue'}</h2>
            <p class="formation-card-description">
                <strong>${formation.eta_nom || 'Établissement inconnu'}</strong><br>
                ${formation.acad_lib || 'Académie inconnue'}
            </p>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `formation.html?id=${formation.ifc}`;
    });

    return card;
}

async function renderFormations(formations, append = false) {
    const gridContainer = document.querySelector('.formations-grid');
    if (!gridContainer) return;

    if (!append) {
        gridContainer.innerHTML = '';
        state.currentPage = 1;
        window.scrollTo(0, 0);
    }

    if (formations.length === 0) {
        gridContainer.innerHTML = '<p style="width: 100%; text-align: center; padding: 20px;">Aucune formation ne correspond aux filtres sélectionnés.</p>';
        return;
    }

    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageFormations = formations.slice(start, end);

    const fragment = document.createDocumentFragment();
    pageFormations.forEach(formation => {
        fragment.appendChild(createFormationCard(formation));
    });

    gridContainer.appendChild(fragment);
    
    // Manage sentinel for infinite scroll
    let sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '20px';
        sentinel.style.width = '100%';
        gridContainer.parentNode.appendChild(sentinel);
        setupIntersectionObserver(sentinel);
    }
    
    // Hide sentinel if no more items
    if (end >= formations.length) {
        sentinel.style.display = 'none';
    } else {
        sentinel.style.display = 'block';
    }
}

function setupIntersectionObserver(sentinel) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !state.isLoading) {
            loadMoreFormations();
        }
    }, { rootMargin: '100px' });
    
    observer.observe(sentinel);
}

function loadMoreFormations() {
    if (state.isLoading) return;
    
    const totalPages = Math.ceil(state.filteredFormations.length / state.itemsPerPage);
    if (state.currentPage >= totalPages) return;

    state.isLoading = true;
    state.currentPage++;
    renderFormations(state.filteredFormations, true);
    state.isLoading = false;
}

async function applyFilters() {
    state.filteredFormations = state.selectedFilters.size === 0 
        ? [...state.allFormations]
        : state.allFormations.filter(f => 
            Array.from(state.selectedFilters).some(filter => 
                f.disci_lib && f.disci_lib.toLowerCase() === filter.toLowerCase()
            )
        );
    await renderFormations(state.filteredFormations);
}

async function createFilterUI() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-panel';
    filterContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100vh;
        background: white;
        border-right: 1px solid #ddd;
        padding: 20px;
        overflow-y: auto;
        z-index: 1000;
        transition: left 0.3s ease;
    `;

    try {
        const domains = await getUniqueDomains();

        const title = document.createElement('h2');
        title.textContent = 'Filtrer par domaine';
        title.style.marginTop = '0';
        filterContainer.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 20px;
            cursor: pointer;
        `;
        filterContainer.appendChild(closeBtn);

        domains.forEach(domain => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px 0;
                cursor: pointer;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = domain;
            checkbox.style.marginRight = '10px';

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    state.selectedFilters.add(domain);
                } else {
                    state.selectedFilters.delete(domain);
                }
                applyFilters();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(domain));
            filterContainer.appendChild(label);
        });

        closeBtn.addEventListener('click', () => {
            filterContainer.style.left = '-300px';
        });

        document.body.appendChild(filterContainer);

        return filterContainer;
    } catch (error) {
        console.error("Erreur lors de la création du panneau de filtres :", error);
        return filterContainer;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const scrollContainer = document.querySelector('.formations-scroll-container');
    if (!scrollContainer) return;

    let gridContainer = scrollContainer.querySelector('.formations-grid');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.className = 'formations-grid';
        scrollContainer.appendChild(gridContainer);
    }

    gridContainer.innerHTML = '<p style="text-align:center; padding: 20px; width: 100%;">Chargement des données...</p>';

    try {
        await loadFormations();
        await renderFormations(state.allFormations);

        const filterPanel = await createFilterUI();

        const floatingFilter = document.querySelector('.floating-filter');
        if (floatingFilter) {
            floatingFilter.addEventListener('click', () => {
                const isHidden = filterPanel.style.left === '-300px';
                filterPanel.style.left = isHidden ? '0' : '-300px';
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Erreur lors du chargement des données.</p>';
    }
});
