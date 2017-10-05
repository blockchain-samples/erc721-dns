export default function (state = { domains: new Set(), orders: {} }, action = {}) {
    switch (action.type) {
  
        case 'METAMASK_CRITICAL':
            return { ...state, critical: action.payload };

        case 'INIT_COMPLETE':
            return { ...state, ...action.payload };
  
        case 'DOMAINS_RECEIVED':
            return { ...state, domains: new Set(action.payload) };

        case 'DOMAIN_ARRIVED':
            return { ...state, domains: state.domains.add(action.payload) };

        case 'DOMAIN_DEPARTED':
            let _domains = new Set(state.domains);
            _domains.delete(action.payload);
            return { ...state, selected: undefined, domains: _domains };

        case 'DOMAIN_SELECTED':
            return { ...state, selected: action.payload };

        case 'UNSELECT_DOMAIN':
            return { ...state, selected: undefined };

        case 'ORDERS_RECEIVED':
            return { ...state, orders: action.payload.reduce((res, cur) => {
                return {
                    ...res,
                    [cur[0].toString()]: cur[1].toNumber()
                };
            }, {})};
        
        case 'ORDER_ADDED':
            return { ...state, orders: {
                ...state.orders,
                [action.payload.domain.toString()]: action.payload.price.toNumber()
            }};

        case 'ORDER_REMOVED':
            return { ...state, orders: {
                ...state.orders,
                [action.payload.domain.toString()]: undefined
            }};

        default:
            return state;  
    }
}
