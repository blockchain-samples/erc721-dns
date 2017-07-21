## Simple DNS infrastructure and server based on Ethereum blockchain and Solidity smart-contract
#### Pet project for understanding blockchain and smart-contract technologies

*This project works in private blockchain and doesn't need real coins, wallets etc*

1. Download the [go-ethereum client (geth)](https://geth.ethereum.org/downloads/) and run it on developer mode with private blockchain, rpc-server and console.

`$ geth --dev --rpc --rpccorsdomain "*" --rpcapi "admin,miner,personal,eth,net,web3" console`

2. In geth console create account with password "qwerty" and unlock it repeat "qwerty" when asked passphase

```
> personal.newAccount("qwerty")
"0xc79ca30e48f5767d0ad1a34da156c6d99b653778"
> personal.unlockAccount(eth.accounts[0])
Passphrase:
```

3. Start mining in geth console.

```
> miner.start()
```

4. Launch web browser with [Remix — online Solidity IDE](http://ethereum.github.io/browser-solidity/) and open there simpleDNS.sol Solidity file with smart-contract.

5. Connect it to your private blockchain.

![Remix — online Solidity IDE](http://s018.radikal.ru/i500/1706/71/cfdd19338c45.png)

6. Click on **Create** button and deploy smart-conrtact to your private blockchain. After deploy you will see three inputs with buttons, one for each function in smart-contract.

7. Call the setDomain function with domain (for example) "google" and IP address 134744072 (this is integer for "8.8.8.8").

![Deploy Solidity smart-contract](http://s019.radikal.ru/i610/1706/3b/7a1a953dc186.png)

8. Try to call getDomain function with domain "google". It must return 134744072 and "8.8.8.8".

9. Copy and remember contract's hex-address (button "**copy address**" above the contract inputs)

10. Open simpleDNS.js file in your favorite editor and replace hex-adresses for **contractAddr**. Use address you got on the previos step.
```
...
const abi = require('./abi.json');
const contractAbi = web3.eth.contract(abi);

const contractAddr = "0xec13aaa7d76552708fcc571844652f27e09b755f";
...
```

11. Save and close this file, install the required modules and run server.

```
$ npm install
$ node simpleDNS.js
```

12. Open other system console and try to use *nslookup* to get address for domain you saved on step 7.

```
$ nslookup -port=1053 google. localhost
Server:		localhost
Address:	127.0.0.1#1053

Non-authoritative answer:
Name:	google
Address: 8.8.8.8
```

*In this lab you stored domain's information and address in your private blockchain and got it via simple server.*

**Enjoy your experiments with blockchain and smart-contracts.**
