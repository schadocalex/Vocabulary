const React = require("react");
const _ = require("lodash");

const App = React.createClass({
    getInitialState: function() {
        return {
            results: {
                fr: _.times(this.props.words.length, _.constant(0)),
                en: _.times(this.props.words.length, _.constant(0))
            },
            lastCorrect: true,
            nbCorrectAnswers: 0,
            nbAnswers: 0,
            lastAnswer: ""
        };
    },
    handlerAnswer: function(langFrom, langTo, index, correct) {
        if(correct) {
            this.state.results[langTo][index]++;
        }
        this.setState({
            results: this.state.results,
            lastCorrect: correct,
            nbCorrectAnswers: this.state.nbCorrectAnswers + (correct ? 1 : 0),
            lastAnswer: this.props.words[index][langTo],
            lastAnswerFrom: this.props.words[index][langFrom]
        });
    },
    render: function() {
        let langFrom = _.random(0, 1) === 0 ? "fr" : "en";
        let langTo = (langFrom === "fr") ? "en" : "fr";
        let subWords = _.filter(this.props.words, (w, i) => this.state.results[langTo][i] === 0);

        if(subWords.length === 0) {
            let temp = langFrom;
            langFrom = langTo;
            langTo = temp;
            subWords = _.filter(this.props.words, (w, i) => this.state.results[langTo][i] === 0);

            if(subWords.length === 0) {
                const choice = ["B-N1yJyrQRY", "eoOp339ODXs", "fynH6rJ9EvQ", "nZ5PAW_vDsQ", "fVWd5WFpq3A", "ggB33d0BLcY", "Hvbo3zpSBhk"][_.random(6)];
                document.body.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+choice+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
                //setTimeout(() => document.location.href = "http://www.youtube.com/watch?v=B-N1yJyrQRY", 3000);
                return;
            }
        }
        const wordsToFind = subWords[_.random(0, subWords.length - 1)];

        document.body.style.backgroundColor = "hsl(" + Math.random() * 360 + ", 100%, 90%)";


        return (
            <div>
                <h1>Vocabulary</h1><br/><br/>
                <h2>{_.upperCase(langFrom) + " -> " + _.upperCase(langTo)}</h2>
                <FindWord word={ wordsToFind[langFrom]} wordToFind={wordsToFind[langTo]}
                      onAnswer={(correct) => this.handlerAnswer(langFrom, langTo, wordsToFind.index, correct)} />
                <br/>
                <br/>
                <h2 id="answer" className={(this.state.lastCorrect ? "correct" : "notCorrect")} >
                    {_.upperFirst(_.trim(this.state.lastAnswerFrom))} - {_.upperFirst(_.trim(this.state.lastAnswer))}
                    </h2>
                <h2 id="score">{this.state.nbCorrectAnswers} / {this.props.words.length * 2}</h2>
                <h2 id="scorePercentage">{ Math.floor(this.state.nbCorrectAnswers / (this.props.words.length * 2) * 10000) / 100 || "0" } %</h2>
            </div>
        );
    }
});

const FindWord = React.createClass({
    componentDidMount: function() {
        this.refs.input.focus();
    },
    _handleKeyPress: function(e) {
        if (e.key === 'Enter') {
            let word1 = _.lowerCase(_.deburr(this.refs.input.value));
            let words2 = _.map(_.deburr(this.props.wordToFind).split(","), _.lowerCase);
            this.props.onAnswer(words2.some(w => word1 == w));
            this.refs.input.value = "";
        }
        return false;
    },
    render: function() {
        return (
            <div className="row" >
                <div id="leftWord" className="six columns input" >{_.upperFirst(_.trim(this.props.word))}</div>
                <input type="text" id="rightWord" ref="input" className="six columns input"
                       onKeyPress={this._handleKeyPress} />
            </div>
        );
    }
});

module.exports = App;