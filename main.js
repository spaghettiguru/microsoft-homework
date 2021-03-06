(async function() {
const dataAPI = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=RZAKLTBRRL1GTCLH';

/* find DOM elements and set up event listeners */
const thresholdInput = document.getElementById('thresholdInput');
thresholdInput.addEventListener('input', (e) => {
    setThreshold(chart, Number(e.target.value));
});
const numDataPointsInput = document.getElementById('numDataPointsInput');
numDataPointsInput.addEventListener('input', (e) => {
    setNumberOfDataPoints(chart, Number(e.target.value));
});
const maxDataPointsLabel = document.getElementById('maxDataPoints');



const chart = initChart('chart');
chart.showLoading();

let apiResponse;
try {
    apiResponse = await fetchData(dataAPI);
} catch(error) {

    // strange specifics of the Highcharts library:
    // hide no data message first - then show custom message,
    // otherwise the custom message is not shown.
    chart.hideNoData();
    chart.showNoData(error.message);
    return;
} finally {
    chart.hideLoading();
}

const chartSeries = transformDataToSeries(apiResponse);
const numDataPoints = chartSeries[0].data.length;

const defaultThreshold = Math.round(chartSeries[0].data.reduce(
    (sum, point) => {return sum+point.y}
    , 0) / chartSeries[0].data.length);

// copy series, so that we keep the original data points in case
// user will want to increase the number of points after he/she decreased it
const chartSeriesCopy = chartSeries.map(serie => Object.assign({}, serie));
chartSeriesCopy[0].data = chartSeries[0].data.slice(numDataPoints < chartSeries[0].data.length ? -numDataPoints : 0);

setChartData(chart, chartSeriesCopy);
setThreshold(chart, defaultThreshold);

const yAxisExtremes = chart.yAxis[0].getExtremes();

/* initialize DOM values */
thresholdInput.value = defaultThreshold;
thresholdInput.min = Math.round(yAxisExtremes.min);
thresholdInput.max = Math.round(yAxisExtremes.max);
numDataPointsInput.value = numDataPoints;
numDataPointsInput.min = 1;
numDataPointsInput.max = chartSeries[0].data.length;
maxDataPointsLabel.textContent = numDataPointsInput.max;



function initChart(containerID) {
    return Highcharts.chart(containerID, {

        title: {
            text: 'Daily stock price changes for Microsoft (MSFT)'
        },
    
        subtitle: {
            text: 'Source: www.alphavantage.co'
        },

        lang: {
            noData: ''
        },
    
        yAxis: {
            title: {
                text: 'Price'
            },
            plotLines: [{
                color: 'gray',
                dashStyle: 'LongDash',
                value: 0,
                width: 3,
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
                zones: [
                    {
                        value: 0,
                        color: 'rgb(124, 181, 236)'
                    },
                    {
                        color: 'red'
                    }]
            }
        },
    
        series: [],
    
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

function setChartData(chart, series) {
    series.forEach(serie => chart.addSeries(serie));
}

function setThreshold(chart, thresholdValue) {
    chart.update({
        yAxis: {
            plotLines: [{
                color: 'gray',
                dashStyle: 'LongDash',
                value: thresholdValue,
                width: 3, 
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

function setNumberOfDataPoints(chart, numDataPoints) {
    const series = chart.series[0];
    series.setData(chartSeries[0].data.slice(-numDataPoints));
}

async function fetchData(url) {
    let response;
    try {
        response = await fetch(url);
        if (!response.ok) {

            // since fetch only rejects in case of network errors
            // we have to throw an error ourselves in case response status is not OK
            throw new Error('Server error.')
        }
    } catch (error) {
        const errorMessage = 'Failed to get data from server';
        console.error(errorMessage + ': ', error);
        throw new Error(errorMessage)
    }

    let chartData;
    try {
        chartData = await response.json();
    } catch(error) {
        const errorMessage = 'Failed to parse server response';
        console.error(errorMessage + ': ', error);
        throw new Error(errorMessage)
    }
    
    return chartData
}

function transformDataToSeries(data) {
    const dataMap = data["Time Series (Daily)"];
    const series = [{
        id: 'close',
        name: 'Close price',
        data: []
    }];

    for (let dateStr in dataMap) {
        series[0].data.push({
            x: Date.parse(dateStr), 
            y: Number(dataMap[dateStr]["4. close"]),
            name: new Date(dateStr).toDateString()
        });
    }

    // Highcharts requires series data points to be sorted by X values
    series[0].data.sort((a, b) => a.x - b.x)

    return series
}

})();