const BlockchainDNS = artifacts.require("BlockchainDNS");
const server = require('./server/lib.js');

module.exports = async () => {
    const dns = await BlockchainDNS.deployed();
    server(dns);
}
