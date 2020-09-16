const dgram = require('dgram')
const server = dgram.createSocket('udp4')

let established = false
let address = process.argv[2]
let port = process.argv[3]

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    if(!established) {
        address = msg.toString().split(':')[0]
        port = msg.toString().split(':')[1]

        server.send('Connection established!', port, address)

        established = true
    } else {
        if(msg.toString() !== 'ping') {
            console.log(`${rinfo.address}:${rinfo.port}\n${msg}`)
        }
    }
});

server.bind((Math.random() * 1000) + 40000)

setInterval(() => {
    server.send('ping', port, address)
}, 1000)

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.prompt()

readline.on('line', line => {
    server.send(line, port, address)

    readline.prompt()
}).on('close', () => {
    process.exit(0)
})