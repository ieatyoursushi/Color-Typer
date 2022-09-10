let container = document.querySelector("#words");
let winText = document.querySelector("#youWin");
let wordSlider = document.getElementById("wordRange");
let wordsGenerated = 10;
let wordsLength = 15;
let totalChars = 0;

class TestResult {
    constructor(wpm, time, wordAmount, date) {
        this.wordsPerMinute = wpm;
        this.Time = time;
        this.wordsAmount = wordAmount
        this.Date = date;
    }
    createEl() {
        let body = document.querySelector("body");
        let savedScore = document.createElement("p");
        savedScore.innerHTML = "WPM: " + this.wordsPerMinute + ", time: " + this.Time + " seconds, " + "words: " + this.wordsAmount + ",  " + this.Date;
        body.append(savedScore);
        //replace old data with new  data
        let localSavedScores = JSON.parse(localStorage.getItem("LocalSavedScores"));
        localSavedScores.push(savedScore.innerHTML);

        localStorage.setItem("LocalSavedScores", JSON.stringify(localSavedScores));

        console.log()
    }

}
function ResultsOnLoad() {
    if (localStorage.getItem("LocalSavedScores") == null) {
        localStorage.setItem("LocalSavedScores", '[]')
    }
    let LocallySavedScores = JSON.parse(localStorage.getItem("LocalSavedScores"));
    for (let i = 0; i < LocallySavedScores.length; i++) {
        let body = document.querySelector("body");
        let scoreText = document.createElement("p");
        scoreText.innerHTML = LocallySavedScores[i];
        body.append(scoreText);
    }
}
ResultsOnLoad();
updateCount = setInterval(function wordAmount() {
    wordsGenerated = wordSlider.value;
    document.querySelector("#wordCount").innerHTML = "Words: " + wordSlider.value;

}, 16)
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
const colors = ["blue", "orange", "black", "red", "green", "purple", "lightblue", "yellow", "brown"];

let words = []
let wordsElement = []
let charArray = [];
function generateObj() {
    for (let i = 0; i < wordsGenerated; i++) {
        function TextObject() {
            this.word = colors[randomRange(0, colors.length)];
            this.color = colors[randomRange(0, colors.length)];
        }
        let textObject = new TextObject();
        words.push(textObject);
        charArray.push(textObject.color); 
    }
    //calc cpm
    totalChars += charArray.join("");
    console.log(totalChars.length);
    //fisher yates shuffle algorithm
    let len = colors.length, j, jStored;
    while (--len > 0) {
        j = Math.floor(Math.random() * (len + 1));
        jstored = colors[j];
        colors[j] = colors[len];
        colors[len] = jStored;
    }
}
let i = 0;
function showWords() {
    generateObj();
    console.log(charArray);
    words.forEach(function (word) {
        let newSpan = document.createElement("span");
        let newBr = document.createElement("br");
        newSpan.innerHTML = word.word;
        newSpan.style.color = word.color;
        i++;
        if (i === wordsLength) {
            document.querySelector("#textHolder").append(newBr);
            i = 0;
        }
        document.querySelector("#textHolder").append(newSpan);
 
        wordsElement.push(newSpan);
        console.log(words);
    })
}
let wordCounter = 0;
let startTime;
let hasStarted = false;
let hasTyped = true;
function checkColor(that) {
    let input = that.value;
    that.value = '';
    if (input.toLowerCase() == 'start' && !hasStarted) {
        hasStarted = true;
        startTime = new Date();  
        showWords();
    }
    if (hasStarted) {
        clearInterval(updateCount);
        document.querySelector("#youWin").style.display = "none";
        if (input.toLowerCase() == words[wordCounter].color) {
            wordsElement[wordCounter].style.color = 'lightgray';
            wordCounter++;

            if (wordCounter >= words.length) {
                let time = (new Date()) - startTime;
                let second = time / 1000;
                let minute = time / 60000;
                console.log(minute);
                let WPM = Math.floor((totalChars.length / 5) / minute * 100) / 100;
                console.log(WPM);
                let testDate = new Date();
                let day = testDate.getDate();
                let month = testDate.getMonth() + 1;
                let year = testDate.getFullYear();
                let fullDate = month + "/" + day + "/" + year;

                winText.style.display = 'block';
                winText.innerHTML = WPM + " WPM" + ", completed in: " + Math.floor(second * 100) / 100 + " seconds";
                let testResult = new TestResult(WPM, second, words.length, fullDate)
                testResult.createEl();                
            }
        }
    }
}
function clearStorage() {
    localStorage.clear();
}
function restart() {
    window.location.reload();
}
 
 

