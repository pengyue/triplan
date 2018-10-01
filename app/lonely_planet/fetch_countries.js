var fs = require('fs');
var countries;
fs.readFile('./data/countries.json', 'utf8', function (err, data) {
  if (err) throw err;
  countries = JSON.parse(data);

  console.log(countries);
});

