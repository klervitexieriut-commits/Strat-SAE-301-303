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
        const f = stats.data;

        const canPPH = parseInt(f.n_can_pp || 0) - parseInt(f.n_can_femme_pp || 0);
        const canPPF = parseInt(f.n_can_femme_pp || 0);
        const canPCH = parseInt(f.n_can_pc || 0) - parseInt(f.n_can_femme_pc || 0);
        const canPCF = parseInt(f.n_can_femme_pc || 0);

        const chartData = [
            { value: canPPH, name: 'Phase Principale (Hommes)' },
            { value: canPPF, name: 'Phase Principale (Femmes)' },
            { value: canPCH, name: 'Phase Complémentaire (Hommes)' },
            { value: canPCF, name: 'Phase Complémentaire (Femmes)' }
        ].filter(d => d.value > 0);

        const option = {
            title: {
                text: `Capacité : ${f.col || 'N/A'} places`,
                subtext: `Dernier admis - Phase Principale: ${f.rang_dernier_appele_pp || 'N/A'} | Phase Complémentaire: ${f.rang_dernier_appele_pc || 'N/A'}`,
                left: 'center',
                top: 0,
                textStyle: { fontSize: 16, fontWeight: 'bold' },
                subtextStyle: { fontSize: 12, color: '#666' }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} candidats ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: '0%',
                left: 'center',
                textStyle: { fontSize: 10 }
            },
            series: [
                {
                    name: 'Répartition des candidats',
                    type: 'pie',
                    radius: ['35%', '65%'],
                    center: ['50%', '48%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    data: chartData,
                    color: ['#5470C6', '#EE6666', '#73C0DE', '#FAC858']
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
