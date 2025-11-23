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

    // Initialisation du graphique n°1 (Nightingale)
    var chartDom1 = document.getElementById('chart1');
    var myChart1 = echarts.init(chartDom1);
    var option1;
    
    // Calcul du radius adaptatif selon la taille de l'écran
    var isMobile = window.innerWidth < 1024;
    var radiusInner = isMobile ? 25 : 30;
    var radiusOuter = isMobile ? 100 : 140;
    
    option1 = {
      legend: {
        top: 'bottom',
        padding: [15, 0, 0, 0],
        itemGap: 15,
        textStyle: {
          fontSize: 12
        }
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        },
        top: 10,
        right: 10
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [radiusInner, radiusOuter],
          center: ['50%', '42%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          label: {
            fontSize: 11,
            padding: 5
          },
          labelLine: {
            length: 12,
            length2: 8
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' }
          ]
        }
      ]
    };
    option1 && myChart1.setOption(option1);

    // Initialisation du graphique n°2 (Bar Chart)
    var chartDom2 = document.getElementById('chart2');
    var myChart2 = echarts.init(chartDom2);
    var option2;
    
    option2 = {
      grid: {
        left: '15%',
        right: '10%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: {
          fontSize: 12,
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: {
            color: '#0D79F2'
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 11
          }
        }
      ]
    };
    option2 && myChart2.setOption(option2);

    // Initialisation de la carte Leaflet (carte n°3)
    var map = L.map('carte-france', {
      center: [46.603354, 1.888334], // Centre de la France
      zoom: 6,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Positions aléatoires d'universités en France (exemples provisoires)
    var universities = [
      { lat: 48.8566, lng: 2.3522, name: "Université Paris (exemple)" },
      { lat: 45.7640, lng: 4.8357, name: "Université Lyon (exemple)" },
      { lat: 43.2965, lng: 5.3698, name: "Université Marseille (exemple)" },
      { lat: 47.2184, lng: -1.5536, name: "Université Nantes (exemple)" },
      { lat: 43.6047, lng: 1.4442, name: "Université Toulouse (exemple)" },
      { lat: 48.5734, lng: 7.7521, name: "Université Strasbourg (exemple)" },
      { lat: 44.8378, lng: -0.5792, name: "Université Bordeaux (exemple)" },
      { lat: 50.6292, lng: 3.0573, name: "Université Lille (exemple)" },
      { lat: 49.2583, lng: 4.0317, name: "Université Reims (exemple)" },
      { lat: 47.3900, lng: 0.6889, name: "Université Tours (exemple)" }
    ];

    // Icône personnalisée pour les marqueurs (couleur bleue pour matcher le design)
    var blueIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Ajouter les marqueurs sur la carte
    universities.forEach(function(uni) {
      var marker = L.marker([uni.lat, uni.lng], { icon: blueIcon }).addTo(map);
      marker.bindPopup('<b>' + uni.name + '</b>');
      
      // Afficher la popup au survol
      marker.on('mouseover', function() {
        this.openPopup();
      });
      marker.on('mouseout', function() {
        this.closePopup();
      });
    });

    // Invalider la taille de la carte après un court délai pour s'assurer qu'elle est bien rendue
    setTimeout(function() {
      map.invalidateSize();
    }, 100);

    // Redimensionner les graphiques lors du resize de la fenêtre
    window.addEventListener('resize', () => {
      myChart1.resize();
      myChart2.resize();
      map.invalidateSize();
      
      // Recalculer le radius du graphique 1 selon la nouvelle taille
      var isMobile = window.innerWidth < 1024;
      var radiusInner = isMobile ? 25 : 30;
      var radiusOuter = isMobile ? 100 : 140;
      
      myChart1.setOption({
        series: [{
          radius: [radiusInner, radiusOuter],
          center: ['50%', '42%']
        }]
      });
    });
});



// ==========================================
//  SCRIPTS POUR LA PAGE D'ACCUEIL (HOME)
// ==========================================

// Vérifier si on est sur la page d'accueil
const isHomePageAccueil = document.querySelector('.container-accueil') !== null;

if (isHomePageAccueil) {
  console.log('Page d\'accueil détectée');

  // Button interactions
  const btnPrimaryAccueil = document.querySelector('.btn-primary-accueil');
  const btnSecondaryAccueil = document.querySelector('.btn-secondary-accueil');

  if (btnPrimaryAccueil) {
    btnPrimaryAccueil.addEventListener('click', function() {
      console.log('Explorer clicked');
      // Navigation vers la page d'exploration/formations
      window.location.href = 'formation.html';
    });
  }

  if (btnSecondaryAccueil) {
    btnSecondaryAccueil.addEventListener('click', function() {
      console.log('En savoir plus clicked');
      // Navigation vers la page d'informations
      window.location.href = 'accueil.html';
    });
  }

  // Effet de parallaxe léger sur l'image hero au scroll (optionnel)
  const heroImageAccueil = document.querySelector('.hero-image-accueil');
  if (heroImageAccueil) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      heroImageAccueil.style.transform = `translateY(${rate}px)`;
    });
  }
}

// ==========================================
//  SCRIPTS POUR LA PAGE EXPLORER
// ==========================================

// Vérifier si on est sur la page explorer
const isExplorerPage = document.querySelector('.main-explorer') !== null;

if (isExplorerPage) {
  console.log('Page Explorer détectée');

  // Gestion des clics sur les cartes de formation
  const formationCards = document.querySelectorAll('.formation-card');
  
  formationCards.forEach((card) => {
    card.addEventListener('click', function() {
      const title = this.querySelector('.formation-card-title').textContent;
      console.log(`Carte cliquée: ${title}`);
      
      // Navigation vers la page formation.html
      window.location.href = 'formation.html';
    });
  });

  // Smooth scroll pour le conteneur
  const scrollContainer = document.querySelector('.formations-scroll-container');
  
  // Améliorer le scroll sur mobile avec momentum
  if (scrollContainer) {
    scrollContainer.style.webkitOverflowScrolling = 'touch';
  }
}