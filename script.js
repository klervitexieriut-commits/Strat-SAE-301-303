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

    // Redimensionner les graphiques lors du resize de la fenêtre
    window.addEventListener('resize', () => {
      myChart1.resize();
      myChart2.resize();
      
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