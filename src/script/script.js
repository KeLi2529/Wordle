function APICall()
{
    //fetch request (because it's just URL)
    //Asynchronous function
    fetch("https://random-word-api.vercel.app/api?words=1&length=5")
    .then(response => {
        console.log(response)
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        //console.log('Data:', data);
        wordCopy = data.toString();
        //console.log(wordCopy); // Cheating! 
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
}

var numGuesses = 0;
var wordCopy = "";

window.onload = ()=>{
    GenerateWordle();
    APICall();
}

function GenerateWordle()
{
    var rowArray = [];
    var bigArray = [];
    var container = document.getElementById("container");

    for(var i = 0; i < 6; i++)
    {
        var div = document.createElement("div");

        for(var j = 0; j < 5; j++)
        {
            var input = document.createElement("input");
            rowArray.push(input);
            input.type = "text";
            input.style.width = "1.5ch";
            input.maxLength = 1;
            // 1) auto focus to next input when a letter is added
            // 2) only allow letters
            // 3) transform to upper case
            input.setAttribute("oninput", "OnInput(this)");
            div.appendChild(input);
            if(i!= numGuesses)
            {
                input.disabled = true;
            }
        }

        bigArray.push(rowArray);
        container.appendChild(div);

        var aBreak = document.createElement("br");
        div.appendChild(aBreak);
    }

    var childs = container.children;
    //console.log(`Divs ${childs.length}`);
    for (ii = 0; ii<childs.length; ii++)
    {
        childs[ii].onkeyup = GoNext;
    }

    var myButton = document.createElement("button");
    myButton.setAttribute("onclick", "CheckWord()");
    myButton.innerHTML = "Check Word";

    var aBreak = document.createElement("br");

    var restartButton = document.createElement("button");
    restartButton.setAttribute("onclick", "location.reload()");
    restartButton.innerHTML = "Restart";

    container.appendChild(myButton);
    container.appendChild(aBreak);
    container.appendChild(restartButton);
}

function OnInput(letter)
{
    if (IsLetter(letter) == false)
        {
            letter.value = null;
        }
    letter.value = letter.value.toUpperCase();
    // console.log(IsLetter(letter));
}

function GoNext(event)
{
    var target = event.srcElement; //checks the srcEement or the target if srcElement is null
    var myLength = target.value.length; //find the length of the text in the input
    if (myLength >= 1) { //if we entered a single character
        var next = target; //sets self to current target (Temporary)
        while (next = next.nextElementSibling) { //goes to the next sibling element  that is an "input tag"
            if (next == null) //if it finds a null value(end of children)
                break; //exit loop
            if (next.tagName.toLowerCase() === "input") { //if the value is an input
                next.focus(); //focus on it.
                break;
            }
        }
    }
    else if (myLength === 0) {
        var previous = target;
        while (previous = previous.previousElementSibling) {
            if (previous == null)
                break;
            if (previous.tagName.toLowerCase() === "input") {
                previous.focus();
                break;
            }
        }
    }
}

function ValidateWord(myWord)
{
    var parent = document.getElementById("container");
    var innerDiv = parent.children;
    //console.log(innerDiv);
    var divChildren = innerDiv[numGuesses-1].children;
    //console.log(divChildren);
    for(var i = 0; i < divChildren.length - 1; i++)
    {
        divChildren[i].disabled = true;
    }

    divChildren = innerDiv[numGuesses].children;

    for(var i = 0; i < divChildren.length - 1; i++)
    {
        divChildren[i].disabled = false;
        if(i == 0)
        {
            divChildren[i].focus();
        }
    }

    if(myWord.toLowerCase() == wordCopy)
    {
        alert("You win! Click the restart button to play another round!");
        innerDiv[6].removeAttribute("onclick");

        for(var i = 0; i < divChildren.length - 1; i++)
        {
            divChildren[i].disabled = true;
        }
    }
    else if(numGuesses == 6)
    {
        alert("You lose! Click the restart button to try again!");
        location.reload();
    }
}

function CheckCharPosition(myWord)
{
    var parent = document.getElementById("container");
    var innerDiv = parent.children;
    var divChildren = innerDiv[numGuesses-1].children;
    myWord = myWord.toLowerCase();

    // Create an object to hold all the letters and how many times they appeared in the answer word
    var letterCount = {};

    for(var i = 0; i < wordCopy.length; i++)
    {
        // loop through all the letters in the answer word
        // if letterCount contains this letter already, add another one to it
        if(letterCount[wordCopy[i]])
        {
            letterCount[wordCopy[i]]++;
        }
        // else make it one
        else
        {
            letterCount[wordCopy[i]] = 1;
        }
    }

    // Get all the correct letters in the correct position first
    for(var i = 0; i < myWord.length; i++)
    {
        // Set every thing to light grey as default
        divChildren[i].style.backgroundColor = "lightgrey";

        if(myWord[i] === wordCopy[i])
        {
            divChildren[i].style.backgroundColor = "lime";
            letterCount[myWord[i]]--;
        }
    }
    
    // Then loop a second time to get those letters which are in the word but in the wrong position
    for(var i = 0; i < myWord.length; i++)
    {
        if(divChildren[i].style.backgroundColor != "lime" && letterCount[myWord[i]] > 0)
        {
            divChildren[i].style.backgroundColor = "yellow";
            letterCount[myWord[i]]--;
        }
    }

    console.log(letterCount);
    // Did a little bit of research here! References: https://youtu.be/ckjRsPaWHX8?si=AyVebmlMxKzUQKSw
    // I borrowed the idea, but didn't completely copy paste
}

function IsLetter(letter)
{
    return (/[a-zA-Z]/).test(letter.value);
}

function CheckWord()
{
    var myWord = "";

    var parent = document.getElementById("container");
    var innerDiv = parent.children;
    var divChildren = innerDiv[numGuesses].children;

    for (var i = 0; i < divChildren.length - 1; i++)
    {
        myWord += divChildren[i].value;
    }

    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + myWord;
    
    var message = document.getElementById("message");

    if(myWord.length == 5)
    {
        fetch(url)
        .then(response => {
            console.log(response)
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            message.innerHTML = `<p> Your word: ${myWord.toLowerCase()} is valid </p>`;
            numGuesses++;
            CheckCharPosition(myWord);
            ValidateWord(myWord);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            message.innerHTML = `<p> Your word: ${myWord.toLowerCase()} is invalid </p>`;
        })
    }
    else
    {
        message.innerHTML = `<p> Your word: ${myWord.toLowerCase()} is too short </p>`;
    }
}
