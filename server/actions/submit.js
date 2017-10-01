import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';
import { getDomains } from './receive';

const web3 = window.web3;

function checkReceipt (tx, cb) {
    web3.eth.getTransactionReceipt(tx, (err, receipt) => {
        if (err) return notification.error({
            message: 'Transaction error',
            description: err.toString()
        });
        if (receipt) cb(receipt);
        else setTimeout(() => this.checkReceipt(tx, cb), 1000);
    });
}

function txProcess (err, tx, contract, addr, that) {
    if (err) return notification.error({
        message: 'Transaction error',
        description: err.toString()
    });

    notification.success({
        message: 'Transaction sent',
        description: `Transaction been sent with tx hash ${tx}`
    });

    checkReceipt(tx, () => getDomains(contract, addr, that));
}

export function saveDomain (contract, addr, that) {
    return (form) =>
        contract.domainSet(form.domain, form.nameservers, (err, tx) =>
            txProcess(err, tx, contract, addr, that));
}

export function transferDomain (contract, addr, that) {
    return (form) => {
        console.log('TRANSFER', form.domain, form.address);
        contract.transfer(form.domain, form.address, (err, tx) =>
            txProcess(err, tx, contract, addr, that));
    };
}

