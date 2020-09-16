const dgram = require('dgram')
const server = dgram.createSocket('udp4')

let queue = null

setInterval(() => console.log(queue), 1000)

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    if(queue === null) {
        queue = [rinfo.address, rinfo.port]
        return
    }

    if(queue[0] !== rinfo.address || queue[1] !== rinfo.port) {
        let qaddress = (queue[0] !== rinfo.address) ? queue[0] : '127.0.0.1'
        let raddress = (queue[0] !== rinfo.address) ? rinfo.address : '127.0.0.1'

        server.send(`${raddress}:${rinfo.port}`, queue[1], queue[0])
        server.send(`${qaddress}:${queue[1]}`, rinfo.port, rinfo.address)
        queue = null
    } else {
        queue = [rinfo.address, rinfo.port]
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3000);
// Prints: server listening 0.0.0.0:41234