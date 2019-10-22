import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { FlexboxGrid, Button } from 'rsuite';
import FileCertificatorPage from './components/FileCertificatorPage/FileCertificatorPage'

import AuthenticityContract from "./contracts/Authenticity.json";

import getWeb3 from "./utils/getWeb3";
import CryptoJS from "crypto-js";

// import default style
import 'rsuite/dist/styles/rsuite-default.css'

import "./App.css";

class App extends Component {


  render() {

    return (
      <div className="App">
      { /*<nav>navbar here</nav> */}
      <Router>
      <Route exact path="/" component={FileCertificatorPage} />
      <Route path="/asd" render={() => (<h1>asd</h1>)} />

      </Router>
      </div>
    );
  }
}

export default App;


//extra content to put:
// Please note that you files will NOT be uploaded and your data remain safe locally.
//
// All computation are done locally within your HTML browser.
// File Hashes can be used to verify the data integrity/identify e.g. game patches, virus identification
// It is possible for hash collision to happen (two different files have the same hashes), but very unlikely.
// If the downloaded files have different hashes than given, please do not open!
// Maximum supported local file size = 3G (1024 * 3M).
