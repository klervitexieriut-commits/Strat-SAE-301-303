import { getFormations } from './recupdedonne.js';

const academieCoordinates = {
    "Aix-Marseille": [43.5297, 5.4474],
    "Amiens": [49.8941, 2.2957],
    "Besançon": [47.2378, 6.0241],
    "Bordeaux": [44.8378, -0.5792],
    "Clermont-Ferrand": [45.7772, 3.0870],
    "Corse": [42.0396, 9.0129],
    "Créteil": [48.7904, 2.4556],
    "Dijon": [47.3220, 5.0415],
    "Grenoble": [45.1885, 5.7245],
    "Guadeloupe": [16.2650, -61.5510],
    "Guyane": [4.9372, -52.3260],
    "La Réunion": [-21.1151, 55.5364],
    "Lille": [50.6292, 3.0573],
    "Limoges": [45.8336, 1.2611],
    "Lyon": [45.7640, 4.8357],
    "Montpellier": [43.6108, 3.8767],
    "Nancy-Metz": [48.6921, 6.1844],
    "Nantes": [47.2184, -1.5536],
    "Nice": [43.7102, 7.2620],
    "Normandie": [49.4432, 1.0999], // Rouen as center
    "Nouvelle-Calédonie": [-22.2711, 166.4416],
    "Orléans-Tours": [47.9030, 1.9093], // Orléans
    "Paris": [48.8566, 2.3522],
    "Poitiers": [46.5802, 0.3404],
    "Polynésie Française": [-17.6797, -149.4068],
    "Reims": [49.2583, 4.0317],
    "Rennes": [48.1173, -1.6778],
    "Strasbourg": [48.5734, 7.7521],
    "Toulouse": [43.6047, 1.4442],
    "Versailles": [48.8049, 2.1204]
};

async function initMap() {
    const mapElement = document.getElementById('map-accueil');
    if (!mapElement) return;

    // Initialize map centered on France
    const map = L.map('map-accueil').setView([46.603354, 1.888334], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    try {
        const formations = await getFormations();
        
        // Count formations per academy
        const academyCounts = {};
        formations.forEach(f => {
            const acad = f.acad_lib;
            if (acad) {
                academyCounts[acad] = (academyCounts[acad] || 0) + 1;
            }
        });

        // Add markers
        Object.entries(academyCounts).forEach(([acad, count]) => {
            const coords = academieCoordinates[acad];
            if (coords) {
                const marker = L.marker(coords).addTo(map);
                marker.bindPopup(`
                    <b>Académie de ${acad}</b><br>
                    ${count} formations disponibles
                `);
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte d'accueil:", error);
    }
}

document.addEventListener('DOMContentLoaded', initMap);
