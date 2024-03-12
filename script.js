const questions = [
    {
        question: "What is the Capital of Afghanistan?",
        options: ["Kabul", "Ghazni", "Herat", "Balkh"],
        correctAnswer: "Kabul"
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale"
    },
    // Add more questions here
];

let currentQuestionIndex = 0;
let score = 0;

function shuffleOptions(options) {
    // Fisher-Yates (aka Knuth) Shuffle Algorithm
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
}

function displayQuestion() {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');
    const currentQuestion = questions[currentQuestionIndex];

    // Display the question text
    questionText.textContent = currentQuestion.question;

    // Shuffle the options for the current question
    shuffleOptions(currentQuestion.options);

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

function checkAnswer(selectedAnswer, option) {
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

        // Move to the next question after a delay (you can adjust the delay as needed)
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
            }
        }, 200); // Delay before moving to the next question (milliseconds)
    }
}

// Start the quiz by displaying the first question
displayQuestion();
