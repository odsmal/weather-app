import Chart from 'chart.js/auto';

const tempGraph = (data) => {
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.hours,
      datasets: [
        {
          // label: '# of Votes',
          data: data.temps,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const fetchApi = async () => {
  const temps = [];
  const hours = [];
  let h = new Date().getHours();
  //   console.log(h);
  //   const res = await fetch(
  //     ' https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/17.6320/lat/59.8471/data.json',
  //     { mode: 'cors' }
  //   );
  //   console.log(res);
  //   const json = await res.json();
  const json = require('./data2.json');
  //   const { timeSeries } = json;
  for (let i = 0; i < 12; i++) {
    temps.push(
      json.properties.timeseries[i].data.instant.details.air_temperature
    );
    hours.push((h + i) % 24);
  }
  //   console.log(airTemp);
  //   console.log(hours);
  return { temps, hours };
};

const main = async () => {
  const data = await fetchApi();
  //   console.log(fetchedData.temps);
  tempGraph(data);
};

main();

// const fetchData = async () => {
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
// fetchData();
