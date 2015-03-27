#Who's faster? MongoDB vs Redis

This repository tries to compare read/write performance between MongoDB and Redis using Node.js as executor.


### How to run?
```
REDIS_PORT=3000 \
REDIS_HOST="localhost" \
MONGO_URI="mongodb://localhost:41414/mrb" \
node battle.js
```
