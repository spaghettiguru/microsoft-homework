(function() {
const defaultThreshold = 100000;
const thresholdInput = document.getElementById('thresholdInput');
thresholdInput.value = defaultThreshold;
thresholdInput.addEventListener('input', (e) => {
    const newThreshold = e.target.value;
    chart.update({
        yAxis: {
            plotLines: [{
                color: 'gray', // Color value
                dashStyle: 'LongDash', // Style of the plot line. Default to solid
                value: newThreshold, // Value of where the line will appear
                width: 3, // Width of the line 
                zIndex: 1
            }]
        },
        plotOptions: {
            series: {
                zones: [
                        {
                            value: newThreshold,
                            color: 'rgb(124, 181, 236)'
                        },
                        {
                            color: 'red'
                        }
                ]
            }
        }
    });
});

const chart = Highcharts.chart('chart', {

    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        },
        plotLines: [{
            color: 'gray', // Color value
            dashStyle: 'LongDash', // Style of the plot line. Default to solid
            value: defaultThreshold, // Value of where the line will appear
            width: 3, // Width of the line 
            zIndex: 1   
          }]
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010,
            zones: [
                {
                    value: defaultThreshold,
                    color: 'rgb(124, 181, 236)'
                },
                {
                    color: 'red'
                }]
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

})();