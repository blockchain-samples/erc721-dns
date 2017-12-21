pragma solidity ^0.4.0;
import "./DNS_ERC721.sol";
import "./DNS_SellOrders.sol";
import "./DNS_Inet.sol";

contract BlockchainDNS is ERC721, SellOrders, Inet {
    mapping (uint256 => uint256[]) domainServers;

    function transfer(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
        _removeSellOrder(_tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        super.takeOwnership(_tokenId);
        _removeSellOrder(_tokenId);
    }

    function domainSet(string _domain, uint[] _servers) isDomainName(_domain) public {
        uint256 tokenId = uint256(keccak256(bytes(_domain)));
        address owner = tokenOwners[tokenId];
        require(owner == address(0x0) || owner == msg.sender);
        if (owner == address(0x0)) {
            _addToken(tokenId, msg.sender);
            tokenOwners[tokenId] = msg.sender;
            metadata[tokenId] = _domain;
            totalSupply++;
            Transfer(0x0, msg.sender, tokenId);
        }
        domainServers[tokenId] = _servers;
    }

    function domainServersLen(string _domain) constant public returns(uint) {
        uint256 tokenId = uint256(keccak256(bytes(_domain)));
        return domainServers[tokenId].length;
    }

    function domainServer(string _domain, uint _idx) constant public returns(uint, string) {
        uint256 tokenId = uint256(keccak256(bytes(_domain)));
        uint addr = domainServers[tokenId][_idx];
        return (addr, uintToIpAddr(addr));
    }
}
