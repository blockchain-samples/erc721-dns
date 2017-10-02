pragma solidity ^0.4.0;
import "./DNS_DomainRecords.sol";
import "./DNS_SellOrders.sol";

contract BlockchainDNS is DomainRecords, SellOrders {

    modifier onlyOwner(string domain) {
        require(msg.sender == records[domain].owner);
        _;
    }

    function transfer(string domain, address to) isDomainName(domain) onlyOwner(domain) public {
        _transfer(domain, msg.sender, to);
        _removeSellOrder(domain);
    }

    function addSellOrder(string domain, uint price) isDomainName(domain) onlyOwner(domain) public {
        _addSellOrder(domain, price);
    }

    function removeSellOrder(string domain) isDomainName(domain) onlyOwner(domain) public {
        _removeSellOrder(domain);
    }

    function orderBuy(string domain) isDomainName(domain) payable public {
        uint idx = ordersIdx[domain];
        require(idx != 0);
        require(orders[idx-1].price <= msg.value);
        address owner = records[domain].owner;
        owner.transfer(msg.value);
        _transfer(domain, owner, msg.sender);
        _removeSellOrder(domain);
    }
}

