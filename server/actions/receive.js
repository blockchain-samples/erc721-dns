import axios from 'axios';
import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';

const web3 = window.web3;

export function init(cb) {
    if (!web3) return notification.error({
        message: 'Metamask error',
        description: 'Metamask plugin not installed. Please install the Metamask plugin.'
    });

    let request = axios.get('/init');

    web3.eth.getAccounts((err, accs) => {
        if (err) return notification.error({
            message: 'Metamask error',
            description: err.toString()    
        });

        if (!accs || !accs.length) return notification.error({
            message: 'Metamask error',
            description: 'Please login into Metamask'
        });

        web3.version.getNetwork((err, netId) => {
            if (err) return notification.error({
                message: 'Metamask error',
                description: err.toString()    
            });

            request
            .then(res => {
                if (netId !== res.data.networkId) return notification.error({
                    message: 'Metamask error',
                    description: 'Your Metamask plugin connected to wrong network'
                });
                cb(accs[0], web3.eth.contract(res.data.abi).at(res.data.contract));
            }).catch(err => notification.error({
                message: 'Webserver error',
                description: err.toString()    
            }));
        });
    });
}

export function getDomains (contract, addr, that) {
    that.setState({domains: []},
        () => contract.getYourDomainsCount((err, res) => {
            if (err) return notification.error({
                message: 'Contract error',
                description: err.toString()    
            });

            for (let i = 0; i < res.toNumber(); i++) {
                contract.ownerDomains(addr, i, (err, res) => {
                    if (err) return notification.error({
                        message: 'Contract error',
                        description: err.toString()    
                    });

                    that.setState(s => ({domains: [...s.domains, res.toString()]}));
                });
            }
    }));
}

export function getNameServers (contract, domain, that) {
    that.setState({selected: domain, nameservers: []}, () => 
        contract.getServersCount(domain, (err, res) => {
            if (err) return notification.error({
                message: 'Contract error',
                description: err.toString()    
            });

            for(let i = 0; i < res.toNumber(); i++) {
                contract.getServer(domain, i, (err, res) => {
                    if (err) return notification.error({
                        message: 'Contract error',
                        description: err.toString()    
                    });

                    that.setState(s => ({nameservers: [...s.nameservers, res[1].toString()]}));
                });
            }
    }));
}
