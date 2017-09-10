## Simple DNS infrastructure and server based on Ethereum blockchain and Solidity smart-contract
#### Pet project for understanding blockchain and smart-contract technologies

*This project works in private blockchain and doesn't need real coins, wallets etc*

1. Install the Truffle framework and testrpc.

`$ sudo npm install -g truffle ethereumjs-testrpc`

2. Run the Ethereum testrpc.

`$ sudo testrpc`

3. Go to other terminal, change directory to *contracts* and run tests.

```
$ truffle test

Using network 'development'.

Compiling ./contracts/blockchainDNS.sol...

.
.
.

  Contract: Simple test
    ✓ Set google name servers (231ms)
    ✓ Check google name servers count (156ms)
    ✓ Check google first name server (307ms)
    ✓ Check google second name server (246ms)


    0xe006fa884a8b0600966fa84e155f665f85d553c9


  4 passing (990ms)
```

* **0xe006fa884a8b0600966fa84e155f665f85d553c9** is a contract address (your will different).*

4. Change directory back, install modules and run DNS server with your contract address.

```
$ npm install
$ node blockchainDNS.js 0xe006fa884a8b0600966fa84e155f665f85d553c9
```

*Don't remember use your contract address*

5. Open other system console and try to use *nslookup* to get address for google domain.

```
$ nslookup -port=1053 google. localhost
Server:		localhost
Address:	127.0.0.1#1053

Non-authoritative answer:
Name:	google
Address: 8.8.8.8
Name:	google
Address: 8.8.4.4
```

**Enjoy your experiments with blockchain and smart-contracts.**
