pragma solidity ^0.4.0;
 
contract simpleDNS {
    struct Record {
        address owner;
        string ipaddr;
    }
 
    mapping (string => Record) records;

    modifier isDomainName (string domain) {
        bytes memory tmp = bytes(domain);
        for (uint i = 0; i < tmp.length; i++) {
            require(tmp[i] == 45 || (tmp[i] >= 48 && tmp[i] <= 57) || (tmp[i] >= 97 && tmp[i] <= 122));
        }
        _;
    }
    
    function setDomain(string _domain, string _ipaddr) isDomainName(_domain) {
        require(records[_domain].owner == address(0x0) || records[_domain].owner == msg.sender);
        records[_domain] = Record(msg.sender, _ipaddr);
    }
    
    function getDomain(string _domain) isDomainName(_domain) constant returns(string) {
        return records[_domain].ipaddr;
    }
    
    function transfer(string _domain, address _to) isDomainName(_domain) {
        require(records[_domain].owner == msg.sender);
        records[_domain].owner = _to;
    }
}
