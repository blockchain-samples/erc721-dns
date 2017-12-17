import { promisify, range } from './utils';
import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';

export function getDomains () {
    return async (dispatch, getState) => {
        const { account, contract } = getState();
        const balanceOf = promisify(contract.balanceOf);
        const tokenOfOwnerByIndex = promisify(contract.tokenOfOwnerByIndex);
        const tokenMetadata = promisify(contract.tokenMetadata);

        try {
            let len = (await balanceOf(account)).toNumber();
            let domains = await Promise.all(range(len).map(async (_, i) => {
                let token = await tokenOfOwnerByIndex(account, i);
                let domain = await tokenMetadata(token);
                return ({
                    token: web3.toHex(token),
                    domain: domain.toString()
                });
            }));
            dispatch({
                type: 'DOMAINS_RECEIVED',
                payload: domains.reduce((res, cur) => ({...res, [cur.token]: cur}), {})
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()
            });
        }

    };
}

export function selectDomain ({ token, domain }) {
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
            let ordered = orderExists(token);
            let len = (await domainServersLen(domain)).toNumber();
            let nameservers = await Promise.all(
                range(len).map((_, i) => domainServer(domain, i))
            );
            dispatch({
                type: 'DOMAIN_SELECTED',
                payload: {
                    token,
                    domain,
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
        const tokenMetadata = promisify(contract.tokenMetadata);

        try {
            let len = (await sellOrdersLen()).toNumber();
            let orders = await Promise.all(range(len).map(async (_, i) => {
                let order = await getOrder(i);
                let domain = await tokenMetadata(order[0]);
                return ({
                    token: web3.toHex(order[0]),
                    price: web3.fromWei(order[1], 'ether').toNumber(),
                    domain: domain.toString()
                });
            }));
            dispatch({
                type: 'ORDERS_RECEIVED',
                payload: orders.reduce((res, cur) => ({...res, [cur.token]: cur}), {})
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}
