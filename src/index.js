//npx webpack --watch
//use tree shaking when more charts are done
//dimensionera för rätt skärmtyp, 16:9? Pixlar?
import Chart from 'chart.js/auto';
import images from './images';

class BarLineChart {
  constructor(ctx) {
    this.buildChart(ctx);
  }

  buildChart(ctx) {
    this.chart = new Chart(ctx, {
      data: {
        datasets: this.getDatasets(),
      },
      options: this.getOptions(),
    });
  }

  updateData(
    hour,
    temp,
    precipitation,
    wind,
    airPressure,
    weatherImg,
    windArrow,
    windDirection
  ) {
    console.log(windDirection);
    this.chart.data.labels = hour;
    this.chart.data.datasets[0].data = temp;
    this.chart.data.datasets[0].pointStyle = weatherImg;
    this.chart.data.datasets[1].data = precipitation;
    this.chart.data.datasets[2].data = wind;
    this.chart.data.datasets[2].pointStyle = windArrow;
    this.chart.data.datasets[2].pointRotation = windDirection;
    this.chart.data.datasets[3].data = airPressure;
    this.chart.update();
  }

  getDatasets() {
    return [
      {
        //temp
        order: 2,
        type: 'line',
        pointRadius: 0.1,
        tension: 0.4,
        fill: true,
        borderWidth: 0,
        yAxisID: 'y',
        segment: {
          backgroundColor: (ctx) =>
            ctx.p0.parsed.y > 0
              ? 'rgba(360, 63, 73, 0.5)'
              : 'rgba(141, 166, 229, 0.5)',
        },
      },
      {
        //precipitation
        order: 1,
        type: 'bar',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        borderWidth: 0,
        yAxisID: 'y2',
      },
      {
        //wind
        order: 3,
        type: 'line',
        pointRadius: 0.1,
        tension: 0.4,
        yAxisID: 'y',
        segment: {
          borderColor: 'rgba(141, 229, 166, 0.5)',
        },
      },
      {
        //airPressure
        order: 4,
        type: 'line',
        pointRadius: 0,
        tension: 0.4,
        borderDash: [5, 5],
        yAxisID: 'y3',
        segment: {
          borderColor: 'rgba(197, 201, 198, 0.9)',
        },
      },
    ];
  }

  getOptions() {
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          //temp & wind
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
          //precipitation
          min: 0,
          max: 16,
          type: 'linear',
          position: 'right',
          ticks: {
            color: 'rgba(54, 162, 235, 0.8)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        y3: {
          //airPressure
          type: 'linear',
          position: 'right',
          ticks: {
            color: 'rgba(197, 201, 198, 1)',
            stepSize: 5,
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
    // const res = await fetch(
    //   ' https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.6320/lat/59.8471/data.json',
    //   { mode: 'cors' }
    // );
    // const json = await res.json();
    const json = require('./data2.json');
    return json;
  }

  getData(json) {
    console.log(json);
    const hour = [];
    const temp = [];
    const precipitation = [];
    const wind = [];
    const airPressure = [];
    const weatherImg = [];
    const windArrow = [];
    const windDirection = [];
    for (let i = 0; i < 12; i++) {
      //add +1h for UTC
      hour.push(parseInt(json.properties.timeseries[i].time.slice(11, 13)) + 1);
      temp.push(
        json.properties.timeseries[i].data.instant.details.air_temperature
      );
      precipitation.push(
        json.properties.timeseries[i].data.next_1_hours.details
          .precipitation_amount
      );
      wind.push(json.properties.timeseries[i].data.instant.details.wind_speed);
      airPressure.push(
        json.properties.timeseries[i].data.instant.details
          .air_pressure_at_sea_level
      );
      if (i % 2 === 0) {
        const img = new Image(35, 35);
        img.src =
          images[
            json.properties.timeseries[i].data.next_1_hours.summary.symbol_code
          ];
        weatherImg.push(img);
        windArrow.push('');
        windDirection.push('');
      } else {
        const img = new Image(20, 20);
        weatherImg.push('');
        img.src = images.icon_arrow;
        windArrow.push(img);
        windDirection.push(
          json.properties.timeseries[i].data.instant.details.wind_from_direction
        );
      }
    }
    return {
      hour,
      temp,
      precipitation,
      wind,
      airPressure,
      weatherImg,
      windArrow,
      windDirection,
    };
  }
}

class Main {
  constructor() {
    this.weatherData = new WeatherData();
    this.displayController = new DisplayController();
    this.chart = new BarLineChart(this.displayController.getChartEl());
    this.updateChart();
  }

  async updateChart() {
    const json = await this.weatherData.fetchJson();
    const data = this.weatherData.getData(json);
    this.chart.updateData(
      data.hour,
      data.temp,
      data.precipitation,
      data.wind,
      data.airPressure,
      data.weatherImg,
      data.windArrow,
      data.windDirection
    );
    // setTimeout(this.updateChart.bind(this), 5000);
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
