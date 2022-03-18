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
    this.radarTimeStamp = document.getElementById('radar-map-timestamp');
    this.chart = document.getElementById('chart');
    this.tempCard = document.getElementById('temp-container');
    this.timeCard = document.getElementById('time-container');
  }
  getChartEl() {
    return this.chart;
  }
  updateRadarImage(timeStamp, imageURL) {
    this.radarImage.src = imageURL;
    this.radarTimeStamp.innerText = timeStamp;
  }
  updateTempCard(temp) {
    this.tempCard.innerText = `${temp}°`;
  }
  updateTimeCard(h, m) {
    this.timeCard.innerText = `${h}:${m}`;
  }
}

class WeatherData {
  async fetch(url) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getJSON(response) {
    try {
      const json = await response.json();
      // const json = require('./data.json');
      return json;
    } catch (error) {
      console.log(error);
    }
  }

  getRadarImage(json) {
    // const y = json.files;
    // const lastX = 37;
    // const res = y.filter((val, index, arr) => index > arr.length - lastX - 1);
    // console.log(res);
    // console.log(res[0].formats[0].link);
    // const res = await fetch(json.lastFiles[0].formats[0].link, {
    //   mode: 'cors',
    // });
    // const blob = await res.blob();
    // const objectURL = URL.createObjectURL(blob);
    const timeStamp = json.lastFiles[0].formats[0].updated.slice(11, 16);
    const imageURL = json.lastFiles[0].formats[0].link;
    return { timeStamp, imageURL };
  }

  getChartData(json) {
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
    this.updateTime();
  }

  updateTime() {
    const today = new Date();
    const h = today.getHours();
    let m = today.getMinutes();
    if (m < 10) m = `0${m}`;
    this.displayController.updateTimeCard(h, m);
    setTimeout(this.updateTime.bind(this), 1000);
  }

  async updateMap() {
    const mapURL =
      'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp?format=png&timeZone=Europe/Stockholm';
    const response = await this.weatherData.fetch(mapURL);
    const json = await this.weatherData.getJSON(response);
    const data = this.weatherData.getRadarImage(json);
    this.displayController.updateRadarImage(data.timeStamp, data.imageURL);
    setTimeout(this.updateMap.bind(this), 300000);
  }

  async updateChart() {
    const chartURL =
      'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=59.8586&lon=17.6389';
    const response = await this.weatherData.fetch(chartURL);
    const json = await this.weatherData.getJSON(response);
    const data = this.weatherData.getChartData(json);
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
    this.displayController.updateTempCard(data.temp[0]);
    setTimeout(this.updateChart.bind(this), 300000);
  }
}

new Main();
