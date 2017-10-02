const BlockchainDNS = artifacts.require("./BlockchainDNS.sol");

contract('Blockchain Domain infrastructure test', (accounts) => {
    let dns;

    before(async () => {
        dns = await BlockchainDNS.deployed()
    });

    it('Set Google name servers', async () => {
        await dns.domainSet('google', [134743044, 134744072]);
    });

    it('Check Google', async () => {
        let count = dns.domainServersLen('google');
        let srv1 = dns.domainServer('google', 0);
        let srv2 = dns.domainServer('google', 1);
        assert.equal((await count).toNumber(), 2);
        srv1 = await srv1;
        srv2 = await srv2;
        assert.equal(srv1[0].toNumber(), 134743044);
        assert.equal(srv1[1].toString(), '8.8.4.4');
        assert.equal(srv2[0].toNumber(), 134744072);
        assert.equal(srv2[1].toString(), '8.8.8.8');
    });

    it('Set Comodo name servers', async () => {
        await dns.domainSet('comodo', [135936026, 135591700]);
    });

    it('Check Comodo', async () => {
        let count = dns.domainServersLen('comodo');
        let srv1 = dns.domainServer('comodo', 0);
        let srv2 = dns.domainServer('comodo', 1);
        assert.equal((await count).toNumber(), 2);
        srv1 = await srv1;
        srv2 = await srv2;
        assert.equal(srv1[0].toNumber(), 135936026);
        assert.equal(srv1[1].toString(), '8.26.56.26');
        assert.equal(srv2[0].toNumber(), 135591700);
        assert.equal(srv2[1].toString(), '8.20.247.20');
    });

    it('Update Google name servers', async () => {
        await dns.domainSet('google', [134744072, 134743044]);
    });

    it('Check Google again', async () => {
        let count = dns.domainServersLen('google');
        let srv1 = dns.domainServer('google', 0);
        let srv2 = dns.domainServer('google', 1);
        assert.equal((await count).toNumber(), 2);
        srv1 = await srv1;
        srv2 = await srv2;
        assert.equal(srv1[0].toNumber(), 134744072);
        assert.equal(srv1[1].toString(), '8.8.8.8');
        assert.equal(srv2[0].toNumber(), 134743044);
        assert.equal(srv2[1].toString(), '8.8.4.4');
    });

    it('Check first account domains', async () => {
        let count = dns.domainListingLen(accounts[0]);
        let domain1 = dns.domainListing(accounts[0], 0);
        let domain2 = dns.domainListing(accounts[0], 1);
        assert.equal((await count).toNumber(), 2);
        assert.equal((await domain1).toString(), 'google');
        assert.equal((await domain2).toString(), 'comodo');
    });

    it('Transfer Google to second account', async () => {
        await dns.transfer('google', accounts[1]);
    });

    it('Check first account domains', async () => {
        let count = dns.domainListingLen(accounts[0]);
        let domain = dns.domainListing(accounts[0], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await domain).toString(), 'comodo');
    });

    it('Check second account domains', async () => {
        let count = dns.domainListingLen(accounts[1]);
        let domain = dns.domainListing(accounts[1], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await domain).toString(), 'google');
    });

    it('Second account ordering google to sell', async () => {
        await dns.addSellOrder('google', 5000, {from: accounts[1]});
    });

    it('Check google in sell orders', async () => {
        let count = (await dns.sellOrdersLen()).toNumber();
        let order = await dns.orders(0);
        assert.equal(count, 1);
        assert.equal(order[0].toString(), 'google');
        assert.equal(order[1].toNumber(), 5000);
    });

    it('First account execute order and buy google', async () => {
        await dns.orderBuy('google', {value: 5000});
    });

    it('Check first account domains', async () => {
        let count = dns.domainListingLen(accounts[0]);
        let domain1 = dns.domainListing(accounts[0], 0);
        let domain2 = dns.domainListing(accounts[0], 1);
        assert.equal((await count).toNumber(), 2);
        assert.equal((await domain1).toString(), 'comodo');
        assert.equal((await domain2).toString(), 'google');
    });

    it('Check no sell orders', async () => {
        let count = (await dns.sellOrdersLen()).toNumber();
        assert.equal(count, 0);
    });
});

