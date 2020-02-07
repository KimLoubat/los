//Types of actions
const Types = {
    CONNEXION: "CONNEXION",
    DECONNEXION: "DECONNEXION",
};

// Actions
//L'action accountCreationAction n'est pas utile car géré dans la page CreerCompte
// accountCreationAction = (pName, pUsername, pPassword) => {
//     return {type: Types.ACCOUNT_CREATION, name: pName, username: pUsername, password: pPassword}
// }
const connexionAction = (pName, pToken, pJoueurId) => {
    return {type: Types.CONNEXION, name: pName, token: pToken, joueurId: pJoueurId}
};
const deconnexionAction = () => ({type: Types.DECONNEXION});

export default {
    Types,
    connexionAction,
    deconnexionAction,
};