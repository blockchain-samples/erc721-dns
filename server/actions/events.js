import { promisify, web3 } from './utils';

export function SubscribeContractEvents (contract, account, dispatch) {

    const tokenMetadata = promisify(contract.tokenMetadata);

    contract
    .Transfer({ fromBlock: 'latest' })
    .watch(async (error, result) => {
        if (error) return console.log('EVENT ERROR', error.toString());
        if (result.args._from === account) return dispatch({
            type: 'DOMAIN_DEPARTED',
            payload: web3.toHex(result.args._tokenId)
        });
        if (result.args._to === account) {
            let domain = await tokenMetadata(result.args._tokenId);
            return dispatch({
                type: 'DOMAIN_ARRIVED',
                payload: {
                    token: web3.toHex(result.args._tokenId),
                    domain: domain.toString()
                }
            });
        }
    });

    contract
    .SellOrderAdded({ fromBlock: 'latest' })
    .watch(async (error, result) => {
        if (error) return console.log('EVENT ERROR', error.toString());
        let domain = await tokenMetadata(result.args.tokenId);
        dispatch({
            type: 'ORDER_ADDED',
            payload: {
                token:  web3.toHex(result.args.tokenId),
                domain: domain.toString(),
                price: web3.fromWei(result.args.price, 'ether').toNumber()
            }
        });
    });

    contract
    .SellOrderRemoved({ fromBlock: 'latest' })
    .watch((error, result) => {
        if (error) return console.log('EVENT ERROR', error.toString());
        dispatch({
            type: 'ORDER_REMOVED',
            payload: web3.toHex(result.args.tokenId)
        });
    });
}
