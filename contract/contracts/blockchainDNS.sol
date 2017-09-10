pragma solidity ^0.4.0;
 
contract BlockchainDNS {
    struct Record {
        address owner;
        uint32[] ipaddr;
    }
 
    mapping (string => Record) records;

    modifier isDomainName (string domain) {
        bytes memory tmp = bytes(domain);
        // domain name must contains only 0-9 a-z and - characters
        for (uint i = 0; i < tmp.length; i++) {
            require(tmp[i] == 45 || (tmp[i] >= 48 && tmp[i] <= 57) || (tmp[i] >= 97 && tmp[i] <= 122));
        }
        _;
    }
    
    function setDomain(string _domain, uint32[] _ipaddr) isDomainName(_domain) {
        require(records[_domain].owner == address(0x0) || records[_domain].owner == msg.sender);
        records[_domain] = Record(msg.sender, _ipaddr);
    }
    
    function uint2ip(uint ip) private constant returns(string) {
        uint i = 0;
        bytes memory result = new bytes(15);
        for (int8 x = 24; x >= 0; x -= 8) {
            uint8 octet = uint8((ip >> x) & 0xFF);
            uint8 len = octet > 100 ? 100 : octet > 10 ? 10 : 1;
            for (uint8 j = len; j >= 1; j = j/10) {
                result[i++] = byte(48 + octet / j);
                octet = octet % j;
            }
            if (x > 0) result[i++] = ".";
        }
        return string(result);
    }
    
    function getServersCount(string _domain) isDomainName(_domain) constant returns(uint) {
        return records[_domain].ipaddr.length;
    }
    
    function getServer(string _domain, uint idx) isDomainName(_domain) constant returns(uint32, string) {
        return (records[_domain].ipaddr[idx], uint2ip(records[_domain].ipaddr[idx]));
    }

    function transfer(string _domain, address _to) isDomainName(_domain) {
        require(records[_domain].owner == msg.sender);
        records[_domain].owner = _to;
    }
}
