//use tree shaking when more charts are done
import Chart from 'chart.js/auto';

const buildGraph = (data) => {
  new Chart(getEl('myChart'), {
    data: {
      labels: getLabels(data),
      datasets: getDatasets(data),
    },
    options: getOptions(),
  });
};

const getDatasets = (data) => {
  const datasets = [
    {
      type: 'bar',
      // label: '# of Votes',
      data: data.precipitation,
      backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(54, 162, 235, 1)'],
      borderWidth: 1,
    },
    {
      type: 'line',
      // label: '# of Votes',
      data: data.temps,
      backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(54, 162, 235, 1)'],
      borderWidth: 1,
    },
  ];
  return datasets;
};

const getEl = (str) => {
  return document.getElementById(`${str}`);
};

const getLabels = (data) => {
  return data.hours;
};

const getOptions = () => {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        // min: -20,
        // max: 20,
        beginAtZero: true,
      },
    },
  };
  return options;
};

const fetchJson = async () => {
  //   const arr = [];
  //   console.log(h);
  //   const res = await fetch(
  //     ' https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.6320/lat/59.8471/data.json',
  //     { mode: 'cors' }
  //   );
  //   console.log(res);
  //   const json = await res.json();
  const json = require('./data2.json');
  return json;
};

const getData = (json) => {
  console.log(json);
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
    // arr.push({
    //   x: json.properties.timeseries[i].data.instant.details.air_temperature,
    //   y: (h + i) % 24,
    // });
  }
  //   console.log(airTemp);
  //   console.log(hours);
  // console.log(arr);
  return { temps, precipitation, hours };
};

const main = async () => {
  const json = await fetchJson();
  const data = getData(json);
  buildGraph(data);
};

main();

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
