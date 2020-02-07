import ACTIONS from './action';

const defaultState = {
    isConnected: false,
    name: undefined,
    token: undefined,
    joueurId: undefined,
};

const reducer = (state = defaultState, action) => {
    switch(action.type) {
        // case ACTIONS.Types.ACCOUNT_CREATION:
        //     return state;
        case ACTIONS.Types.CONNEXION:
            return {...state, isConnected: true, name: action.name, token: action.token, joueurId: action.joueurId};
        case ACTIONS.Types.DECONNEXION:
            return defaultState;
        default:
            return state;
    }
};

export default reducer;