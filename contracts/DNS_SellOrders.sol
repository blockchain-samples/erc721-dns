pragma solidity ^0.4.0;
import "./DNS_ERC721.sol";

contract SellOrders is ERC721 {
    struct order {
        uint256 tokenId;
        uint price;
    }
    order[] public orders;
    mapping (uint256 => uint) ordersIdx;
    
    event SellOrderAdded(uint256 tokenId, uint price);
    event SellOrderRemoved(uint256 tokenId);

    function orderExists (uint256 _tokenId) constant public returns(bool) {
        return ordersIdx[_tokenId] != 0;
    }

    function sellOrdersLen () constant public returns(uint) {
        return orders.length;
    }
    
    function addSellOrder(uint256 _tokenId, uint _price) public onlyOwner(_tokenId) {
        require(ordersIdx[_tokenId] == 0);    // Not exists
        orders.push(order(_tokenId, _price));
        ordersIdx[_tokenId] = orders.length;
        SellOrderAdded(_tokenId, _price);
    }

    function _removeSellOrder(uint256 _tokenId) internal {
        uint idx = ordersIdx[_tokenId];
        if (idx == 0) return;
        uint last = orders.length - 1;
        if (idx <= last) {
            ordersIdx[orders[last].tokenId] = idx;
            orders[idx - 1] = orders[last];
        }
        ordersIdx[_tokenId] = 0;
        orders.length = last;
        SellOrderRemoved(_tokenId);
    }

    function removeSellOrder(uint256 _tokenId) public onlyOwner(_tokenId) {
        _removeSellOrder(_tokenId);
    }

    function buyOrder(uint256 _tokenId) payable public {
        uint idx = ordersIdx[_tokenId];
        require(idx != 0);
        require(orders[idx-1].price <= msg.value);
        address owner = tokenOwners[_tokenId];
        owner.transfer(msg.value);
        _transfer(owner, msg.sender, _tokenId);
        _removeSellOrder(_tokenId);
    }
}
