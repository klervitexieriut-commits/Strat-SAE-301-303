export async function initCarte(formationId) {
    const iframe = document.getElementById('carte-google-maps');
    if (!iframe) {
        console.warn("Iframe #carte-google-maps introuvable.");
        return;
    }

    try {
        const { getFormationById } = await import('./recupdedonne.js');
        const formation = await getFormationById(formationId);

        if (!formation) {
            console.warn("Formation non trouvée pour la carte");
            return;
        }

        const etablissement = formation.eta_nom || '';
        const ville = formation.acad_lib || '';
        const lieux = formation.lieux || '';

        let query = '';
        if (lieux) {
            query = lieux.split(',')[0].trim();
        } else {
            query = `${etablissement} ${ville}`.trim();
        }

        query = query || 'France';

        console.log(`Mise à jour de la carte pour : ${query}`);

        const adresseEncodee = encodeURIComponent(query);
        const zoom = 14;

        iframe.src = `https://maps.google.com/maps?q=${adresseEncodee}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte :", error);
    }
}
