/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  'mongodb-redis-battle': {
    // Dependent systems
    depends: ['mongodb', 'redis'],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/node:0.12"},
    // Steps to execute before running instances
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "node index.js",
    wait: false,
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: false,
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    envs: {
      NODE_ENV: "dev",
    },
  },

  'redis': {
    image: { docker: "dockerfile/redis" },
    scalable: false,
    ports: {
      data: "6379:6379/tcp",
    },
    mounts: {
      '/data' : persistent('redis'),
    },
    export_envs: {
      REDIS_HOST: "#{net.host}",
      REDIS_PORT: "#{net.port[6379]}"
    },
  },

  'mongodb': {
    image: { dockerfile: "containers/mongodb/Dockerfile" },
    command: 'mongod',
    scalable: false,
    ports: {
      data: "27017:27017/tcp",
    },
    mounts: {
      '/data/db' : persistent('mongodb'),
    },
    export_envs: {
      MONGO_URI: "mongodb://#{net.host}:#{net.port[27017]}/mrb",
    },
  }
});
