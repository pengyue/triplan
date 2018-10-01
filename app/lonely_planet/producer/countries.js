const LONELY_PLANET_BASE_URL = process.env.PRODUCER_LONELY_PLANET_BASE_URL;
const APP_VERSION = process.env.APP_VERSION;
const APP_NAME = process.env.APP_NAME
const KAFKA_BROKER_IP = process.env.KAFKA_BROKER_IP + ':' + process.env.KAFKA_BROKER_PORT;
const TOPIC_NAME = process.env.PRODUCER_KAFKA_COUNTRY_TOPIC_NAME;
const COUNTRY_JSON_DATA_FILE = process.env.PRODUCER_COUNTRY_JSON_DATA_FILE
const KAFKA_RETRY_ATTEMPTS = 1

var client;
var kafka = require('kafka-node')
var Producer = kafka.Producer
var KeyedMessage = kafka.KeyedMessage;
 
// from the Oracle Event Hub - Platform Cluster Connect Descriptor
var kafkaConnectDescriptor = KAFKA_BROKER_IP;
 
console.log("Running Module " + APP_NAME + " version " + APP_VERSION);
 
function initializeKafkaProducer(attempt) {
  try {
    console.log(`Try to initialize Kafka Client at ${kafkaConnectDescriptor} and Producer, attempt ${attempt}`);
    const client = new kafka.KafkaClient({ kafkaHost: kafkaConnectDescriptor });
    console.log("Created client");
    producer = new Producer(client);
    console.log("Submitted async producer creation request");
    producer.on('ready', function () {
      console.log("Producer is ready in " + APP_NAME);
    });
    producer.on('error', function (err) {
      console.log("Failed to create the client or the producer " + JSON.stringify(err));
    })
  } catch (e) {
    console.log("Exception in initializeKafkaProducer" + JSON.stringify(e));
    console.log("Try again in 5 seconds");
    setTimeout(initializeKafkaProducer, 5000, ++attempt);
  }
}

//initializeKafkaProducer
initializeKafkaProducer(KAFKA_RETRY_ATTEMPTS);
 
var eventPublisher = module.exports;
 
eventPublisher.publishEvent = function (eventKey, event) {
  km = new KeyedMessage(eventKey, JSON.stringify(event));
  payloads = [
    { topic: TOPIC_NAME, messages: [km], partition: 0 }
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.error("Failed to publish event with key " + eventKey + " to topic " + TOPIC_NAME + " :" + JSON.stringify(err));
    }
    console.log("Published event with key " + eventKey + " to topic " + TOPIC_NAME + " :" + JSON.stringify(data));
  });
}

eventPublisher.run = function () {
  var countries = require(COUNTRY_JSON_DATA_FILE)
    countries.forEach( function(node){
      var country_url = LONELY_PLANET_BASE_URL + node.country.replace(/ /g,"-").toLowerCase();
      //payloads.push({ topic: "countries", messages: country_url, partition: 0 });
      eventPublisher.publishEvent("mykey", {"country": node.country, "country_url": country_url})
    });
}