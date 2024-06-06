let reverseMode = false; // Variable to track the game mode

async function fetchCSV() {
    const response = await fetch('tbl_city_german.csv');
    const data = await response.text();
    const parsedData = Papa.parse(data, { header: true, delimiter: ';' }).data;
    return parsedData;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function playGame() {
    const data = await fetchCSV();
    const correctIndex = getRandomInt(data.length);
    const correctRow = data[correctIndex];
    const correctAbbreviation = correctRow.abbreviation;
    const correctName = correctRow.name;

    let options = [correctRow];
    while (options.length < 4) {
        const option = data[getRandomInt(data.length)];
        if (reverseMode) {
            if (option.name !== correctName && !options.includes(option)) {
                options.push(option);
            }
        } else {
            if (option.abbreviation !== correctAbbreviation && !options.includes(option)) {
                options.push(option);
            }
        }
    }

    shuffleArray(options);

    const questionElement = document.getElementById('question');
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';

    if (reverseMode) {
        questionElement.innerText = `Which city corresponds to the abbreviation: ${correctAbbreviation}?`;
        options.forEach((option, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${option.name}`;
            listItem.onclick = () => checkAnswer(listItem, option.name, correctName, optionsList);
            optionsList.appendChild(listItem);
        });
    } else {
        questionElement.innerText = `Which abbreviation corresponds to the city: ${correctName}?`;
        options.forEach((option, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${option.abbreviation}`;
            listItem.onclick = () => checkAnswer(listItem, option.abbreviation, correctAbbreviation, optionsList);
            optionsList.appendChild(listItem);
        });
    }
}

function checkAnswer(selectedItem, selected, correct, optionsList) {
    Array.from(optionsList.children).forEach(item => {
        item.onclick = null; // Lock all options

        if (item.innerText === correct) {
            item.style.backgroundColor = 'green'; // Correct answer in green
        } else if (item === selectedItem) {
            item.style.backgroundColor = 'red'; // Incorrect selected answer in red
        } else {
            item.style.backgroundColor = 'gray'; // Other options in gray
        }
    });
    setTimeout(playGame, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    playGame();
    document.getElementById('toggle-mode').onclick = () => {
        reverseMode = !reverseMode;
        playGame();
    };
});