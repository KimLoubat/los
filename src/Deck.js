import React from 'react';
import ReactTooltip from 'react-tooltip';
import './Deck.css';
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import background from "./image/deck.jpg";

function Deck (props) {

    document.body.style.backgroundImage = "url('"+background+"')";

    const [state, setState] = useState({
        allCards: [],
        playerCard: [],
        showDeck: true,
        redirectMatch: false,
        initialized: false,
    });

    const getAll = async() => {
        let url2 = "https://league-of-stones.herokuapp.com/"
        url2 += "cards/getAll"
        url2 += "?token=" + props.token
        
        let responseJson2;
        //await permet d'attendre que le fetch se termine
        let response2 = await fetch(url2, { method: 'GET' });
    
        //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(response2.status === 200){
            responseJson2 = await response2.json()
        }

        if(responseJson2.status === "ok"){
            setState({ ...state, allCards: responseJson2.data, })
        } else {
            alert("Erreur cards/getAll Deck.js")
        }
    }

    function addImg(img) {
        if (state.playerCard.length < 20 ){
            let varTemp = state.playerCard
            varTemp.push(img)
            // state.playerCard.push(img);
            setState({ ...state, playerCard: varTemp }); //state.playerCard.push(img)
            let imgId = state.allCards.indexOf(img);
            if (imgId > -1) {
                const newAllCards = [...state.allCards];
                newAllCards.splice(imgId, 1);
                setState({ ...state, allCards: newAllCards })
            }
        } else {
            //MESSAGE D'erreur on ne peut selectionner plus de 20 cartes
            alert("vous ne pouvez sélectionner plus de cartes")
        }
    }

    function removeImg(img) {
        let imgId = state.playerCard.indexOf(img);
        if (imgId > -1) {
            const newPlayerCard = [...state.playerCard];
            newPlayerCard.splice(imgId, 1);
            setState({ ...state, playerCard: newPlayerCard })
        }
        let varTemp = state.allCards
        varTemp.push(img)
        varTemp.sort((a, b) => (a.name > b.name) ? 1 : -1)
        setState({ ...state, allCards: varTemp });
    }

    const submitDeck = async() => {
        let deckKeys = []
        state.playerCard.map((img, index) => {
            deckKeys.push({ key:img.key })
        })
        // deckKeys += "]"

        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/initDeck"
        url += "?deck=" + JSON.stringify(deckKeys)
        url += "&token=" + props.token
        
        let responseInitDeckJson;
        //await permet d'attendre que le fetch se termine
        let responseInitDeck = await fetch(url, { method: 'GET' });
    
        //"responseInitDeck" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(responseInitDeck.status === 200){
            responseInitDeckJson = await responseInitDeck.json()
        }

        if(responseInitDeckJson.status !== "ok"){
            alert("Erreur match/submit Deck.js")
        }

        setState({ ...state, showDeck: false })
    }

    //Boucle le getState
    useEffect(()=> {
        const id = setInterval(() =>
            getState(), 1000
        );
        return () => clearInterval(id);
    });

    //Permet de savoir si les joueurs ont fait leur deck et doivent aller sur le terrain
    const getState = async() => {

        let url = "https://league-of-stones.herokuapp.com/"
        url += "match/getMatch"
        url += "?token=" + props.token

        let responseGetMatchJson;
        //await permet d'attendre que le fetch se termine
        let responseGetMatch = await fetch(url, { method: 'GET' });
    
        //"responseGetMatch" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(responseGetMatch.status === 200){
            responseGetMatchJson = await responseGetMatch.json()
        }

        if(responseGetMatchJson.status !== "ok"){
            alert("Erreur match/getState Deck.js")
        } else if (state.initialized === false){
            setState({ ...state, initialized: true })
            getAll();
        }

        if(responseGetMatchJson.data.status !== "Deck is pending"){
            setState({ ...state, redirectMatch: true})
        }
    }

    const urlBef = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
    const urlFin = "_0.jpg";
    const disabledSubmit = state.playerCard.length !== 20;
    // passé en let ça fonctionne pas plus
    const nbSelectedCards = 20 - state.playerCard.length

    const allImg = state.allCards.map((img, index) => {
        return(
            <div className="deck card imgCard"  onClick={addImg.bind(this, img)}>
                <h5 className="card-title cardTitleImg">{img.key}</h5>
                <div>
                    <img className="card-img-top" key={index} alt="cartes" src={urlBef + img.key + urlFin} />
                </div>
                <figcaption className="figure-caption">
                    <ul>
                        <li>Attaque : {img.info.attack}</li> 
                        {/* img.stats.attackdamage */}
                        <li>Armure : {img.info.defense}</li>
                        {/* img.stats.armor */}
                    </ul>
                </figcaption>
            </div>
        )
    });
    
    const selectedImg = state.playerCard.map((img, index) => {
        return(
            <div className="deck card imgCard"  onClick={removeImg.bind(this, img)}>
                <h5 className="card-title cardTitleImg">{img.key}</h5>
                <img className="card-img-top" key={index} alt="cartes" src={urlBef + img.key + urlFin}/>
                <figcaption className="figure-caption">
                    <ul>
                        <li>Attaque : {img.info.attack}</li>
                        <li>Armure : {img.info.defense}</li>
                    </ul>
                </figcaption>
            </div>
        )
    
    });
    
    const OurDeck = state.playerCard.map((img, index) => {
        return(
            <div className="deck card imgCard">
                <h5 className="card-title cardTitleImg">{img.key}</h5>
                <img className="card-img-top" key={index} alt="cartes" src={urlBef + img.key + urlFin}/>
                <figcaption className="figure-caption">
                    <ul>
                        <li>Attaque : {img.info.attack}</li>
                        <li>Armure : {img.info.defense}</li>
                    </ul>
                </figcaption>
            </div>
        )
    
    });


    return (
        <div>
            {
                state.redirectMatch &&
                        <Redirect to='/plateau'/>
            }
            {state.showDeck ?
            <div className="row">
                <section className="card cardDeck col myDeck">
                    <h5 className="card-title">Toutes les cartes (139)</h5>
                    <div className="row d-flex justify-content-center imgDeck">
                        {allImg}
                    </div>
                </section>
                <section className="card cardDeck col myDeck">
                    <div className="backgroundDeck">
                        <h5 className="card-title col">Mes cartes {state.playerCard.length}/20
                            <p data-tip="" data-for='submitButtonId'><button className="btn btn-light btn-sm col submitButton" type="submit" disabled={disabledSubmit} onClick={submitDeck.bind(this)}>Valider mes cartes</button></p>
                            <ReactTooltip id='submitButtonId' type='dark' effect='solid'>
                                {disabledSubmit && <span>Vous devez encore sélectionner {nbSelectedCards} {nbSelectedCards === 1 ? " carte" : " cartes"} </span>}
                            </ReactTooltip>
                        </h5>
                        <div className="imgDeck">
                            <div className="row mx-auto d-flex justify-content-start">
                                {selectedImg}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            : //Le else
                <div className="row">
                    <section className="card cardDeck col myDeck">
                        <h5 className="card-title col">Mon deck</h5>
                        <p className="card-text confirmation">Vous avez bien validé vos cartes, voici votre deck actuel</p>
                        <div className="row col mx-auto d-flex justify-content-center">
                            {OurDeck}
                        </div>
                    </section>
                </div>}
        </div>

    )
}


    
export default connect(
    state => ({
        isConnected: state.isConnected,
        name: state.name,
        token: state.token,
        //     joueurId: state.joueurId,
    }),
)(Deck);
