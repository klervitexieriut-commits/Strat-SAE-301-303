function calculateRate(admitted, candidates) {
    const can = parseInt(candidates || 0);
    const acc = parseInt(admitted || 0);
    if (can === 0) return 0;
    return ((acc / can) * 100).toFixed(1);
}

export async function initHistogramme(formation) {
    const chartDom = document.getElementById('chart2');
    if (!chartDom) {
        console.warn("Élément #chart2 introuvable pour l'histogramme.");
        return;
    }

    try {
        const myChart = echarts.init(chartDom);
        
        const ratePP = calculateRate(formation.n_accept_pp, formation.n_can_pp);
        const ratePC = calculateRate(formation.n_accept_pc, formation.n_can_pc);
        const rateTotal = calculateRate(
            parseInt(formation.n_accept_pp || 0) + parseInt(formation.n_accept_pc || 0),
            parseInt(formation.n_can_pp || 0) + parseInt(formation.n_can_pc || 0)
        );

        const categories = ['Phase Principale', 'Phase Complémentaire', 'Total (2024)'];
        const insertionRates = [parseFloat(ratePP), parseFloat(ratePC), parseFloat(rateTotal)];

        const option = {
            title: {
                text: 'Détail des admissions 2024',
                left: 'center',
                textStyle: { fontSize: 14 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    if (!params.length) return '';
                    return params.map(p => `${p.axisValue}: ${p.value}%`).join('<br/>');
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories,
                axisTick: { alignWithLabel: true },
                axisLabel: { interval: 0 }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: 'Taux d\'insertion',
                    type: 'bar',
                    data: insertionRates,
                    itemStyle: { color: '#5470C6' },
                    label: { show: true, position: 'top', formatter: '{c}%' }
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
