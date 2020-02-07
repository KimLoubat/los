import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import ACTIONS from './modules/action';

class Navbar extends React.Component {

    deconnexion(){
        let url = "https://league-of-stones.herokuapp.com/"
        url += "users/disconnect"
        fetch(url,
            { 
                method: 'GET',
            })
            //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
            .then((responseDisconnect)=>{
                if(responseDisconnect.status === 200){
                    return responseDisconnect.json()}
                }
            )
            //"responseDisconnect2" est un objet qui ne possède qu'un attribut "token"
            .then(responseDisconnectJson =>{
                if(responseDisconnectJson.status === "ok"){
                    this.setState({ redirection: true })
                    this.props.dispatch(ACTIONS.deconnexionAction())
                } else {
                    alert("Erreur lors de la deconnexion")
                }
            })
        }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark row">
                <span class="nav-item font-weight-normal col-md-4 text-left">
                    <Link to="/accueil">League Of Stones</Link>
                </span>
                { 
                    this.props.isConnected &&
                    <>
                    <span class="nav-item font-weight-normal col-md-4">
                        <Link to="/lobby">Trouver un match</Link>
                    </span>
                        <span class="nav-item font-weight-normal col-md-2">
                            <a href='javascript:void(0);'  onClick={(e) => this.deconnexion()}>Deconnexion</a>
                        </span>
                        <span class="nav-item font-weight-normal col-md-2">
                            <Link to="/desinscription">Désinscription</Link>
                        </span>
                    </>
                }
                {
                    !this.props.isConnected &&
                    <>
                    <span class="nav-item font-weight-normal col-md-4">
                        <Link to="/accueil">Accueil</Link>
                    </span>
                    <span class="font-weight-normal col-md-2 text-right">
                        <Link to="/creationdecompte">Inscription</Link>
                    </span>
                    <span className="font-weight-normal col-md-2 text-right">
                        <Link to="/connexion">Connexion</Link>
                    </span>
                    </>
                }
                <br/>
            </nav>
        );
    }
}

export default connect(
    state => ({
        isConnected: state.isConnected,
        name: state.name,
        token: state.token,
        joueurId: state.joueurId,
    }),
)(Navbar);


