const _ = require('lodash');
const dns = require('native-dns');
const server = dns.createServer();

module.exports = (contract) => {

    server.on('request', async (req, res) => {
        let name = req.question[0].name;
        let count = (await contract.getServersCount(name)).toNumber();
        let r = _.range(count).map((_, i) => contract.getServer(name, i));
        for (let addr of await Promise.all(r)) {
            res.answer.push(dns.A({ name: name, address: addr[1].toString(), ttl: 600 }));
        }
        res.send();
    });

    server.on('error', (err, buff, req, res) => console.log(err.stack));

    server.serve(1053);
};
