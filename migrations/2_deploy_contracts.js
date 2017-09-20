var BlockchainDNS = artifacts.require("./BlockchainDNS.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockchainDNS);
};
