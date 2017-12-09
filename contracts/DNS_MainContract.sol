pragma solidity ^0.4.0;
import "./DNS_Inet.sol";

contract BlockchainDNS is Inet {
    mapping (uint256 => address) tokenOwners;
    mapping (address => uint256[]) ownedTokens;
    mapping (uint256 => uint256) ownedTokenIdx;
    mapping (uint256 => string) tokenDomains;
    mapping (uint256 => uint256[]) domainServers;

    function _addToken(uint256 token, address to) private {
        require(ownedTokenIdx[token] == 0);
        ownedTokens[to].push(token);
        ownedTokenIdx[token] = ownedTokens[to].length;
    }

    function _removeToken(uint256 token, address from) private {
        uint last = ownedTokens[from].length - 1;
        uint idx = ownedTokenIdx[token];
        require(idx != 0);
        if (idx <= last) {
            ownedTokens[from][idx - 1] = ownedTokens[from][last];
            ownedTokenIdx[last] = idx;
        }
        ownedTokenIdx[token] = 0;
        ownedTokens[from].length = last;
    }

// ERC 721
    function balanceOf(address owner) public constant returns(uint) {
        return ownedTokens[owner].length;
    }
    
    function ownerOf(uint256 token) public constant returns(address) {
        return tokenOwners[token];
    }

    function tokenOfOwnerByIndex(address owner, uint idx) public constant returns(uint) {
        return ownedTokens[owner][idx];
    }

    function transfer(address to, uint256 token) public {
        require(msg.sender == tokenOwners[token]);
        tokenOwners[token] = to;
        _removeToken(token, msg.sender);
        _addToken(token, to);
    }

    function tokenMetadata(uint256 token) public constant returns(string) {
        return tokenDomains[token];
    }

// Domain methods
    function domainSet(string domain, uint[] servers) isDomainName(domain) public {
        uint256 token = uint256(keccak256(bytes(domain)));
        address owner = tokenOwners[token];
        require(owner == address(0x0) || owner == msg.sender);
        if (owner == address(0x0)) {
            _addToken(token, msg.sender);
            tokenOwners[token] = msg.sender;
            tokenDomains[token] = domain;
        }
        domainServers[token] = servers;
    }

    function domainServersLen(string domain) constant public returns(uint) {
        uint256 token = uint256(keccak256(bytes(domain)));
        return domainServers[token].length;
    }

    function domainServer(string domain, uint idx) constant public returns(uint, string) {
        uint256 token = uint256(keccak256(bytes(domain)));
        uint addr = domainServers[token][idx];
        return (addr, uintToIpAddr(addr));
    }


}
