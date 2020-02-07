import React from 'react';
import { Form, Field } from "react-final-form"
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux";
import './Connexion.css';
import ACTIONS from './modules/action';

import background from './image/log.jpg';

class Connexion extends React.Component {

    constructor(props){
        super(props)
        this.state = {redirection: false}
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        document.body.style.backgroundImage = "url('"+background+"')";
    }

    onSubmit(e) {
        //"e" est l'objet { username: "xxx", password: "yyy"}
        let url = "https://league-of-stones.herokuapp.com/"
        url += "users/connect"
        url += "?email=" + e.username
        url += "&password=" + e.password
        fetch(url,
            {
                method: 'GET',
            })
            //"responseConnect" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
            .then((responseConnect)=>{
                    if(responseConnect.status === 200){
                        return responseConnect.json()}
                }
            )
            //"responseConnect2" est un objet qui ne possède qu'un attribut "token"
            .then(responseConnectJson =>{
                if(responseConnectJson.status === "ok"){
                    this.setState({ redirection: true })
                    this.props.dispatch(ACTIONS.connexionAction(e.username, responseConnectJson.data.token, responseConnectJson.data.id))
                } else {
                    alert("Identifiants incorrects")
                }
            })
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            //Affichage de la redirection
            return <Redirect to='/accueil'/>
        } else {
            return (
                <div className="mother1">
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="divConnexion col-md-4">
                                <h5 className="title mt-3">J'ai déjà un compte League Of Stones</h5>
                                <Form
                                    onSubmit={ this.onSubmit }
                                    render={({ handleSubmit }) => (
                                        <form className="form col-md" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label className="mt-4" id="labelEmail" for="fieldEmail">Nom de compte :</label>
                                                <Field
                                                    id="fieldEmail"
                                                    name ="username"
                                                    component="input"
                                                    placeholder="Entrez votre nom de compte..."
                                                    className="form-control"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="mt-4" id="labelMdp" for="fieldMdp">Mot de passe :</label>
                                                <Field
                                                    id="fieldMdp"
                                                    name ="password"
                                                    component="input"
                                                    type="password"
                                                    placeholder="Mot de passe..."
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" class="btn btn-warning mt-4">Se Connecter</button>
                                        </form>
                                    )}
                                /> {/* fin du form*/}
                                <h6 className="mt-4"><Link to="/creationdecompte">M'inscrire</Link></h6>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect()(Connexion);


// state => ({
//     isConnected: state.isConnected,
//     name: state.name,
//     token: state.token,
//     joueurId: state.joueurId,
// }),

//Fonctionnement :
// connect = (mapStateToProps) => (component) => {
//     return <Component dispatch=dispatch props=mapStateToProps() />
// }
//export default connect(mapStateToProps)(Connextion) => <Connexion dispatch props>


