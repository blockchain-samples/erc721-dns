pragma solidity ^0.4.0;
import "./DNS_DomainRecords.sol";

contract BlockchainDNS is DomainRecords {
    function transfer(string domain, address to) isDomainName(domain) public {
        require(msg.sender == records[domain].owner);
        _transfer(domain, msg.sender, to);
    }
}

