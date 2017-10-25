const React = require("react");
const ReactDOM = require("react-dom");
const $ = require("jquery");

const App = require("./src/App");
const params = document.location.search.slice(1).split(":");
let from = 0, to = undefined;
if(params.length === 3) {
    from = parseInt(params[1]) - 1;
    to = parseInt(params[2]);
} else if(params.length === 2) {
    to = parseInt(params[1]);
}

let aj = {
    status: 404
};
if(params[0] !== "") {
    aj = $.ajax({
        url: params[0] + ".csv",
        async: false
    });
}

if(aj.status === 404) {
    aj = $.ajax({
        url: "words.csv",
        async: false
    });
}

let words = aj.responseText
    .split("\n")
    .slice(from, to)
    .filter(s => s.indexOf(";") >= 0)
    .map((el, i) => {
        let tmp = el.split(";");
        return {
            fr: tmp[0],
            en: tmp[1],
            index: i
        };
    });

ReactDOM.render(
    <App words={words} />,
    document.getElementById("container")
);