pragma solidity ^0.4.0;
import "./DNS_ListingByOwner.sol";
import "./DNS_Inet.sol";

contract DomainRecords is Inet, DomainListingByOwner {

    struct record {
        address owner;
        uint[] servers;
    }
    mapping (string => record) records;

    event DomainTransfered(string domain, address from, address to);

    function domainSet(string domain, uint[] servers) isDomainName(domain) public {
        require(records[domain].owner == address(0x0) || records[domain].owner == msg.sender);

        if (records[domain].owner == address(0x0)) {
            addDomainToListing(msg.sender, domain);
            DomainTransfered(domain, 0x0, msg.sender);
        }
        records[domain] = record(msg.sender, servers);
    }

    function _transfer(string domain, address from, address to) internal {
        records[domain].owner = to;
        removeDomainFromListing(from, domain);        
        addDomainToListing(to, domain);
        DomainTransfered(domain, from, to);
    }

    function domainServersCount(string domain) isDomainName(domain) constant public returns(uint) {
        return records[domain].servers.length;
    }

    function domainServer(string domain, uint idx) isDomainName(domain) constant public returns(uint, string) {
        uint addr = records[domain].servers[idx];
        return (addr, uintToIpAddr(addr));
    }
}

