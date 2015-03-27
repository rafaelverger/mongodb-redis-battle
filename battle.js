var rediscli = require('./redis-cli')
  , mongocli = require('./mongo-cli')
  , element_counts = [100, 1000, 5000, 10000, 50000]
  , results = {};

function track_cli_method(client, method, num_elements, callback) {
  results[method] = results[method] || {};
  results[method][num_elements] = results[method][num_elements] || {}

  var start = new Date();
  client[method](num_elements, function(){
    results[method][num_elements][client.name] = new Date() - start;
    callback();
  });
}

function run_test(client, ec_idx, callback) {
  var onstart = client.onstart || function(handler){ handler() };
  console.log(client.name + ' for ' + element_counts[ec_idx] + ' elements');
  onstart.call(client, function(){
    client.clear(function(){
      start = new Date();
      track_cli_method(client, 'write', element_counts[ec_idx], function(){
        track_cli_method(client, 'read', element_counts[ec_idx], function(){
          if (ec_idx < element_counts.length) {
            return run_test(client, ++ec_idx, callback);
          }
          callback();
        });
      });
    });
  });
}

console.log('Init test');
run_test(rediscli, 0, function(){
  rediscli.clear();
  run_test(mongocli, 0, function(){
    mongocli.clear();
    console.log('Test is finished. Results:\n' + JSON.stringify(results, null, 2));
  });
})
