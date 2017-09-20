const BlockchainDNS = artifacts.require("./BlockchainDNS.sol");

contract('Simple test', (accounts) => {
    let dns;

    before(function(done) {
        BlockchainDNS.deployed().then((_dns) => {
            dns = _dns;
            done();
        });
    });

    it('Set google name servers', (done) => {
        dns.setDomain('google', [134744072, 134743044]).then(() => {
            done();
        });
    });

    it('Check google name servers count', (done) => {
        dns.getServersCount('google').then((count) => {
            assert.equal(count.toNumber(), 2);
            done();
        });
    });

    it('Check google first name server', (done) => {
        dns.getServer('google', 0).then((server) => {
            assert.equal(server[0].toNumber(), 134744072);
            assert.equal(server[1].toString(), '8.8.8.8');
            done();
        });
    });

    it('Check google second name server', (done) => {
        dns.getServer('google', 1).then((server) => {
            assert.equal(server[0].toNumber(), 134743044);
            assert.equal(server[1].toString(), '8.8.4.4');
            done();
        });
    });

    after(function() {
        console.log('\n\n   ', dns.address);
    });
});
