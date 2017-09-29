//import ip from 'ip';

export function isDomainName (rule, value, cb) {
    if (value && !/^[a-z0-9-]+$/.test(value)) return cb('Domain name must contains only a-z 0-9 and - characters');
    if (value && value.length < 3) return cb('Domain name must contains more then 3 characters');
    cb();
}

export function isIpAddr (rule, value, cb) {
    if (value) {
        let oct = value.split('.');
        if (oct.length !== 4) return cb('This is not correct IPv4 address');
        for (let i = 0; i < 4; i++) {
            let num = Number(oct[i]);
            if (num.toString() !== oct[i]) return cb('This is not correct IPv4 address');
            if (num < 0 || num > 255) return cb('This is not correct IPv4 address');
        }
    }
    //if (value && !ip.isV4Format(value))
    cb();
}

export function isEthAddr (rule, value, cb) {
    if (value && !/^0x[0-9a-fA-F]{40}$/.test(value)) return cb('This is not correct Ethereum address');
    cb();
}

