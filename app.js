// module mosca (mqtt Broker)
var mosca = require('mosca');
// module mongodb (connect to mongodb)
var MongoClient = require('mongodb').MongoClient;
//url database form keep value only
var url = "mongodb://BNK48:cookie@ds119446.mlab.com:19446/mqtt_data";
//model form keep value
var model = {
  value: ""
};
//model form keep
var topicMqtt = "";
// set name url type of database
var ascoltatore = {
  type: 'mongo',
  url: 'mongodb://BNK48:cookie@ds259865.mlab.com:59865/embedsystem',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};
// setting mosca key
var moscaSettings = {
  port: 1884,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://BNK48:cookie@ds259865.mlab.com:59865/embedsystem'
  }
};
//mosca read setting
var server = new mosca.Server(moscaSettings);
//run mosca and call setup() when it run success
server.on('ready', setup);

//mosca read published if it pub run function
server.on('published', function (packet, client) {
  //check qos 0-3 or not
  //if qos = 0-3
  if (packet.qos > -1 && packet.qos < 3) {
    //แยกค่าออกมาจาก payload มาใส่ใน model ที่ตั้งไว้
    this.model = {
      value: parseInt(packet.payload.toString('utf8'))
    };
    //แสดงค่าที่รับเข้ามา
    console.log(this.model.value);
    //check ค่าที่แปลง
    if (this.model.value) {
      if (this.model.value < 4000) {
        //เรียก function addValue() เพื่อนำข้อมูลไปเก็บในdatabase
        addValue(this.model, packet.topic)
      }
    }
  }
});
//โชว์ mosca port เมื่อrun สำเร็จ
function setup() {
  console.log('Mosca server is up and running port :' + moscaSettings.port)
}
//function ในการเก็บค่าลง database
function addValue(data, topicData) {
  //connect to database ตาม url ที่ประกาศด้านบน
  MongoClient.connect(url, function (err, db) {
    //check error ถ้ามี ก็ออกจากการทำงานทั้งหมด
    if (err) throw err;
    //ส่งข้อมูลเข้าdatabase collection คือชื่อ topic ที่ตั้ง data คือค่าที่รับมาจากที่ส่ง
    db.collection(topicData).insertOne(data, function (err, res) {
      //check error ถ้ามี ก็ออกจากการทำงานทั้งหมด
      if (err) throw err;
      //ออกจากการconnect database
      db.close();
    });
  });
}

