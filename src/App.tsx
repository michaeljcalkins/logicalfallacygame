// @ts-nocheck
import React from "react";
import axios from "axios";
import "./App.css";
import { sample, shuffle, find } from "lodash";

const fallacies = {
  AD_HOMINEM: "Ad hominem",
  APPEAL_TO_AUTHORITY: "Appeal to authority",
  APPEAL_TO_IGNORANCE: "Appeal to ignorance",
  LOADED_QUESTION: "Loaded question",
  PERSONAL_INCREDULITY: "Personal incredulity",
  STRAWMAN: "Strawman",
  FALSE_CAUSE: "False cause",
  APPEAL_TO_EMOTION: "Appeal to emotion",
};

interface Fallacy {
  fallacy: number;
  id: number;
}

export default class App extends React.Component {
  state = {
    score: 0,
    view: "question",
    isLoading: true,
    fallacy: null,
    answers: [],
  };

  componentDidMount = () => {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    this.fetchImage();
  };

  fetchImage = async () => {
    const response = await axios.get(
      "https://1ilu2rd669.execute-api.us-east-1.amazonaws.com/default/getImage"
    );

    this.setState({
      fallacy: response.data,
      view: "question",
      answers: [],
    });

    let incorrectAnswers = [];

    while (incorrectAnswers.length < 3) {
      const randomFallacy = sample(Object.keys(fallacies));
      if (
        randomFallacy === response.data.fallacy ||
        incorrectAnswers.includes(randomFallacy)
      )
        continue;
      incorrectAnswers.push(randomFallacy);
    }

    if (!fallacies[response.data.fallacy]) {
      console.log("Can't find correct answer.");
    }

    const answers = shuffle([...incorrectAnswers, response.data.fallacy]);
    console.log(answers, response.data.fallacy);
    this.setState({ isLoading: false, answers });
  };

  showCorrectView = () => {
    this.setState({ view: "correct" });
  };

  showIncorrectView = () => {
    this.setState({ view: "incorrect" });
  };

  showQuestionView = () => {
    this.setState({ view: "question" });
  };

  handleCheckAnswer = (option: string) => {
    if (option === this.state.fallacy.fallacy) {
      this.setState({
        score: this.state.score + 1,
      });
      this.showCorrectView();
    } else {
      this.showIncorrectView();
    }

    setTimeout(() => {
      this.fetchImage();
    }, 1000);
  };

  render() {
    if (this.state.isLoading) return <>Loading...</>;
    if (this.state.view === "correct") return <>Correct!</>;
    if (this.state.view === "incorrect") return <>Incorrect!</>;
    if (this.state.answers.length === 0) return <>No answers found.</>;
    if (!this.state.fallacy) return <>No question loaded.</>;

    return (
      <div className="App container-fluid">
        <div className="header-container">
          <div className="row">
            <div className="col">
              <header className="App-header">
                Logical Fallacy Game {this.state.score}
              </header>
            </div>
          </div>
        </div>
        <div className="image-container">
          <img
            src={`https://logicalfallacygame.s3.us-east-1.amazonaws.com/${this.state.fallacy.file}`}
            alt="logical fallacy"
          />
        </div>
        <div className="button-container">
          <div className="row mb-3">
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() => this.handleCheckAnswer(this.state.answers[0])}
                className="btn btn-primary btn-lg btn-block"
              >
                A: {fallacies[this.state.answers[0]]}
              </button>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() => this.handleCheckAnswer(this.state.answers[1])}
                className="btn btn-primary btn-lg btn-block"
              >
                B: {fallacies[this.state.answers[1]]}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() => this.handleCheckAnswer(this.state.answers[2])}
                className="btn btn-primary btn-lg btn-block"
              >
                C: {fallacies[this.state.answers[2]]}
              </button>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() => this.handleCheckAnswer(this.state.answers[3])}
                className="btn btn-primary btn-lg btn-block"
              >
                D: {fallacies[this.state.answers[3]]}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
