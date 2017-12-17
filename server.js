const _ = require('lodash');
const dns = require('native-dns');
const namesrv = dns.createServer();
const logger = require('morgan');
const app = new (require('express'))();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);

const ports = {web: 3000, dns: 1053};

const BlockchainDNS = artifacts.require("BlockchainDNS");

app.use(logger('dev'));

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => res.sendFile(__dirname + '/server/index.html'));

module.exports = async () => {
    const contract = await BlockchainDNS.deployed();
    const networkId = await new Promise((resolve, reject) =>
        web3.version.getNetwork((err, res) => err ? reject(err) : resolve(res)));

    app.get('/init', (req, res) => res.json({
        networkId,
        contract: contract.address,
        abi: contract.abi
    }));

    app.listen(ports.web, (error) => {
        if (error) throw(error);   
        console.log('Web server working at port', ports.web);
    });

    namesrv.on('request', async (req, res) => {
        let name = req.question[0].name;
        let count = (await contract.domainServersLen(name)).toNumber();
        let r = _.range(count).map((_, i) => contract.domainServer(name, i));
        for (let addr of await Promise.all(r)) {
            res.answer.push(dns.A({ name: name, address: addr[1].toString(), ttl: 600 }));
        }
        res.send();
    });

    namesrv.on('error', (err, buff, req, res) => console.log(err.stack));

    namesrv.serve(ports.dns, (error) => {
        if (error) throw(error);
        console.log('Name server working at port', ports.dns);
    });
}
