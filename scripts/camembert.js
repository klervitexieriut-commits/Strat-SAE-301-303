export async function initCamembert(formationId) {
    const chartDom = document.getElementById('chart1');
    if (!chartDom) return;

    try {
        const { getFormationStats } = await import('./recupdedonne.js');
        const stats = await getFormationStats(formationId);
        
        if (!stats) {
            chartDom.innerHTML = '<p style="text-align: center; padding: 20px;">Données non disponibles</p>';
            return;
        }

        const myChart = echarts.init(chartDom);
        const { nbCandidats, nbAdmis } = stats;

        const chartData = [
            { value: nbAdmis, name: 'Admis' },
            { value: nbCandidats - nbAdmis, name: 'Non Admis' }
        ];

        const isMobile = window.innerWidth < 1024;
        const radiusInner = isMobile ? 25 : 30;
        const radiusOuter = isMobile ? 80 : 100;

        const option = {
            title: {
                text: 'Candidats vs Admis',
                left: 'center',
                top: 0,
                textStyle: { fontSize: 14 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)'
            },
            legend: {
                top: 'bottom'
            },
            series: [
                {
                    name: 'Candidatures',
                    type: 'pie',
                    radius: [radiusInner, radiusOuter],
                    center: ['50%', '50%'],
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: chartData,
                    color: ['#91CC75', '#EE6666']
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', () => {
            myChart.resize();
        });
    } catch (error) {
        console.error("Erreur lors de l'initialisation du camembert :", error);
        chartDom.innerHTML = '<p style="text-align: center; padding: 20px; color: #e74c3c;">Erreur d\'affichage du graphique</p>';
    }
}
