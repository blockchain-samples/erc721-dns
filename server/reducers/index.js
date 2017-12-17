export default function (state = { domains: {}, orders: {} }, action = {}) {
    switch (action.type) {
  
        case 'METAMASK_CRITICAL':
            return { ...state, critical: action.payload };

        case 'INIT_COMPLETE':
            return { ...state, ...action.payload };
  
        case 'DOMAINS_RECEIVED':
            return { ...state, domains: action.payload };

        case 'DOMAIN_ARRIVED':
            return { ...state, domains: {
                ...state.domains, [action.payload.token]: action.payload
            }};

        case 'DOMAIN_DEPARTED':
            return { ...state, selected: undefined, domains: {
                ...state.domains, [action.payload]: undefined
            } };

        case 'DOMAIN_SELECTED':
            return { ...state, selected: action.payload };

        case 'UNSELECT_DOMAIN':
            return { ...state, selected: undefined };

        case 'ORDERS_RECEIVED':
            return { ...state, orders: action.payload };
        
        case 'ORDER_ADDED':
            return { ...state, orders: {
                ...state.orders, [action.payload.token]: action.payload
            }};

        case 'ORDER_REMOVED':
            return { ...state, orders: {
                ...state.orders, [action.payload]: undefined
            }};

        default:
            return state;  
    }
}
