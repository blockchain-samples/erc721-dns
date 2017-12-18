## Concept of Domain Name System (DNS) based on ERC721 (Non-fungible Token, NFT) Smart-Contracts

#### Just pet project, not seriously

*This project works in private testnet blockchain and doesn't need real coins, wallets etc*

----

Unlike the widespread ERC20 standard herew all tokens  are interchangeable within a single smart contract — i.e., if you e.g. had 20 Simple Tokens, sold them but then changed your mind and bought 20 Simple Tokens again — nothing changed — you were and still remain the owner of these tokens — the ERC721 standard describes non-fungible assets where each token is unique even within a single smart contract, has its own ID and price. According to the standard, every NFT is identified by a unique 256-bit positive integer.
        
The use of ERC721 Tokens in the form of digital assets, including for the proof-of-possession purposes in real life is being actively discussed today. However, smart contracts work much better with digital entities (especially those existing only within a smart contract environment). In this case it can really manage them with no need to have an intermediate layer to manage real world assets from the blockchain and control thereof.

Domain name is an unconditional value of the digital world. Domain names that sound good and gives people a strong idea of what activity a website is about, can be sold or bought for several hundred of thousand, and even million dollars. The DNS itself is in fact some kind of an address book, a registry which keeps records of domain names and servers related thereto. And, as long as blockchain is a distributed registry, it is very well suited to a fully decentralized DNS, so no supervision on the part of zone owners and regulators is required.

In turn, being the completely digital tradable assets, domain names are ideally suited to be ERC721 Tokens: they are unique (each domain name is unique), have their own value and can be sold or transferred from one owner to another.

Here is how it works:
- When registering a domain name in the smart contract, you receive an ERC721 Token identified by the hash of the domain name (converted into uint256). Except for the identifier, the token contains the owner's wallet address (available through the ownerOf method described in the standard) and the textual domain name (tokenMetadata method is also described in the standard).
- The smart contract also enables configuring addresses of the domain servers.
- Once received, you can store the token and accordingly use the domain name, transfer it (and accordingly the domain) to another person or put it up for sale on any exchange that works with ERC721 Tokens.

The code in this repository contains smart contracts that deal with tokens conforming to the standard, as well as DNS, name server management and an extremely simple exchange for token trading. The repository also contains smart contract tests and a web interface prototype to register the domain, manage servers and operations with tokens, including a simple exchange interface and a prototype name server capable of working with the standard DNS protocol.

----
### How to play with it

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

11. You will see added domain in left pane after refresh page. **// FIX IT**

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

