//CORE DEPENDENCIES
import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

//UI COMPONENTS

// assets & style
import "./FaqPage.css";
import faqData from './faqs.json'

class FileCertificatorPage extends Component {

  constructor() {
    super()
    this.state = {
      test: null
    };
  }

  componentDidMount = async () => {
    try {

      this.setState({ test: "ok" });

    } catch (error) {
      // Catch any errors for any of the above operations.
      return (<h1>Error</h1>);
      console.error(error);
    }

  };


  // UI RENDER FX

  outputFaq() {

    let faqs = faqData.map( (faq) => {
        return (
          <div className={"questionAnswerCont"}>
            <p className={"question"}><span>Q)</span> <strong>{faq.q}</strong></p>
            <p className={"answer"}><span>A)</span> {faq.a}</p>
          </div>
        )
    })

    return (
      <div>
        {faqs}
      </div>
    )
  }

  render() {


    return (
      <>
        <div id={"globalCont"}>
          <h1 id={"mainFaqTitle"}>Frequently Asked Questions</h1>

          {this.outputFaq()}

        </div>
      </>
    )
  }
}

export default FileCertificatorPage
