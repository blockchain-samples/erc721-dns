pragma solidity ^0.4.0;

contract SellOrders {
    
    struct sell {
        string domain;
        uint price;
    }
    sell[] public orders;
    mapping (string => uint) ordersIdx;
    
    event SellOrderAdded(string domain, uint price);
    event SellOrderRemoved(string domain);

    function sellOrdersLen () constant public returns(uint) {
        return orders.length;
    }
    
    function _addSellOrder(string domain, uint price) internal {
        require(ordersIdx[domain] == 0);    // Not exists
        orders.push(sell(domain, price));
        ordersIdx[domain] = orders.length;
        SellOrderAdded(domain, price);
    }
    
    function _removeSellOrder(string domain) internal {
        uint idx = ordersIdx[domain];
        if (idx == 0) return;
        uint last = orders.length - 1;
        if (idx <= last) {
            ordersIdx[orders[last].domain] = idx;
            orders[idx - 1] = orders[last];
        }
        ordersIdx[domain] = 0;
        orders.length = last;
        SellOrderRemoved(domain);
    }
}

