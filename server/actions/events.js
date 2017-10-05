
export function SubscribeContractEvents (contract, account, dispatch) {

    contract
    .DomainTransfered({ fromBlock: 'latest' })
    .watch(function(error, result){
        if (error) return console.log('EVENT ERROR', error.toString());
        if (result.args.from === account) return dispatch({
            type: 'DOMAIN_DEPARTED',
            payload: result.args.domain
        });
        if (result.args.to === account) return dispatch({
            type: 'DOMAIN_ARRIVED',
            payload: result.args.domain
        });
    });

    contract
    .SellOrderAdded({ fromBlock: 'latest' })
    .watch(function(error, result){
        if (error) return console.log('EVENT ERROR', error.toString());
        dispatch({
            type: 'ORDER_ADDED',
            payload: result.args
        });
    });

    contract
    .SellOrderRemoved({ fromBlock: 'latest' })
    .watch(function(error, result){
        if (error) return console.log('EVENT ERROR', error.toString());
        dispatch({
            type: 'ORDER_REMOVED',
            payload: result.args
        });
    });
}
