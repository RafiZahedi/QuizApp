let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let quizRunning = false;

// Function to shuffle array elements (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fetch JSON file
fetch('quiz_questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleArray(questions);
        // Display the first question when questions are loaded
        // displayQuestion();
    })
    .catch(error => console.error('Error fetching questions:', error));

// Function to start the quiz
function startQuiz() {
    // Check if quiz is already running
    if (!quizRunning) {
        // Start the timer
        timer = setInterval(updateTimer, 1000);
        // Enable the end button
        document.querySelector('.btn-end').disabled = false;
        // Disable the start button
        document.querySelector('.btn-start').disabled = true;
        // Set quizRunning flag to true
        quizRunning = true;
    }
    // Start the quiz by displaying the first question
    displayQuestion();

}

// Function to end the quiz
function endQuiz() {
    // Check if quiz is running
    if (quizRunning) {
        // Stop the timer
        clearInterval(timer);
        // Disable the end button
        document.getElementById('time').textContent = '01:00';
        document.querySelector('.btn-end').disabled = true;
        document.querySelector('.btn-start').disabled = false;
        // Update high score if needed
        const currentHighscore = parseInt(document.getElementById('highscore').textContent);
        if (score > currentHighscore) {
            document.getElementById('highscore').textContent = score;
        }
        alert("End of Quiz! Your score: " + score);
        // Reset the score and question index
        score = 0;
        currentQuestionIndex = 0;
        // Set quizRunning flag to false
        quizRunning = false;
        resetQuiz();
    }
}
function resetQuiz() {
    // Reset the question text
    document.getElementById('question-text').textContent = "Click 'Start' Button to Start";

    // Reset the score
    document.getElementById('score').textContent = '0';

    // Reset the time
    document.getElementById('time').textContent = '1:00';

    // Reset options container
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = `
        <div id="op1" class="option" onclick="checkAnswer(this)">Option 1</div>
        <div id="op2" class="option" onclick="checkAnswer(this)">Option 2</div>
        <div id="op3" class="option" onclick="checkAnswer(this)">Option 3</div>
        <div id="op4" class="option" onclick="checkAnswer(this)">Option 4</div>
    `;

    // Reset button states
    document.querySelector('.btn-start').disabled = false;
    document.querySelector('.btn-end').disabled = true;

    // Reset quizRunning flag
    quizRunning = false;

    // Clear any remaining interval
    clearInterval(timer);
}
// Function to update the timer
function updateTimer() {
    const timeElement = document.getElementById('time');
    const timeArray = timeElement.textContent.split(':');
    let minutes = parseInt(timeArray[0]);
    let seconds = parseInt(timeArray[1]);
    if (seconds > 0) {
        seconds--;
    } else {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            // End the quiz when time is up
            clearInterval(timer);
            endQuiz();
        }
    }
    // Update the time display
    timeElement.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// Function to display a new question
function displayQuestion() {
    // Check if quiz is running
    if (!quizRunning) {
        console.error('Quiz is not running.');
        return;
    }

    // Check if questions array is empty or undefined
    if (!questions || questions.length === 0) {
        console.error('No questions available.');
        return;
    }

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');

    // Check if currentQuestionIndex is valid
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
        console.error('Invalid question index.');
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Check if currentQuestion is defined
    if (!currentQuestion) {
        console.error('Current question is undefined.');
        return;
    }

    // Display the question text
    questionText.textContent = currentQuestion.question;

    // Shuffle the options for the current question
    shuffleArray(currentQuestion.options);

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Display options
    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option;
        optionDiv.classList.add('option');
        optionDiv.onclick = () => checkAnswer(option, optionDiv);
        optionsContainer.appendChild(optionDiv);
    });
}

// Function to check the selected answer
function checkAnswer(selectedAnswer, option) {
    // Check if quiz is running
    if (!quizRunning) {
        console.error('Quiz is not running.');
        return;
    }

    // Prevent multiple clicks on the same option
    if (!option.dataset.clicked) {
        const currentQuestion = questions[currentQuestionIndex];

        // Mark the option as clicked and disable it
        option.dataset.clicked = true;
        option.disabled = true;

        if (selectedAnswer === currentQuestion.correctAnswer) {
            option.classList.add('correct');
            score++;
            document.getElementById('score').textContent = score;
        } else {
            option.classList.add('incorrect');
            // Find and highlight the correct answer
            const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
            const correctOptionDiv = document.querySelectorAll('.option')[correctOptionIndex];
            correctOptionDiv.classList.add('correct');
        }

        // Move to the next question after a delay
        setTimeout(() => {
            // Reset options for the next question
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
                opt.disabled = false;
                delete opt.dataset.clicked;
            });

            // Move to the next question or end the quiz if all questions have been answered
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion();
            } else {
                // End of quiz, you can display a message or perform other actions here
                alert("End of Quiz! Your score: " + score);
                endQuiz();
            }
        }, 200); // Delay before moving to the next question (milliseconds)
    }
}
function saveData() {
    localStorage.setItem("data",)
}