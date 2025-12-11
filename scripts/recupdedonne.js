let donneesCache = null;

async function chargerDonnees() {
    if (donneesCache) {
        return donneesCache;
    }

    try {
        const response = await fetch('./base-de-donnee/fr-esr-mon_master.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        donneesCache = await response.json();
        console.log(`${donneesCache.length} formations chargées.`);
        return donneesCache;
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        return [];
    }
}

export async function getFormations(limit = null) {
    const data = await chargerDonnees();
    return limit ? data.slice(0, limit) : data;
}

export async function getFormationById(id) {
    const data = await chargerDonnees();
    return data.find(f => f.ifc === id) || null;
}

export async function searchFormations(query, limit = 50) {
    const data = await chargerDonnees();
    const lowerQuery = query.toLowerCase();
    return data
        .filter(f => 
            (f.mention && f.mention.toLowerCase().includes(lowerQuery)) ||
            (f.eta_nom && f.eta_nom.toLowerCase().includes(lowerQuery)) ||
            (f.parcours && f.parcours.toLowerCase().includes(lowerQuery))
        )
        .slice(0, limit);
}

export async function getFormationsByDomain(domain) {
    const data = await chargerDonnees();
    return data.filter(f => 
        f.disci_lib && f.disci_lib.toLowerCase() === domain.toLowerCase()
    );
}

export async function getUniqueDomains() {
    const data = await chargerDonnees();
    return [...new Set(
        data
            .map(f => f.disci_lib)
            .filter(Boolean)
    )].sort();
}

export async function getFormationStats(id) {
    try {
        const formation = await getFormationById(id);
        if (!formation) return null;

        const nbCandidats = parseInt(formation.n_can_pp || 0) + parseInt(formation.n_can_pc || 0);
        const nbAdmis = parseInt(formation.n_accept_pp || 0) + parseInt(formation.n_accept_pc || 0);
        const tauxAcceptation = nbCandidats > 0 ? ((nbAdmis / nbCandidats) * 100).toFixed(2) : 0;

        return {
            id: formation.ifc,
            mention: formation.mention,
            nbCandidats,
            nbAdmis,
            tauxAcceptation,
            data: formation
        };
    } catch (error) {
        console.error("Erreur lors du calcul des statistiques :", error);
        return null;
    }
}

export async function getAllFormationsStats() {
    try {
        const formations = await getFormations();
        return formations.map(f => {
            const nbCandidats = parseInt(f.n_can_pp || 0) + parseInt(f.n_can_pc || 0);
            const nbAdmis = parseInt(f.n_accept_pp || 0) + parseInt(f.n_accept_pc || 0);
            const tauxAcceptation = nbCandidats > 0 ? ((nbAdmis / nbCandidats) * 100).toFixed(2) : 0;
            return {
                id: f.ifc,
                mention: f.mention,
                etablissement: f.eta_nom,
                academie: f.acad_lib,
                nbCandidats,
                nbAdmis,
                tauxAcceptation
            };
        });
    } catch (error) {
        console.error("Erreur lors du calcul des stats globales :", error);
        return [];
    }
}
