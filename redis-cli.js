var env = process.env
  , client = require("redis").createClient(env.REDIS_PORT, env.REDIS_HOST);

module.exports = {
  name: 'redis',
  clear: function(callback) {
    client.del({}, callback);
  },
  write: function(numEls, callback) {
    while (--numEls) client.set(numEls, "some fantastic value " + numEls);
    client.set(0, "some fantastic value 0", callback);
  },
  read: function(numEls, callback) {
    while (--numEls) client.get(numEls);
    client.get(0, callback);
  }
}
