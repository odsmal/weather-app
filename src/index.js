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
