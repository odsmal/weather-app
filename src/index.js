//npx webpack --watch
//use tree shaking when more charts are done
import './styles.css';
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
      maintainAspectRatio: false,
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
  constructor() {
    this.radarImage = document.getElementById('radar-map');
  }
  getChartEl() {
    return document.getElementById('chart');
  }
  updateRadarImage(timeStamp, objectURL) {
    console.log(timeStamp);
    this.radarImage.src = objectURL;
  }
}

class WeatherData {
  async fetchJson(url) {
    // const res = await fetch(
    //   'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=59.8586&lon=17.6389',
    //   { mode: 'cors' }
    // );
    // const json = require('./data2.json');

    const res = await fetch(url, { mode: 'cors' });
    const json = await res.json();
    // const json = require('./data.json');

    return json;
  }

  async getRadarImage(json) {
    console.log(json);
    // const imgSlot = document.getElementById('radar-map');
    // imgSlot.src = 'newSource.png';

    // const y = json.files;
    // const lastX = 37;
    // const res = y.filter((val, index, arr) => index > arr.length - lastX - 1);
    // console.log(res);
    // console.log(res[0].formats[0].link);
    const timeStamp = json.lastFiles[0].formats[0].updated;

    const res = await fetch(json.lastFiles[0].formats[0].link, {
      mode: 'cors',
    });
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    return { timeStamp, objectURL };
  }

  getData(json) {
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
    this.updateMap();
  }

  async updateMap() {
    const url =
      'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp?format=png&timeZone=Europe/Stockholm';
    const json = await this.weatherData.fetchJson(url);
    const data = await this.weatherData.getRadarImage(json);
    this.displayController.updateRadarImage(data.timeStamp, data.objectURL);
    // setTimeout(this.updateChart.bind(this), 5000);
  }

  async updateChart() {
    const url =
      'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=59.8586&lon=17.6389';
    const json = await this.weatherData.fetchJson(url);
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
