pragma solidity ^0.4.0;

contract DomainListingByOwner {
    
    mapping (address => string[]) public domainListing;
    mapping (string => uint) domainListingIdx;
    
    function domainListingLen(address owner) constant public returns(uint) {
        return domainListing[owner].length;
    }

    event ListingUpdated(address owner, string domain, bool added);

    function addDomainToListing(address owner, string domain) internal {
        domainListing[owner].push(domain);
        domainListingIdx[domain] = domainListing[owner].length;
        ListingUpdated(owner, domain, true);
    }
    
    function removeDomainFromListing(address owner, string domain) internal {
        uint idx = domainListingIdx[domain];
        if (idx == 0) return;
        uint last = domainListing[owner].length - 1;
        if (idx <= last) {
            domainListingIdx[domainListing[owner][last]] = idx;
            domainListing[owner][idx - 1] = domainListing[owner][last];
        }
        domainListingIdx[domain] = 0;
        domainListing[owner].length = last;
        ListingUpdated(owner, domain, false);
    }
}

