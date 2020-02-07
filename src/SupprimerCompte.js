import React from 'react';
import { connect } from "react-redux";
import ACTIONS from './modules/action';
import { Form, Field } from "react-final-form";
import { Link, Redirect } from "react-router-dom";
import "./SupprimerCompte.css";
import background from "./image/log.jpg";

class SupprimerCompte extends React.Component {

    constructor(props){
        super(props)
        this.state = {redirection: false}
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        document.body.style.backgroundImage = "url('"+background+"')";
    }

    onSubmit(e) {
        let url = "https://league-of-stones.herokuapp.com/"
        url += "users/unsubscribe"
        url += "?email=" + this.props.name
        url += "&password=" + e.password
        url += "&token=" + this.props.token
        fetch(url,
            { 
                method: 'GET',
            })
            //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
            .then((response)=>{
                if(response.status === 200){
                    return response.json()}
                }
            )
            //"response2" est un objet qui ne possède qu'un attribut "token"
            .then(responseJson =>{
                if(responseJson.status === "ok"){
                    this.setState({ redirection: true })
                    this.props.dispatch(ACTIONS.deconnexionAction())
                } else {
                    alert("Mot de passe erroné, impossible de supprimer compte")
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
                <div className="row justify-content-center">
                    <div className="divSupprimerCompte col-md-4">
                        <h3 className="title mt-3">Suppression de compte</h3>
                        <Form
                        onSubmit={ this.onSubmit } /*(e) => this.onSubmit(e)*/
                        render={({ handleSubmit }) => (
                            <form className="form col-md" onSubmit={handleSubmit}>
                                <div className="form-supprimer-compte">
                                    <label className="mt-4">Si vous voulez vraiment supprimer voter compte, tapez votre mot de passe et cliquer sur supprimer</label>
                                    <label className="mt-4">Nom de compte : </label>
                                    <label className="mt-4"> {this.props.name}</label><br/>

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
                                <button type="submit" className="btn btn-danger mt-4">Supprimer</button>
                            </form>
                        )}
                        /> {/* fin du form*/}
                        <h6 className="mt-4"><Link to="/accueil">Annuler</Link></h6>
                    </div>
                </div>
            );
        }
    }

}
export default connect(
    state => ({
        isConnected: state.isConnected,
        name: state.name,
        token: state.token,
        joueurId: state.joueurId,
    }),
)(SupprimerCompte);