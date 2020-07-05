// @ts-nocheck
import React from "react";
import axios from "axios";
import "./App.css";
import { sample, shuffle, find } from "lodash";

const fallacies = [
  { fallacyId: 1, name: "ad hominem" },
  { fallacyId: 2, name: "appeal to authority" },
  { fallacyId: 3, name: "appeal to ignorance" },
  { fallacyId: 4, name: "loaded question" },
  { fallacyId: 5, name: "personal incredulity" },
];

interface Fallacy {
  fallacyId: number;
  id: number;
}

export default class App extends React.Component {
  state = {
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
      const randomFallocy = sample(fallacies);
      if (randomFallocy.fallacyId === response.data.fallacyId) continue;
      incorrectAnswers.push(randomFallocy);
    }

    const correctAnswer = find(fallacies, {
      fallacyId: parseInt(response.data.fallacyId, 10),
    });

    if (!correctAnswer) {
      console.log("Can't find correct answer.");
    }

    const answers = shuffle([...incorrectAnswers, correctAnswer]);
    console.log(answers);
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
    if (option === "a") {
      this.showCorrectView();
    } else {
      this.showIncorrectView();
    }

    setTimeout(() => {
      this.fetchImage();
    }, 1000);
  };

  toTitleCase = (str) => {
    if (!str) return str;
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
              <header className="App-header">Logical Fallacy Game</header>
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
                onClick={() =>
                  this.handleCheckAnswer(this.state.answers[0]?.id)
                }
                className="btn btn-primary btn-lg btn-block"
              >
                A: {this.toTitleCase(this.state.answers[0]?.name)}
              </button>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() =>
                  this.handleCheckAnswer(this.state.answers[1]?.id)
                }
                className="btn btn-primary btn-lg btn-block"
              >
                B: {this.toTitleCase(this.state.answers[1]?.name)}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() =>
                  this.handleCheckAnswer(this.state.answers[2]?.id)
                }
                className="btn btn-primary btn-lg btn-block"
              >
                C: {this.toTitleCase(this.state.answers[2]?.name)}
              </button>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <button
                onClick={() =>
                  this.handleCheckAnswer(this.state.answers[3]?.id)
                }
                className="btn btn-primary btn-lg btn-block"
              >
                D: {this.toTitleCase(this.state.answers[3]?.name)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
