pragma solidity ^0.4.0;
 
contract simpleDNS {
    struct Record {
        address owner;
        string ipaddr;
    }
 
    mapping (string => Record) records;
    
    function setDomain(string _domain, string _ipaddr) {
        require(records[_domain].owner == address(0x0) || records[_domain].owner == msg.sender);
        records[_domain] = Record(msg.sender, _ipaddr);
    }
    
    function getDomain(string _domain) constant returns(string) {
        return records[_domain].ipaddr;
    }
    
    function transfer(string _domain, address _to) {
        require(records[_domain].owner == msg.sender);
        records[_domain].owner = _to;
    }    
}
