export const promisify = (fn) => (...p) =>
    new Promise((resolve, reject) => fn(...p, (err, res) =>
        err ? reject(err) : resolve(res)));

export const range = (len) => new Array(len).fill(null);

export const web3 = window.web3;
