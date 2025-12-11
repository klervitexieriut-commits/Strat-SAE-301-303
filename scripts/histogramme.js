export async function initHistogramme(formation) {
    const chartDom = document.getElementById('chart2');
    if (!chartDom) {
        console.warn("Élément #chart2 introuvable pour l'histogramme.");
        return;
    }

    try {
        const myChart = echarts.init(chartDom);
        
        const candidatsPP = parseInt(formation.n_can_pp) || 0;
        const candidatsPC = parseInt(formation.n_can_pc) || 0;
        const admisPP = parseInt(formation.n_accept_pp) || 0;
        const admisPC = parseInt(formation.n_accept_pc) || 0;

        const option = {
            title: {
                text: 'Candidatures vs Admissions',
                left: 'center',
                textStyle: { fontSize: 14 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    if (!params.length) return '';
                    const phase = params[0].axisValue;
                    return params.map(p => `${p.seriesName}: ${p.value}`).join('<br/>');
                }
            },
            legend: {
                top: 'bottom',
                data: ['Candidats', 'Admis']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Phase Principale', 'Phase Complémentaire'],
                axisTick: { alignWithLabel: true }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Candidats',
                    type: 'bar',
                    data: [candidatsPP, candidatsPC],
                    itemStyle: { color: '#5470C6' },
                    label: { show: true, position: 'top' }
                },
                {
                    name: 'Admis',
                    type: 'bar',
                    data: [admisPP, admisPC],
                    itemStyle: { color: '#91CC75' },
                    label: { show: true, position: 'top' }
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', () => {
            myChart.resize();
        });
    } catch (error) {
        console.error("Erreur lors de l'initialisation de l'histogramme :", error);
        chartDom.innerHTML = "<p style='text-align: center; padding: 20px; color: #e74c3c;'>Erreur d'affichage du graphique</p>";
    }
}
