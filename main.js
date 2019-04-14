(function() {
const dataAPI = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo';
const defaultThreshold = 100000;

const chart = initChart('chart');

const thresholdInput = document.getElementById('thresholdInput');
thresholdInput.value = defaultThreshold;
thresholdInput.addEventListener('input', (e) => {
    setThreshold(chart, e.target.value);
});

function initChart(containerID) {
    return Highcharts.chart(containerID, {

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
    
    })
}

function setThreshold(chart, thresholdValue) {
    chart.update({
        yAxis: {
            plotLines: [{
                color: 'gray', // Color value
                dashStyle: 'LongDash', // Style of the plot line. Default to solid
                value: thresholdValue, // Value of where the line will appear
                width: 3, // Width of the line 
                zIndex: 1
            }]
        },
        plotOptions: {
            series: {
                zones: [
                        {
                            value: thresholdValue,
                            color: 'rgb(124, 181, 236)'
                        },
                        {
                            color: 'red'
                        }
                ]
            }
        }
    });
}

async function fetchData(url) {
    let response;
    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error('Server error.')
        }
    } catch (error) {
        response = null;
    }

    let chartData;
    if (response) {
        try {
            chartData = await response.json();
        } catch(error) {
            chartData = null;
        }
    }
    
    return chartData
}

})();