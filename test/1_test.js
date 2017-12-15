const BlockchainDNS = artifacts.require("./BlockchainDNS.sol");

contract('Blockchain Domain infrastructure test', (accounts) => {
    let dns, googleToken, comodoToken;

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
        let count = dns.balanceOf(accounts[0]);
        let _token1 = dns.tokenOfOwnerByIndex(accounts[0], 0);
        let _token2 = dns.tokenOfOwnerByIndex(accounts[0], 1);
        googleToken = (await _token1).toString();
        comodoToken = (await _token2).toString();
        let domain1 = dns.tokenMetadata(googleToken);
        let domain2 = dns.tokenMetadata(comodoToken);
        assert.equal((await count).toNumber(), 2);
        assert.equal((await domain1).toString(), 'google');
        assert.equal((await domain2).toString(), 'comodo');
    });

    it('Approve Google to another account', async () => {
        await dns.approve(accounts[2], googleToken);
        let spender = await dns.approved(googleToken);
        assert.equal(spender.toString(), accounts[2]);
    })

    it('Transfer Google to second account', async () => {
        await dns.transfer(accounts[1], googleToken);
    });

    it('Transfer must clear approve', async () => {
        let spender = await dns.approved(googleToken);
        assert.equal(spender.toString(), '0x0000000000000000000000000000000000000000');
    });

    it('Check first account domains', async () => {
        let count = dns.balanceOf(accounts[0]);
        let token = dns.tokenOfOwnerByIndex(accounts[0], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await token).toString(), comodoToken);
    });

    it('Check second account domains', async () => {
        let count = dns.balanceOf(accounts[1]);
        let token = dns.tokenOfOwnerByIndex(accounts[1], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await token).toString(), googleToken);
    });

    it('Second account approve Google domain to first account', async () => {
        await dns.approve(accounts[0], googleToken, { from: accounts[1] });
        let spender = await dns.approved(googleToken);
        assert.equal(spender.toString(), accounts[0]);
    });

    it('First account takes Google domain', async () => {
        await dns.takeOwnership(googleToken);
        let owner = await dns.ownerOf(googleToken);
        assert.equal(owner.toString(), accounts[0]);
    });

    it('Approve must be clean', async () => {
        let spender = await dns.approved(googleToken);
        assert.equal(spender.toString(), '0x0000000000000000000000000000000000000000');
    });

    it('Check first account domains', async () => {
        let count = dns.balanceOf(accounts[0]);
        let token1 = dns.tokenOfOwnerByIndex(accounts[0], 0);
        let token2 = dns.tokenOfOwnerByIndex(accounts[0], 1);
        assert.equal((await count).toNumber(), 2);
        assert.equal((await token1).toString(), comodoToken);
        assert.equal((await token2).toString(), googleToken);
    });
    
    it('Check second account domains', async () => {
        let count = dns.balanceOf(accounts[1]);
        assert.equal((await count).toNumber(), 0);
    });

    it('First account order google to sell', async () => {
        await dns.addSellOrder(googleToken, 5000);
    });

    it('Check google in sell orders', async () => {
        let count = (await dns.sellOrdersLen()).toNumber();
        let order = await dns.orders(0);
        assert.equal(count, 1);
        assert.equal(order[0].toString(), googleToken);
        assert.equal(order[1].toNumber(), 5000);
    });

    it('Second account execute order and buy google', async () => {
        await dns.buyOrder(googleToken, { from: accounts[1], value: 5000 });
    });

    it('Check first account domains', async () => {
        let count = dns.balanceOf(accounts[0]);
        let token = dns.tokenOfOwnerByIndex(accounts[0], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await token).toString(), comodoToken);
    });

    it('Check second account domains', async () => {
        let count = dns.balanceOf(accounts[1]);
        let token = dns.tokenOfOwnerByIndex(accounts[1], 0);
        assert.equal((await count).toNumber(), 1);
        assert.equal((await token).toString(), googleToken);
    });

    it('Check no sell orders', async () => {
        let count = (await dns.sellOrdersLen()).toNumber();
        assert.equal(count, 0);
    });
});
