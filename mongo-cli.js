var env = process.env
  , nullfn = function(){}
  , collection = null;

require('mongodb').MongoClient.connect(env.MONGO_URI, function(err, db) {
  collection = db.collection('benchmark');
  module.exports.start();
});

module.exports = {
  name: 'mongo',
  start: function(){},
  onstart: function(handler) {
    if ( collection ) {
      handler.call(this);
    } else {
      this.start = handler;
    }
  },
  clear: function(callback) {
    collection.remove({}, callback || nullfn);
  },
  write: function(numEls, callback) {
    while (--numEls) collection.insert({id:numEls, value:"some fantastic value " + numEls}, nullfn);
    collection.insert({id:0,value:"some fantastic value 0"}, callback || nullfn);
  },
  read: function(numEls, callback) {
    while (--numEls) collection.findOne({id: numEls}, nullfn);
    collection.findOne({id:0}, callback || nullfn);
  }
}
