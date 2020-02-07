import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import CreerCompte from './CreerCompte';
import Connexion from './Connexion';
import Lobby from './Lobby';
import Plateau from './Plateau';
import PageAccueil from './PageAccueil';
import PageCreationDeck from './Deck';
import configureStore from "./modules/store";
import { Provider as ReduxProvider } from "react-redux";
import SupprimerCompte from './SupprimerCompte';

const reduxStore = configureStore(window.REDUX_INITIAL_DATA);

function App() {

  return (
    <>
    <ReduxProvider store={reduxStore}>
      <div className="App">
        <header className="App-header">

          {/* contenu */}
          <Router>
            <Redirect to='/accueil'/>
            {/* Navbar */}
            <Navbar></Navbar>
            <Switch>
              <Route exact path="/connexion">
                <Connexion></Connexion>
              </Route>
              <Route path="/creationdecompte">
                <CreerCompte></CreerCompte>
              </Route>
              <Route path="/desinscription">
                <SupprimerCompte></SupprimerCompte>
              </Route>
              <Route path="/mondeck">
                <PageCreationDeck></PageCreationDeck>
              </Route>
              <Route path="/accueil">
                <PageAccueil></PageAccueil>
              </Route>
              <Route path="/lobby">
                <Lobby></Lobby>
              </Route>
              <Route path="/plateau">
                <Plateau></Plateau>
              </Route>
            </Switch>
          </Router>

        </header>
      </div>
    </ReduxProvider>
    <script src="https://unpkg.com/react-popper/dist/index.umd.js"></script>
    </>
  );
}

export default App;
