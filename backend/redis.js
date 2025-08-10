const  { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: 19715
    }
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

module.exports = client
