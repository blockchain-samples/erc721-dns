pragma solidity ^0.4.0;

contract Inet {
    
    // domain name must contains only 0-9 a-z and - characters
    modifier isDomainName (string domain) {
        bytes memory tmp = bytes(domain);
        require(tmp.length > 1);
        for (uint i = 0; i < tmp.length; i++) {
            require(tmp[i] == 45 || (tmp[i] >= 48 && tmp[i] <= 57) || (tmp[i] >= 97 && tmp[i] <= 122));
        }
        _;
    }
    
    function uintToIpAddr (uint ip) public constant returns(string) {
        uint i = 0;
        bytes memory result = new bytes(15);
        for (int x = 24; x >= 0; x -= 8) {
            uint octet = (ip >> x) & 0xFF;
            uint len = octet > 100 ? 100 : octet > 10 ? 10 : 1;
            for (uint j = len; j >= 1; j = j/10) {
                result[i++] = byte(48 + octet / j);
                octet = octet % j;
            }
            if (x > 0) result[i++] = ".";
        }
        return string(result);
    }
}

