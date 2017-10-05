import axios from 'axios';
import { web3, promisify } from './utils';
import { getDomains, getOrders } from './receive';
import { SubscribeContractEvents } from './events';

export function init () {
    return async (dispatch, getState) => {
        if (!web3) return dispatch({
            type: 'METAMASK_CRITICAL',
            payload: 'Metamask plugin not installed. Please install the Metamask plugin.'
        });

        const getAccounts = promisify(web3.eth.getAccounts);
        const getNetwork = promisify(web3.version.getNetwork);
    
        try {
            let accounts = getAccounts();
            let request = axios.get('/init');
            let networkId = getNetwork();
    
            accounts = await accounts;
            if (!Array.isArray(accounts) || !accounts.length) return dispatch({
                type: 'METAMASK_CRITICAL',
                payload: 'Please login into Metamask'
            });
    
            request = await request;
            networkId = await networkId;
    
            if (networkId !== request.data.networkId) return dispatch({
                type: 'METAMASK_CRITICAL',
                payload: 'Your Metamask plugin connected to wrong network'
            });
    
            const contract = web3.eth
                .contract(request.data.abi)
                .at(request.data.contract);

            dispatch({
                type: 'INIT_COMPLETE',
                payload: {
                    account: accounts[0],
                    contract
                }
            });

            getDomains()(dispatch, getState);
            getOrders()(dispatch, getState);

            SubscribeContractEvents(contract, accounts[0], dispatch);

        } catch (error) {
            dispatch({
                type: 'METAMASK_CRITICAL',
                payload: error.toString()
            });
        }
    }
}
