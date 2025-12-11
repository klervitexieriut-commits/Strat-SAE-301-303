import { getFormations, getUniqueDomains } from './recupdedonne.js';

const state = {
    allFormations: [],
    filteredFormations: [],
    selectedFilters: new Set()
};

async function loadFormations() {
    try {
        state.allFormations = await getFormations();
        state.filteredFormations = [...state.allFormations];
        console.log(`${state.allFormations.length} formations chargées`);
        return state.allFormations;
    } catch (error) {
        console.error("Erreur lors du chargement des formations :", error);
        return [];
    }
}

function createFormationCard(formation) {
    const card = document.createElement('article');
    card.className = 'formation-card';
    
    card.innerHTML = `
        <div class="formation-card-image"></div>
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

function renderFormations(formations) {
    const gridContainer = document.querySelector('.formations-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    if (formations.length === 0) {
        gridContainer.innerHTML = '<p style="width: 100%; text-align: center; padding: 20px;">Aucune formation ne correspond aux filtres sélectionnés.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    formations.forEach(formation => {
        fragment.appendChild(createFormationCard(formation));
    });

    gridContainer.appendChild(fragment);
}

function applyFilters() {
    if (state.selectedFilters.size === 0) {
        state.filteredFormations = [...state.allFormations];
    } else {
        state.filteredFormations = state.allFormations.filter(f => {
            return Array.from(state.selectedFilters).some(filter => 
                f.disci_lib && f.disci_lib.toLowerCase() === filter.toLowerCase()
            );
        });
    }
    renderFormations(state.filteredFormations);
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
        renderFormations(state.allFormations);

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
