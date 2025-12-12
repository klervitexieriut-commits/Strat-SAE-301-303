import { getFormationById } from './recupdedonne.js';
import { initCamembert } from './camembert.js';
import { initHistogramme } from './histogramme.js';
import { initCarte } from './carteinteractive.js';

function getFormationIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function buildFormationDescription(formation) {
    const candidatsTotal = parseInt(formation.n_can_pp || 0) + parseInt(formation.n_can_pc || 0);
    const admisTotal = parseInt(formation.n_accept_pp || 0) + parseInt(formation.n_accept_pc || 0);
    const tauxAcceptation = candidatsTotal > 0 ? ((admisTotal / candidatsTotal) * 100).toFixed(1) : 0;

    return `
        <strong>Établissement :</strong> ${formation.eta_nom || 'Non spécifié'}<br>
        <strong>Académie :</strong> ${formation.acad_lib || 'Non spécifié'}<br>
        <strong>Parcours :</strong> ${formation.parcours || 'Non spécifié'}<br>
        <strong>Discipline :</strong> ${formation.disci_lib || 'Non spécifié'}<br>
        <strong>Secteur :</strong> ${formation.secteur_disci_lib || 'Non spécifié'}<br>
        <br>
        <strong>Statistiques :</strong><br>
        Candidatures totales : ${candidatsTotal}<br>
        Admissions totales : ${admisTotal}<br>
        Taux d'acceptation : ${tauxAcceptation}%
    `;
}

function generateDynamicFilters(formation) {
    const filtersContainer = document.getElementById('dynamicFilters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = '';

    const filters = [
        formation.eta_nom,
        formation.acad_lib,
        formation.disci_lib
    ].filter(f => f);

    filters.forEach((filter, index) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = filter;
        btn.addEventListener('click', () => {
            handleFilterClick(filter);
        });
        filtersContainer.appendChild(btn);
    });
}

function handleFilterClick(filterValue) {
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
    `;

    const title = document.createElement('h2');
    title.textContent = 'Détail du filtre';
    title.style.marginTop = '0';
    content.appendChild(title);

    const info = document.createElement('p');
    info.textContent = filterValue;
    info.style.fontSize = '16px';
    content.appendChild(info);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fermer';
    closeBtn.style.cssText = `
        padding: 10px 20px;
        background: #0D79F2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    `;
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    content.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);
}

function updateFormationContent(formation) {
    const titleEl = document.querySelector('.formation-title');
    if (titleEl) {
        titleEl.textContent = formation.mention || 'Formation sans titre';
    }

    const descEl = document.querySelector('.formation-description');
    if (descEl) {
        descEl.innerHTML = buildFormationDescription(formation);
    }

    generateDynamicFilters(formation);
}

function displayError(message) {
    const mainCard = document.querySelector('.main-card');
    if (mainCard) {
        mainCard.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e74c3c;">
                <h2>Oups !</h2>
                <p>${message}</p>
                <a href="explorer.html" class="btn-primary-accueil" style="display:inline-block; margin-top:20px; text-decoration:none; color:white; background:#0D79F2; padding:10px 20px; border-radius:5px;">Retour au catalogue</a>
            </div>
        `;
    }
}

async function initializeFormationPage() {
    const mainCard = document.querySelector('.main-card');
    if (!mainCard) return;

    try {
        const formationId = getFormationIdFromURL();
        if (!formationId) {
            throw new Error("Aucun identifiant de formation fourni.");
        }

        console.log(`Chargement de la formation ${formationId}...`);

        const formation = await getFormationById(formationId);
        if (!formation) {
            throw new Error("Formation introuvable.");
        }

        updateFormationContent(formation);

        await Promise.all([
            initCamembert(formationId),
            initHistogramme(formation),
            initCarte(formationId)
        ]);

        console.log("Page de formation initialisée avec succès");
    } catch (error) {
        console.error("Erreur critique :", error);
        displayError(error.message);
    }
}

document.addEventListener('DOMContentLoaded', initializeFormationPage);
