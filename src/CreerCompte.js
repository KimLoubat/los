import React from 'react'
import { Form, Field } from "react-final-form"
import { Link, Redirect } from "react-router-dom"
import './CreerCompte.css';
import background from "./image/log.jpg";

export default class CreerCompte extends React.Component {

    constructor(props){
        super(props)
        this.state = {redirection: false}
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        document.body.style.backgroundImage = "url('"+background+"')";
    }

    onSubmit(e) {
        //"e" est l'objet { name: "xxx", username: "xxx", password: "yyy"} 
        if(e.password !== e.verifmdp) {
            alert("Vos mdp ne correspondent pas")
        } else {
            let url = "https://league-of-stones.herokuapp.com/"
            url += "users/subscribe"
            url += "?email=" + e.username
            url += "&name=" + e.name
            url += "&password=" + e.password
            fetch(url,
            { 
                method: 'GET',
            })
            .then((responseSubscribe)=>{
                if(responseSubscribe.status === 200){
                    return responseSubscribe.json()}
                }
            )
            .then((responseSubscribeJson)=>{
                if(responseSubscribeJson.status === "ok"){
                    this.setState({ redirection: true })
                    alert("Compte enregistré !")
                } else {
                    alert("L'utilisateur existe déjà")
                }
            });
        }
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            //Affichage de la redirection
            return <Redirect to='/connexion'/>
        } else {
            return (
                <div className="row justify-content-md-center">
                <div className="divCreerCompte col-md-4">
                    <h3 className="title mt-3">Création de compte</h3>
                    <Form
                    onSubmit={ this.onSubmit } /*(e) => this.onSubmit(e)*/
                    render={({ handleSubmit }) => (
                        <form className="form col-md" onSubmit={handleSubmit}>
                            <div className="form-creer-compte">
                                    <div className="row">
                                <div className="col-md">
                                        <label className="mt-4" id="labelEmail" for="fieldEmail">Nom de compte :</label>
                                        <Field
                                            id="fieldEmail"
                                            name ="username"
                                            component="input"
                                            placeholder="Nom de compte..."
                                            className="form-control"
                                            required
                                        />

                                        <label className="mt-4" id="labelName" htmlFor="fieldName">Pseudo :</label>
                                        <Field
                                            id="fieldName"
                                            name="name"
                                            component="input"
                                            placeholder="ex: petitAventurier"
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <img className="dualcard" src={ require('./image/Cards.png') } />
                                    </div>
                                    </div>
                                <div className="row">
                                    <div className="col-6">
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

                                    <div className="col-6">
                                        <label className="mt-4" id="labelVerifMdp" for="fieldVerifMdp">Confirmation :</label>
                                        <Field
                                            id="fieldVerifMdp"
                                            name ="verifmdp"
                                            component="input"
                                            type="password"
                                            placeholder="Mot de passe..."
                                            className="form-control"
                                            required
                                        />
                                </div>
                            </div>
                            </div>
                            <button type="submit" className="btn btn-warning mt-4">Créer le compte</button>
                        </form>
                    )}
                    /> {/* fin du form*/}
                    <h6 className="mt-4"><Link to="/connexion">J'ai déjà un compte</Link></h6>
                </div>
                </div>
            );
    
        }
        
    }
}