const dns = require('native-dns');
const server = dns.createServer();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const abi = require('./abi.json');
const contractAbi = web3.eth.contract(abi);

const contractAddr = "0xebd819ac450b2ddf15236a8e57ba38b60d4b6125"; // replace this
const walletAddr = "0xcadd44f00ac1373235f278440c5a7ac71ddde6fe";   // replace this

const myContract = contractAbi.at(contractAddr);

server.on('request', (request, response) => {
  let name = request.question[0].name;
  try {
    let addr = myContract.getDomain.call(name, { from: walletAddr, to: contractAddr });
    if (addr) {
      response.answer.push(dns.A({ name: name, address: addr, ttl: 600 }));
    }
  } catch(error) {
    console.log(error);
  }
  response.send();
});

server.on('error', (err, buff, req, res) => {
  console.log(err.stack);
});

server.serve(1053);
