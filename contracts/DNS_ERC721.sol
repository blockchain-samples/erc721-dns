pragma solidity ^0.4.0;
import "./DNS_Inet.sol";

contract ERC721 {
    string public constant name = "Domain Name System based on ERC721 NFT";
    string public constant symbol = "DNS";
    uint256 public totalSupply = 0;

    mapping (uint256 => address) tokenOwners;
    mapping (address => uint256[]) ownedTokens;
    mapping (uint256 => uint256) ownedTokenIdx;
    mapping (uint256 => address) public approved;
    mapping (uint256 => string) metadata;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    modifier onlyOwner(uint256 _tokenId) {
        require(msg.sender == tokenOwners[_tokenId]);
        _;
    }

    function _addToken(uint256 _tokenId, address _to) internal {
        require(ownedTokenIdx[_tokenId] == 0);
        ownedTokens[_to].push(_tokenId);
        ownedTokenIdx[_tokenId] = ownedTokens[_to].length;
    }

    function _removeToken(uint256 _tokenId, address _from) private {
        uint last = ownedTokens[_from].length - 1;
        uint idx = ownedTokenIdx[_tokenId];
        require(idx != 0);
        if (idx <= last) {
            ownedTokens[_from][idx - 1] = ownedTokens[_from][last];
            ownedTokenIdx[last] = idx;
        }
        ownedTokenIdx[_tokenId] = 0;
        ownedTokens[_from].length = last;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        tokenOwners[_tokenId] = _to;
        _removeToken(_tokenId, _from);
        _addToken(_tokenId, _to);
        approved[_tokenId] = 0x0;
        Transfer(_from, _to, _tokenId);
    }

// ERC 721 methods
    function balanceOf(address _owner) public constant returns(uint) {
        return ownedTokens[_owner].length;
    }
    
    function ownerOf(uint256 _tokenId) public constant returns(address) {
        return tokenOwners[_tokenId];
    }

    function tokenOfOwnerByIndex(address _owner, uint _idx) public constant returns(uint) {
        require(_idx < ownedTokens[_owner].length);
        return ownedTokens[_owner][_idx];
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        approved[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(approved[_tokenId] == msg.sender);
        _transfer(tokenOwners[_tokenId], msg.sender, _tokenId);
    }

    function tokenMetadata(uint256 _tokenId) public constant returns(string) {
        return metadata[_tokenId];
    }
}
