const Web3 = require('web3');
const artifacts = require('../build/contracts/BlockchainDNS.json');
const server = require('./lib.js');
let contract = require("truffle-contract");

contract = contract(artifacts);
contract.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
contract = !!process.argv[2] ? contract.at(process.argv[2]) : contract.deployed();

contract.then(instance => server(instance));
