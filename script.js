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

    // Initialisation du graphique ECharts
    var chartDom = document.getElementById('chart1');
    var myChart = echarts.init(chartDom);
    var option;
    
    // Calcul du radius adaptatif selon la taille de l'écran
    var isMobile = window.innerWidth < 1024;
    var radiusInner = isMobile ? 30 : 40;
    var radiusOuter = isMobile ? 120 : 180;
    
    option = {
      legend: {
        top: 'bottom',
        padding: [10, 0, 0, 0],
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
          center: ['50%', '45%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          label: {
            fontSize: 11,
            padding: 5
          },
          labelLine: {
            length: 15,
            length2: 10
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
    option && myChart.setOption(option);

    // Redimensionner le graphique lors du resize de la fenêtre
    window.addEventListener('resize', () => {
      myChart.resize();
      
      // Recalculer le radius selon la nouvelle taille
      var isMobile = window.innerWidth < 1024;
      var radiusInner = isMobile ? 30 : 40;
      var radiusOuter = isMobile ? 120 : 180;
      
      myChart.setOption({
        series: [{
          radius: [radiusInner, radiusOuter]
        }]
      });
    });
});