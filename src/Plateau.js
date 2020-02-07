import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import './Plateau.css';
import background from './image/plateau.jpg';
import './Deck.css';

function Plateau (props) {

    const [state, setState] = useState({
        finMatch: false, //false par défaut, true si match terminé
        hpJ1: 150,
        handJ1: [],
        boardJ1: [],
        deckJ1: [],
        cardPickedJ1: false,
        turnJ1: true,
        hpJ2: 150,
        handJ2: [],
        boardJ2: [],
        deckJ2: [],
        attacker: undefined,
    });

    document.body.style.backgroundImage="url("+background+")";

    //Boucle le getState
    useEffect(()=> {
        if(state.finMatch === false){
            const id = setInterval(() =>
                getState(), 1000
            );
            return () => clearInterval(id);
        }
    });

    const getState = async() => {

        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/getMatch"
        url += "?token=" + props.token

        let responseGetMatchJson;
        //await permet d'attendre que le fetch se termine
        let response = await fetch(url, { method: 'GET' });
    
        //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(response.status === 200){
            responseGetMatchJson = await response.json()
        }

        if(responseGetMatchJson.status === "ok"){
            if(responseGetMatchJson.data.status === "Turn : player 1" || responseGetMatchJson.status === "Turn : player 2"){
                if(props.joueurId === responseGetMatchJson.data.player1.id){
                    setState({ ...state, hpJ1: responseGetMatchJson.data.player1.hp, handJ1: responseGetMatchJson.data.player1.hand, boardJ1: responseGetMatchJson.data.player1.board, deckJ1: responseGetMatchJson.data.player1.deck, turnJ1: responseGetMatchJson.data.player1.turn, cardPickedJ1: responseGetMatchJson.data.player1.cardPicked, hpJ2: responseGetMatchJson.data.player2.hp, handJ2: responseGetMatchJson.data.player2.hand, boardJ2: responseGetMatchJson.data.player2.board, deckJ2: responseGetMatchJson.data.player2.deck })
                } else {
                    setState({ ...state, hpJ1: responseGetMatchJson.data.player2.hp, handJ1: responseGetMatchJson.data.player2.hand, boardJ1: responseGetMatchJson.data.player2.board, deckJ1: responseGetMatchJson.data.player2.deck, turnJ1: responseGetMatchJson.data.player2.turn, cardPickedJ1: responseGetMatchJson.data.player2.cardPicked, hpJ2: responseGetMatchJson.data.player1.hp, handJ2: responseGetMatchJson.data.player1.hand, boardJ2: responseGetMatchJson.data.player1.board, deckJ2: responseGetMatchJson.data.player1.deck })
                }
            } else {
                alert("Fin du match")
                if((responseGetMatchJson.data.status === "Player 1 won" && props.joueurId === responseGetMatchJson.data.player1.id) || (responseGetMatchJson.data.status === "Player 2 won" && props.joueurId === responseGetMatchJson.data.player2.id)  ){
                    setState({ ...state, finMatch: true })
                }
                await finishMatch()
            }
        } else {
            alert("Vous avez perdus ...")
            setState({ ...state, finMatch: true })
        }

    }


    const finishMatch = async() => {
        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/finishMatch"
        url += "?token=" + props.token
        
        await fetch(url, { method: 'GET' });
    }


    const pickCard = async() => {
        if(state.turnJ1 === true){
            if(state.cardPickedJ1){
                alert("Vousa vez déjà pioché ce tour ci")
            } else {
                let url = "https://league-of-stones.herokuapp.com/"
                url += "match/pickCard"
                url += "?token=" + props.token
        
                let responsePickCardJson;
                //await permet d'attendre que le fetch se termine
                let responsePickCard = await fetch(url, { method: 'GET' });
            
                //"responsePickCard" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
                if(responsePickCard.status === 200){
                    responsePickCardJson = await responsePickCard.json()
                }
                let newHand = [state.handJ1]
                newHand.push(responsePickCardJson.data)
            }
        } else {
            alert("Patientez, ce n'est pas à vous de jouer")
        }
    }

    const playCard = async(cardKey) => {
        if(state.turnJ1 === true){
            if(state.boardJ1.length < 5){
                let url = "https://league-of-stones.herokuapp.com/"
                url += "match/playCard"
                url += "?card=" + cardKey
                url += "&token=" + props.token

                let responseplayCardJson;
                //await permet d'attendre que le fetch se termine
                let responseplayCard = await fetch(url, { method: 'GET' });
            
                //"responseplayCard" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
                if(responseplayCard.status === 200){
                    responseplayCardJson = await responseplayCard.json()
                }

                if(responseplayCardJson.status !== "ok"){

                    alert("Erreur match/playCard Plateau.js")
                }

            } else {
                alert("Vous ne pouvez avoir que 5 cartes sur le board à la fois !")
            }
        } else {
            alert("Patientez, ce n'est pas à vous de jouer")
        }
    }

    const chooseAttacker = async(allyCardKey) => {
        setState({ ...state, attacker: allyCardKey, defenser: undefined })
    }

    const chooseDefenser = async(ennemyCardKey) =>{
        if(ennemyCardKey === "ennemy"){
            if(state.boardJ2.length > 0){
                alert("Vous ne pouvez pas attaquer le champion ennemi tant qu'il reste des cartes sur le plateau")
            } else {
                attackPlayer(state.attacker)
            }
        } else {
            attackCard(state.attacker, ennemyCardKey)
        }
        setState({ ...state, attacker: undefined })
    }

    const attackCard = async(allyDardKey, ennemyCardKey) => {
        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/attack"
        url += "?card=" + allyDardKey
        url += "&ennemyCard=" + ennemyCardKey
        url += "&token=" + props.token

        let responseattackJson;
        //await permet d'attendre que le fetch se termine
        let responseplayCard = await fetch(url, { method: 'GET' });
    
        //"responseplayCard" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(responseplayCard.status === 200){
            responseattackJson = await responseplayCard.json()
        }

        if(responseattackJson.message === "This card has already attacked"){
            alert("Vous ne pouvez pas attaquer 2 fois avec le même champion ou après avoir posé votre champion")
        }
    }

    const attackPlayer = async(allyDardKey) => {
        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/attackPlayer"
        url += "?card=" + allyDardKey
        url += "&token=" + props.token

        let responseattackPlayerJson;
        //await permet d'attendre que le fetch se termine
        let responseplayCard = await fetch(url, { method: 'GET' });
    
        //"responseplayCard" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(responseplayCard.status === 200){
            responseattackPlayerJson = await responseplayCard.json()
        }

        if(responseattackPlayerJson.message === "This card has already attacked"){
            alert("Vous ne pouvez pas attaquer 2 fois avec le même champion ou après avoir posé votre champion")
        }
    }

    const endTurn = async() => {
        if(state.turnJ1 === false){
            alert("Patientez, ce n'est pas à vous de jouer")
        } else {
            let url = "https://league-of-stones.herokuapp.com/"
            url += "match/endTurn"
            url += "?token=" + props.token
    
            let responseEndTurnJson;
            //await permet d'attendre que le fetch se termine
            let responseEndTurn = await fetch(url, { method: 'GET' });
        
            //"responseEndTurn" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
            if(responseEndTurn.status === 200){
                responseEndTurnJson = await responseEndTurn.json()
            }

            if(responseEndTurnJson.status !== "ok"){
                alert("Erreur match/endTurn Plateau.js")
            }
        }
    }

    const endMatch = async() => {
        //Si carte posée au tour même, pas possible de l'utiliser
        // requete match/endTurn
        //update les turns automatiquement
    }

    const urlBef = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
    const urlFin = "_0.jpg";


    const allyBoard = state.boardJ1.map((img, index) => {
        return(
            <div className="col-sm-2">
                <div className="deck card" onClick={chooseAttacker.bind(this, img.key)}>
                    <h5 className="card-title cardTitleImg">{img.key}</h5>
                    <div>
                        <img className="card-img-top" key={index} alt={img.key} src={urlBef + img.key + urlFin} />
                    </div>
                    <figcaption className="figure-caption">
                        <ul>
                            <li>Attaque : {img.stats.attackdamage}</li> 
                            {/* img.stats.attackdamage */}
                            <li>Armure : {img.stats.armor}</li>
                            {/* img.stats.armor */}
                        </ul>
                    </figcaption>
                </div>
            </div>
        )
    });


    const allyHand = state.handJ1.map((img, index) => {
        return(
            <div className="col-sm-2">
                <div className="deck card" onClick={playCard.bind(this, img.key)}>
                    <h5 className="card-title cardTitleImg">{img.key}</h5>
                    <div>
                        <img className="card-img-top" key={index} alt={img.key} src={urlBef + img.key + urlFin} />
                    </div>
                    <figcaption className="figure-caption">
                        <ul>
                            <li>Attaque : {img.stats.attackdamage}</li> 
                            {/* img.stats.attackdamage */}
                            <li>Armure : {img.stats.armor}</li>
                            {/* img.stats.armor */}
                        </ul>
                    </figcaption>
                </div>
            </div>
        )
    });

    const ennemyBoard = state.boardJ2.map((img, index) => {
        return(
            <div className="col-sm-2">
                <div className="deck card" onClick={chooseDefenser.bind(this, img.key)}>{/* onClick={playCard.bind(this, idCard)} */}
                    <h5 className="card-title cardTitleImg">{img.key}</h5>
                    <div>
                        <img className="card-img-top" key={index} alt={img.key} src={urlBef + img.key + urlFin} />
                    </div>
                    <figcaption className="figure-caption">
                        <ul>
                            <li>Attaque : {img.stats.attackdamage}</li> 
                            {/* img.stats.attackdamage */}
                            <li>Armure : {img.stats.armor}</li>
                            {/* img.stats.armor */}
                        </ul>
                    </figcaption>
                </div>
            </div>
        )
    });

    function getEnnemyHand(a){
        let i = 0;
        var ennemyHand = "";
        for(i; i < a; i++ ){
            ennemyHand += 
                <div className="col-sm-2">
                    <div className="deck card"  >
                        <h5 className="card-title cardTitleImg">Card {i}</h5>
                    </div>
                </div>
            ;
        }    
        return ennemyHand;
    }

    // const ennemyHand = state.handJ2.map((index) => {
    //     return(
    //         <div className="col-sm-2">
    //             <div className="deck card"  >{/* onClick={playCard.bind(this, idCard)} */}
    //                 <h5 className="card-title cardTitleImg">Card {index}</h5>
    //                 {/* <div>
    //                     <img className="card-img-top" key={index} alt={img.key} src={urlBef + img.key + urlFin} />
    //                 </div> */}
    //             </div>
    //         </div>
    //     )
    // });
    

    return (
        <div>
        {
            state.finMatch &&
            <Redirect to='/accueil'/>
        }
            <div className="grillePlateau">
                <div className="noName">
                    <div className="row ennemis">


                        {/* pseudo + pv */}
                        <div className="col-sm-2 fullCol">
                            <div className="row h-50 justify-content-center">
                                <div className="col-md-6 ">
                                    <div className="row nomA">
                                        <img className="nemesis" src={ require('./image/nemesis.png') } alt="icone adverse" onClick={chooseDefenser.bind(this, "ennemy")} />
                                        <label><b>Adversaire</b></label><br/>
                                    </div>
                                    <div className="row pvA">
                                        <label><b>PV :{state.hpJ2}</b></label>
                                    </div>

                                </div>
                            </div>
                            {
                                state.turnJ1 === true &&
                                <>
                                    <b>C'est votre tour</b>
                                </>
                            }
                            {
                                state.turnJ1=== false &&
                                <>
                                <b>C'est au tour de votre adversaire</b>
                                </>
                            }
                            <div className="row h-50 justify-content-center">
                                <div className="col-md-6 ">
                                    <div className="row nomJ ">
                                        <label><b>Vous</b></label><br/>
                                    </div>
                                    <div className="row pvJ">
                                        <label><b>PV :{state.hpJ1}</b></label>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* cartes + deck */}
                        <div className="col-sm-8">

                            {/* deck adverse */}
                            <div className="row h-25 ">
                                <div className="d-flex justify-content-center">
                                    {/* Pour chaque elem de handJ1 créer une col contenant la card dynamiquement*/}
                                    {getEnnemyHand(state.handJ2)}
                                </div>
                            </div>
                            {/* plateau adverse */}
                            <div className="row h-25 ">
                                <div className="d-flex justify-content-center">
                                    {/* Pour chaque elem de boardJ1 créer une col contenant la card dynamiquement*/}
                                    {ennemyBoard}
                                </div>
                            </div>
                            {/* mon plateau */}
                            <div className="row h-25 ">
                                <div className="d-flex justify-content-center">
                                    {/* Pour chaque elem de boardJ2 créer une col contenant la card dynamiquement*/}
                                    {allyBoard}
                                </div>
                            </div>
                            {/* Mon deck */}
                            <div className="row ">
                                <div className="d-flex justify-content-center">
                                    {/* Pour chaque elem de handJ2 créer une col contenant la card dynamiquement*/}
                                    {allyHand}
                                </div>
                            </div>
                        </div>


                        {/* pioche + fin tour */}
                        <div className="col-sm-2">
                            <div className="row h-50">
                                <div className="col">
                                    <div className="row">
                                        <img className="piocheA" src={ require('./image/dos.png') } alt="Pioche adversaire" />
                                    </div>
                                </div>
                            </div>
                            <div className="row h-50">
                                <div className="col">
                                    <div className="row">
                                        <img className="piocheJ" src={ require('./image/dos.png') } alt="Pioche joueur" onClick={pickCard.bind(this)}/>
                                    </div>
                                    <div className="row actionJ">
                                        <div className="col">
                                            <button type="button" className="btn btn-warning" onClick={endTurn.bind(this)}>Passer le tour</button>
                                        </div>
                                        <div className="col">
                                            <button type="button" className="btn btn-danger">Abandonner</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    )
}



export default connect(
    state => ({
        isConnected: state.isConnected,
        name: state.name,
        token: state.token,
        joueurId: state.joueurId,
    }),
)(Plateau);