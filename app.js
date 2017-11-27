var mosca = require('mosca');



var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://embed:ardcsr1150@ds259865.mlab.com:59865/embedsystem',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1884,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://embed:ardcsr1150@ds259865.mlab.com:59865/embedsystem'
  }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);


server.on('published', function (packet, client) {
  console.log('Published', packet.payload.toString('utf8'));
});
// const buf = Buffer.from('aGVsbG8gd29ybGQ=', 'base64');
// console.log(buf);
// console.log(buf.toString('ascii'));
// console.log(buf.toString('utf8'));

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running port :' + moscaSettings.port)
}

//  docker build -t embed     .
//  docker images
//  docker run -p 1884:1884 embed