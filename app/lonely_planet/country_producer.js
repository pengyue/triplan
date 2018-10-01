const port = 3000
const lonely_planet_url = 'https://www.lonelyplanet.com/';
var express = require('express');
var kafka = require('kafka-node');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
})

var payloads = [];
var countries = require('../../node_modules/country-json/src/country-by-name.json')
countries.forEach(function(node){
    var country_url = lonely_planet_url + node.country.replace(/ /g,"-").toLowerCase();
    payloads.push({ topic: "countries", messages: country_url, partition: 0 });
});

console.log(payloads);

producer.send(payloads, (error, data) => console.log(error));

//var fs = require("fs");
//var countriesJson = fs.readFileSync("./data/countries.json",'utf8');

//app.get('/', (req,res) =>
//    res.json({greeting:'Kafka Consumer'})
//);
//app.listen(port, () =>
//    console.log("Kafka producer running on port " + port)
//);

//app.post('/sendCountry', function(req, res) {
//    var sentMessage = JSON.stringify(req.body.message);
//    payloads = [
//        { topic: req.body.topic, messages:sentMessage , partition: 0 }
//    ];
//    producer.send(payloads, function (err, data) {
//            res.json(data);
//    });
//});
