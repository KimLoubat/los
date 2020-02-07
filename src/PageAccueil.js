import React from 'react'
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import './PageAccueil.css';
import background from './image/home.png';

class PageAccueil extends React.Component {

    componentDidMount() {
        document.body.style.backgroundImage="url("+background+")";
    }

    render() {
        return (
            <div className="mother">
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="divRules">
                                <article>
                                    <p> <h3>Les Règles </h3></p>
                                    <p>Au début de la partie, les deux joueurs piochent 4 cartes. Durant son tour, un joueur peut effectuer 3 actions dans l’ordre qu’il le souhaite :</p>
                                    <p>Piocher une carte (une fois par tour)</p>
                                    <p>Poser une carte sur le plateau (au maximum 5 par joueur sur le plateau)</p>
                                    <p>Attaquer (une fois par carte sur le plateau)
                                        Une carte posée sur le plateau durant ce tour ne pourra attaquer qu’au tour suivant. Au tour suivant la carte peut attaquer un monstre sur le plateau adverse. Résolution de l’attaque :</p>
                                    <p>Si la valeur d’attaque de la carte qui attaque est supérieure à la valeur de défense de la carte adverse alors cette dernière est supprimée et la différence entre les deux valeurs de carte est retirée aux points de vie de l’adversaire.
                                    </p>
                                    <p>Si les deux cartes ont une attaque et une défense égales alors les deux cartes sont détruites.</p>
                                    <p>Si la valeur d’attaque est inférieure à la valeur de défense alors la carte attaquante est détruite.</p>
                                    <p>S’il n’y a aucune carte sur le plateau adverse alors la carte peut directement attaquer les points de vie de l’adversaire.</p>
                                </article>
                            </div>
                        </div>
                        <div className="col-md">
                            <aside className="asideTitle"><h4>Bienvenue dans le monde de League of Stones aventurier !</h4></aside>
                            {
                                this.props.isConnected === true &&
                                <>
                                    <aside className="asideLogSign"> <Link to="/lobby">Trouver une partie></Link></aside>
                                </>
                            }
                            {
                                this.props.isConnected === false &&
                                <>
                                    <aside className="asideLogSign">Je suis déjà joueur : <Link to="/connexion">me connecter></Link></aside>
                                    <aside className="asideLogSign">Je suis nouveau : <Link to="/creationdecompte">m'inscrire></Link></aside>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default connect(
    state => ({
        isConnected: state.isConnected,
        name: state.name,
        token: state.token,
        joueurId: state.joueurId,
    }),
)(PageAccueil);