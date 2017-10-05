import { promisify, range } from './utils';
import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';

export function getDomains () {
    return async (dispatch, getState) => {
        const { account, contract } = getState();
        const domainListingLen = promisify(contract.domainListingLen);
        const domainListing = promisify(contract.domainListing);

        try {
            let len = (await domainListingLen(account)).toNumber();
            let domains = await Promise.all(
                range(len).map((_, i) => domainListing(account, i))
            );
            dispatch({
                type: 'DOMAINS_RECEIVED',
                payload: domains.map(domain => domain.toString())
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()
            });
        }

    };
}

export function selectDomain ({ domain }) {
    return async (dispatch, getState) => {
        dispatch({
            type: 'DOMAIN_LOADING',
            payload: true
        });

        const { contract } = getState();
        const domainServersLen = promisify(contract.domainServersLen);
        const domainServer = promisify(contract.domainServer);
        const orderExists = promisify(contract.orderExists);
    
        try {
            let ordered = orderExists(domain);
            let len = (await domainServersLen(domain)).toNumber();
            let nameservers = await Promise.all(
                range(len).map((_, i) => domainServer(domain, i))
            );
            dispatch({
                type: 'DOMAIN_SELECTED',
                payload: {
                    domain: domain,
                    nameservers: nameservers.map(server => server[1].toString()),
                    ordered: await ordered
                }
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    
    }
}

export function getOrders () {
    return async (dispatch, getState) => {
        dispatch({
            type: 'ORDERS_LOADING',
            payload: true
        });

        const { contract } = getState();
        const sellOrdersLen = promisify(contract.sellOrdersLen);
        const getOrder = promisify(contract.orders);

        try {
            let len = (await sellOrdersLen()).toNumber();
            let orders = await Promise.all(range(len).map((_, i) => getOrder(i)));
            dispatch({
                type: 'ORDERS_RECEIVED',
                payload: orders
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}
