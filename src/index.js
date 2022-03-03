import Chart from 'chart.js/auto';

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
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
// hiihio
