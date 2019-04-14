(async function() {
const dataAPI = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=RZAKLTBRRL1GTCLH';

const chartData = transformDataToSeries(await fetchData(dataAPI));
const defaultThreshold = Math.round(chartData.reduce((sum, point) => {return sum+point.y}, 0)/chartData.length);
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
        xAxis: {
            labels: {
                formatter: function() {
                    return new Date(this.value).toDateString()
                }
            }
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
                //pointStart: new Date('2019-04-12 16:00:00'),
                //pointInterval: 5*60*1000, // 5 minutes
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
            name: 'Stock prices',
            data: chartData
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

function transformDataToSeries(data) {
    const dataMap = data["Time Series (Daily)"];
    const series = [];
    for (let xValue in dataMap) {
        const dateMillis = Date.parse(xValue);
        series.push({
            x: Date.parse(xValue), 
            y: Number(dataMap[xValue]["5. volume"])
        });
    }

    return series
}

})();