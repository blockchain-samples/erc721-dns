const BlockchainDNS = artifacts.require("./BlockchainDNS.sol");

contract('Simple test', (accounts) => {
    let dns;

    before((done) => {
        BlockchainDNS.deployed().then((_dns) => {
            dns = _dns;
            done();
        });
    });

    it('Set Google name servers', (done) => {
        dns.domainSet('google', [134744072, 134743044]).then(() => {
            done();
        });
    });

    it('Check Google name servers count', (done) => {
        dns.domainServersCount('google').then((count) => {
            assert.equal(count.toNumber(), 2);
            done();
        });
    });

    it('Check Google first name server', (done) => {
        dns.domainServer('google', 0).then((server) => {
            assert.equal(server[0].toNumber(), 134744072);
            assert.equal(server[1].toString(), '8.8.8.8');
            done();
        });
    });

    it('Check Google second name server', (done) => {
        dns.domainServer('google', 1).then((server) => {
            assert.equal(server[0].toNumber(), 134743044);
            assert.equal(server[1].toString(), '8.8.4.4');
            done();
        });
    });

    it('Set Comodo name servers', (done) => {
        dns.domainSet('comodo', [135936026, 135591700]).then(() => {
            done();
        });
    });

    it('Check Comodo first name server', (done) => {
        dns.domainServer('comodo', 0).then((server) => {
            assert.equal(server[0].toNumber(), 135936026);
            assert.equal(server[1].toString(), '8.26.56.26');
            done();
        });
    });

    it('Check first account domains count', (done) => {
        dns.domainListingLen(accounts[0]).then((count) => {
            assert.equal(count.toNumber(), 2);
            done();
        });
    });

    it('Check first account first domain', (done) => {
        dns.domainListing(accounts[0], 0).then((domain) => {
            assert.equal(domain, 'google');
            done();
        });
    });

    it('Check first account second domain', (done) => {
        dns.domainListing(accounts[0], 1).then((domain) => {
            assert.equal(domain, 'comodo');
            done();
        });
    });

    it('Transfer google domain to second account', (done) => {
        dns.transfer('google', accounts[1]).then(() => done());
    });

    it('Check first account domains count', (done) => {
        dns.domainListingLen(accounts[0]).then((count) => {
            assert.equal(count.toNumber(), 1);
            done();
        });
    });

    it('Check first account domain', (done) => {
        dns.domainListing(accounts[0], 0).then((domain) => {
            assert.equal(domain, 'comodo');
            done();
        });
    });

    it('Check second account domains count', (done) => {
        dns.domainListingLen(accounts[1]).then((count) => {
            assert.equal(count.toNumber(), 1);
            done();
        });
    });

    it('Check second account domain', (done) => {
        dns.domainListing(accounts[1], 0).then((domain) => {
            assert.equal(domain, 'google');
            done();
        });
    });
});
