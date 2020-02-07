import React from 'react'
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Redirect } from 'react-router-dom';
import background from "./image/lobby.jpg";
import './Lobby.css'

function Lobby (props) {
    document.body.style.backgroundImage = "url('"+background+"')";

    const [state, setState] = useState({
        matchmakingId: undefined,
        request: undefined,
        playersList: undefined,
        match: undefined,
    });

    useEffect(()=> {
        const id = setInterval(() =>
            getState(), 1000
        );
        return () => clearInterval(id);
    });

    const getState = async() => {

        //Requête pour games
        let url = "https://league-of-stones.herokuapp.com/"
        url += "matchmaking/participate"
        url += "?token=" + props.token
    
        let responseJson;
        //await permet d'attendre que le fetch se termine
        let response = await fetch(url, { method: 'GET' });
    
        //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(response.status === 200){
            responseJson = await response.json()
        }

        //Requêtes pour joueurs
        let url2 = "https://league-of-stones.herokuapp.com/"
        url2 += "matchmaking/getAll"
        url2 += "?token=" + props.token

        let responseJsonGetAll;
        //await permet d'attendre que le fetch se termine
        let responseGetAll = await fetch(url2, { method: 'GET' });
    
        //"response" est la réponse de la méthode POST, renvoie un objet avec l'attribut status
        if(responseGetAll.status === 200){
            responseJsonGetAll = await responseGetAll.json()
        }
    
        //"responseJson" est un objet qui possède les attributs matchmakingId et request
        if(responseJson.status === "ok" && responseJsonGetAll.status === "ok"){
            setState({ matchmakingId: responseJson.data.matchmakingId, request: responseJson.data.request, playersList: responseJsonGetAll.data, match: responseJson.data.match })
        } else {
            alert("Il y a une erreur au lobby")
        }

        
    }

    //La fonction associé au bonton défier
    const defier = async(matchmakingId) => {
        //Requête pour défier
        let url = "https://league-of-stones.herokuapp.com/"
        url += "matchmaking/request"
        url += "?matchmakingId=" + matchmakingId
        url += "&token=" + props.token
        
        let responseJson;
        let response = await fetch(url, { method: 'GET' });
        if(response.status === 200){
            responseJson = await response.json()
        }

        if(responseJson.status === "ok"){
            alert("Le défi à été envoyé !")
        } else {
            alert("Erreur, le défi n'a pas été envoyé..")
        }
    }

    const accepterDefi = async(matchmakingId) =>{
        //Requête pour défier
        let url = "https://league-of-stones.herokuapp.com/"
        url += "matchmaking/acceptRequest"
        url += "?matchmakingId=" + matchmakingId
        url += "&token=" + props.token
        
        let responseJson;
        let response = await fetch(url, { method: 'GET' });
        if(response.status === 200){
            responseJson = await response.json()
        }

        if(responseJson.status === "ok"){
            alert("Bon match !")
        } else {
            alert("Erreur, impossible d'accepter le défi..")
        }
    }

    return(
            <div className="row justify-content-md-center">
                <div className="divLobby col-md-6">
                    {
                        state.match &&
                        <Redirect to='/mondeck'/>
                    }

                    <div className="row justify-content-center">
                        <h3 className="title mt-3">Recherche de partie</h3>
                    </div>
                    <div className="row contentLobby justify-content-center">
                        <div className="col-md-6">

                            Utilisateurs disponibles pour jouer :
                            <ul>
                                {
                                    state.playersList && state.playersList.length > 0 &&
                                    state.playersList.map((item, index) => (
                                        <>
                                            <div className="row">
                                                <div className="col justify-content-start">
                                                    <li className="row noma adversaire" key={index}>
                                                        <div className="col">
                                                            {item.name}
                                                        </div>
                                                        <div className="col butdefi justify-content-end">
                                                            <img className="duel" src={ require('./image/duel.png')} onClick={(e) => defier(item.matchmakingId)}/>
                                                        </div>
                                                    </li>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }
                            </ul>
                            Défis en attente :
                            <ul>
                                {
                                    state.request && state.request.length > 0 &&
                                    state.request.map((item, index) => (
                                        <>
                                            <div className="row">
                                                <div className="col justify-content-start">
                                                    <li className="row noma adversaire" key={index}>
                                                        <div className="col">
                                                           {item.name} vous a défié
                                                        </div>
                                                        <div className="col butdefi justify-content-end">
                                                            <img className="duel" src={ require('./image/duel.png')} onClick={(e) => accepterDefi(item.matchmakingId)}/>
                                                        </div>
                                                    </li>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                Nous cherchons un adversaire à votre hauteur <br/>
                                Veuillez patienter
                            </div>
                            <div className="row justify-content-center">
                                <img className="milou" src={ require('./image/milou.png') } />
                            </div>
                            <div className="row justify-content-center">
                                <button type="button" className="btn btn-warning mt-4">Annuler</button>
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
        //     joueurId: state.joueurId,
    }),
)(Lobby);