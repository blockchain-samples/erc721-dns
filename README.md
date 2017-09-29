## Simple DNS infrastructure and server based on Ethereum smart-contracts

#### Just pet project, not seriously

*This project works in private testnet blockchain and doesn't need real coins, wallets etc*

----

1. Install the Truffle framework and testrpc.

```
$ sudo npm install -g truffle ethereumjs-testrpc
```

2. Run the Ethereum testrpc.

```
$ testrpc
```

3. Go to other terminal and run tests.

```
$ truffle test

Using network 'development'.

Compiling ./contracts/blockchainDNS.sol...

.
.
.

  Contract: Simple test
    ✓ Set Google name servers (160ms)
    ✓ Check Google name servers count (107ms)
    ✓ Check Google first name server (149ms)
    ✓ Check Google second name server (166ms)
    ✓ Set Comodo name servers (187ms)
    ✓ Check Comodo first name server (199ms)
    ✓ Check first account domains count (46ms)
    ✓ Check first account first domain (59ms)
    ✓ Check first account second domain (68ms)
    ✓ Transfer google domain to second account (180ms)
    ✓ Check first account domains count
    ✓ Check first account domain (58ms)
    ✓ Check second account domains count
    ✓ Check second account domain (53ms)


  14 passing (2s)
```

4. Compile and migrate the smart-contract.

```
$ truffle compile
$ truffle migrate
```

5. Install NPM modules and run server.

```
$ npm install
$ truffle exec server.js
Using network 'development'.

Web server working at port 3000
Name server working at port 1053
.
.
.
```

6. Run your browser with [Metamask plugin](https://metamask.io/) and configure Metamask to private testnet http://localhost:8545

7. Create a Metamask account if you don't have it yet.

8. Open url http://localhost:3000 on your browser.

9. Add (for example) domain **google** and nameservers **8.8.8.8** and **8.8.4.4**.

10. Submit transaction in Metamask popup notification *(set GasPrice to 0 if your testnet wallet empty)*

11. You will see added domain in left pane after refresh page. **FIX IT**

12. Open other system console and try to use *nslookup* to get address for domain which was added.

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

---

*Enjoy your experiments with blockchain and smart-contracts.*
