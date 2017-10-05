import { promisify } from './utils';
import notification from 'antd/lib/notification';
import 'antd/lib/notification/style/css';

export function saveDomain (form) {
    return async (dispatch, getState) => {
        const { contract } = getState();
        const domainSet = promisify(contract.domainSet);
        try {
            let tx = await domainSet(form.domain, form.nameservers);
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.success({
                message: 'Transaction sent',
                description: `Transaction been sent with tx hash ${tx}`
            });
        } catch (error) {
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}

export function transferDomain (form) {
    return async (dispatch, getState) => {
        const { contract } = getState();
        const transfer = promisify(contract.transfer);
        try {
            let tx = await transfer(form.domain, form.address, {gas: 200000});
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.success({
                message: 'Transaction sent',
                description: `Transaction been sent with tx hash ${tx}`
            });
        } catch (error) {
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}

export function addSellOrder (form) {
    return async (dispatch, getState) => {
        const { contract } = getState();
        const addSellOrder = promisify(contract.addSellOrder);
        try {
            let tx = await addSellOrder(form.domain, web3.toWei(form.price, 'ether'));
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.success({
                message: 'Transaction sent',
                description: `Transaction been sent with tx hash ${tx}`
            });
        } catch (error) {
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}

export function removeSellOrder () {
    return async (dispatch, getState) => {
        const { contract, selected } = getState();
        const removeSellOrder = promisify(contract.removeSellOrder);
        try {
            let tx = await removeSellOrder(selected.domain, {gas: 200000});
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.success({
                message: 'Transaction sent',
                description: `Transaction been sent with tx hash ${tx}`
            });
        } catch (error) {
            dispatch({ type: 'UNSELECT_DOMAIN' });
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}

export function orderBuy (order) {
    return async (dispatch, getState) => {
        const { contract } = getState();
        const orderBuy = promisify(contract.orderBuy);
        try {
            let tx = await orderBuy(order.domain, {value: order.price, gas: 200000});
            return notification.success({
                message: 'Transaction sent',
                description: `Transaction been sent with tx hash ${tx}`
            });
        } catch (error) {
            return notification.error({
                message: 'Contract error',
                description: error.toString()    
            });
        }
    }
}

