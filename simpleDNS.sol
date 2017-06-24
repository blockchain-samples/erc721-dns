pragma solidity ^0.4.0;
 
contract simpleDNS {
    struct Record {
        address owner;
        string ipaddr;
    }
 
    mapping (string => Record) records;
    
    function addDomain(string _domain, string _ipaddr) {
        if (records[_domain].owner != address(0x0)
        && records[_domain].owner != msg.sender) { return; }
        
        records[_domain] = Record(msg.sender, _ipaddr);
    }
    
    function getDomain(string _domain) constant returns(string) {
        return records[_domain].ipaddr;
    }
    
    function transfer(string _domain, address _to) {
        if (records[_domain].owner != msg.sender) { throw; }
 
        records[_domain].owner = _to;
    }    
}
