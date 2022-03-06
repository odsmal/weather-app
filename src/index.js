//npx webpack --watch
//use tree shaking when more charts are done
//linje med annan färg för vind
//dimensionera för rätt skärmtyp, 16:9? Pixlar?
//väder på varje temppunkt
import Chart from 'chart.js/auto';

class BarLineChart {
  constructor(ctx) {
    this.buildChart(ctx);
  }

  buildChart(ctx) {
    this.chart = new Chart(ctx, {
      data: {
        labels: this.getLabels(),
        datasets: this.getDatasets(),
      },
      options: this.getOptions(),
    });
  }

  updateData(hours, precipitation, temps) {
    console.log('hi');
    this.chart.data.labels = hours;
    this.chart.data.datasets[0].data = precipitation;
    this.chart.data.datasets[1].data = temps;
    this.chart.update();
  }

  getDatasets() {
    return [
      {
        type: 'bar',
        // label: '# of Votes',
        // data: this.precipitation,
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        yAxisID: 'y2',
      },
      {
        type: 'line',
        tension: 0.4,
        fill: true,
        // label: '# of Votes',
        // data: this.temps,
        // backgroundColor: ['rgba(54, 162, 235, 0.2)'],
        // borderColor: ['rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        yAxisID: 'y',
        segment: {
          borderColor: (ctx) => (ctx.p0.parsed.y > 0 ? 'red' : 'blue'),
          backgroundColor: (ctx) => (ctx.p0.parsed.y > 0 ? 'red' : 'blue'),
        },
      },
    ];
  }

  getLabels() {
    return this.hours;
  }

  getOptions() {
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: -15,
          max: 35,
          type: 'linear',
          position: 'left',
          ticks: {
            color: 'black',
            beginAtZero: true,
          },
        },
        y2: {
          max: 20,
          type: 'linear',
          position: 'right',
          ticks: {
            color: 'blue',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  }
}

class DisplayController {
  getChartEl() {
    return document.getElementById('chart');
  }
}

class WeatherData {
  async fetchJson(url) {
    //   const res = await fetch(
    //     ' https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.6320/lat/59.8471/data.json',
    //     { mode: 'cors' }
    //   );
    //   console.log(res);
    //   const json = await res.json();
    const json = require('./data2.json');
    return json;
  }

  getData(json) {
    const temps = [];
    const precipitation = [];
    const hours = [];
    let h = parseInt(json.properties.timeseries[0].time.slice(11, 13)) + 1;
    for (let i = 0; i < 12; i++) {
      temps.push(
        json.properties.timeseries[i].data.instant.details.air_temperature
      );
      precipitation.push(
        json.properties.timeseries[i].data.next_1_hours.details
          .precipitation_amount
      );
      hours.push((h + i) % 24);
    }
    return { temps, precipitation, hours };
  }
}

class Main {
  constructor() {
    const displayController = new DisplayController();
    const chart = new BarLineChart(displayController.getChartEl());
    this.updateChart(chart);
  }

  async updateChart(chart) {
    const weatherData = new WeatherData();
    const json = await weatherData.fetchJson();
    const data = weatherData.getData(json);
    chart.updateData(data.hours, data.precipitation, data.temps);
    setInterval(
      chart.updateData.bind(chart, data.hours, data.precipitation, data.temps),
      5000
    );
  }
}

const main = new Main();

// const buildGraph = (data) => {
//   const ctx = getEl('myChart');
//   new Chart(ctx, {
//     data: {
//       labels: getLabels(data),
//       datasets: getDatasets(data, ctx),
//     },
//     options: getOptions(),
//   });
// };

// const getDatasets = (data) => {
//   const datasets = [
//     {
//       type: 'bar',
//       // label: '# of Votes',
//       data: data.precipitation,
//       backgroundColor: ['rgba(54, 162, 235, 0.2)'],
//       borderColor: ['rgba(54, 162, 235, 1)'],
//       borderWidth: 1,
//       yAxisID: 'y2',
//     },
//     {
//       type: 'line',
//       tension: 0.4,
//       fill: true,
//       // label: '# of Votes',
//       data: data.temps,
//       // backgroundColor: ['rgba(54, 162, 235, 0.2)'],
//       // borderColor: ['rgba(54, 162, 235, 1)'],
//       borderWidth: 1,
//       yAxisID: 'y',
//       segment: {
//         borderColor: (ctx) => (ctx.p0.parsed.y > 0 ? 'red' : 'blue'),
//         backgroundColor: (ctx) => (ctx.p0.parsed.y > 0 ? 'red' : 'blue'),
//       },
//     },
//   ];
//   return datasets;
// };

// const getEl = (str) => {
//   return document.getElementById(`${str}`);
// };

// const getLabels = (data) => {
//   return data.hours;
// };

// const getOptions = () => {
//   const options = {
//     responsive: true,
//     plugins: { legend: { display: false } },
//     scales: {
//       y: {
//         min: -15,
//         max: 35,
//         type: 'linear',
//         position: 'left',
//         ticks: {
//           color: 'black',
//           beginAtZero: true,
//         },
//       },
//       y2: {
//         max: 20,
//         type: 'linear',
//         position: 'right',
//         // reverse: true,
//         ticks: {
//           color: 'blue',
//         },
//         grid: {
//           drawOnChartArea: false,
//         },
//       },
//     },
//   };
//   return options;
// };

// const fetchJson = async () => {
//   //   const arr = [];
//   //   console.log(h);
//   //   const res = await fetch(
//   //     ' https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.6320/lat/59.8471/data.json',
//   //     { mode: 'cors' }
//   //   );
//   //   console.log(res);
//   //   const json = await res.json();
//   const json = require('./data2.json');
//   return json;
// };

// const getData = (json) => {
//   console.log(json);
//   const temps = [];
//   const precipitation = [];
//   const hours = [];
//   let h = parseInt(json.properties.timeseries[0].time.slice(11, 13)) + 1;

//   for (let i = 0; i < 12; i++) {
//     temps.push(
//       json.properties.timeseries[i].data.instant.details.air_temperature
//     );
//     precipitation.push(
//       json.properties.timeseries[i].data.next_1_hours.details
//         .precipitation_amount
//     );
//     hours.push((h + i) % 24);
//     // arr.push({
//     //   x: json.properties.timeseries[i].data.instant.details.air_temperature,
//     //   y: (h + i) % 24,
//     // });
//   }
//   //   console.log(airTemp);
//   //   console.log(hours);
//   // console.log(arr);
//   return { temps, precipitation, hours };
// };

// const main = async () => {
//   const json = await fetchJson();
//   const data = getData(json);
//   buildGraph(data);
// };

// main();

// const fetchJson = async () => {
//   try {
//     const url = `http://api.temperatur.nu/tnu_1.16b.php?lat=58.376761&lon=15.562916&num=2&graph&cli=test_app2`;
//     const response = await fetch(url, { mode: 'cors' });
//     const data = await response.json();
//     const { stations } = data;

//     console.log(data);
//     console.log(stations);
//     console.log(Object.keys(data));
//     console.log(Object.entries(stations));
//     console.log(Object.values(stations));
//     console.log(Object.values(stations)[0]);
//     console.log(Object.values(stations)[0].temp);
//     console.log(data);
//     console.log(Object.values(data));
//     console.log(Object.values(data)[2]);
//     // console.log(Object.keys(data));
//   } catch (err) {
//     console.log(err);
//   }
// };
// fetchJson();
