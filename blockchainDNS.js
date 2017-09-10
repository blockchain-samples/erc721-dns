const dns = require('native-dns');
const server = dns.createServer();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const abi = require('./abi.json');
const contractAbi = web3.eth.contract(abi);

const contractAddr = process.argv[2];

const myContract = contractAbi.at(contractAddr);

server.on('request', (request, response) => {
  let name = request.question[0].name;
  try {
    let count = myContract.getServersCount.call(name, { to: contractAddr });
    for (let i = 0; i < count; i++) {
      let addr = myContract.getServer(name, i, { to: contractAddr });
      if (addr) {
        response.answer.push(dns.A({ name: name, address: addr[1], ttl: 600 }));
      }
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
