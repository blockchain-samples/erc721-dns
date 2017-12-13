pragma solidity ^0.4.0;
import "./DNS_Inet.sol";

contract BlockchainDNS is Inet {
    string public constant name = "Domain Name System based on ERC721 NFT";
    string public constant symbol = "DNS";
    uint256 public totalSupply = 0;

    mapping (uint256 => address) tokenOwners;
    mapping (address => uint256[]) ownedTokens;
    mapping (uint256 => uint256) ownedTokenIdx;
    mapping (uint256 => address) public approved;
    mapping (uint256 => string) tokenDomains;
    mapping (uint256 => uint256[]) domainServers;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

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

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        tokenOwners[_tokenId] = _to;
        _removeToken(_tokenId, _from);
        _addToken(_tokenId, _to);
        approved[_tokenId] = 0x0;
        Transfer(_from, _to, _tokenId);
    }

// ERC 721 methods
    function balanceOf(address owner) public constant returns(uint) {
        return ownedTokens[owner].length;
    }
    
    function ownerOf(uint256 token) public constant returns(address) {
        return tokenOwners[token];
    }

    function tokenOfOwnerByIndex(address owner, uint idx) public constant returns(uint) {
        return ownedTokens[owner][idx];
    }

    function transfer(address _to, uint256 _tokenId) public {
        require(msg.sender == tokenOwners[_tokenId]);
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(tokenOwners[_tokenId] == msg.sender);
        approved[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(approved[_tokenId] == msg.sender);
        _transfer(tokenOwners[_tokenId], msg.sender, _tokenId);
    }

    function tokenMetadata(uint256 _tokenId) public constant returns(string) {
        return tokenDomains[_tokenId];
    }

// Domain methods
    function domainSet(string domain, uint[] servers) isDomainName(domain) public {
        uint256 tokenId = uint256(keccak256(bytes(domain)));
        address owner = tokenOwners[tokenId];
        require(owner == address(0x0) || owner == msg.sender);
        if (owner == address(0x0)) {
            _addToken(tokenId, msg.sender);
            tokenOwners[tokenId] = msg.sender;
            tokenDomains[tokenId] = domain;
            totalSupply++;
            Transfer(0x0, msg.sender, tokenId);
        }
        domainServers[tokenId] = servers;
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

