const questions = [
    {
        question: "What is the value of 2^5 × 2^3?",
        options: ["2^15", "2^8", "2^10", "2^5"],
        answer: 1,
        explanation: "When multiplying powers with the same base, add the exponents: 5 + 3 = 8, so 2^8 = 256."
    },
    {
        question: "Which planet has the strongest gravitational pull?",
        options: ["Earth", "Jupiter", "Neptune", "Saturn"],
        answer: 1,
        explanation: "Jupiter has the strongest gravity due to its massive size."
    },
    {
        question: "Who wrote the Indian Constitution?",
        options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
        answer: 1,
        explanation: "B.R. Ambedkar was the chief architect of the Indian Constitution."
    },
    {
        question: "What is the chemical name of baking soda?",
        options: ["Sodium chloride", "Sodium bicarbonate", "Calcium carbonate", "Potassium carbonate"],
        answer: 1,
        explanation: "Baking soda is Sodium bicarbonate (NaHCO₃)."
    },
    {
        question: "What is the square root of 144?",
        options: ["14", "11", "12", "13"],
        answer: 2,
        explanation: "√144 = 12."
    },
    {
        question: "Which is the largest desert in the world?",
        options: ["Sahara", "Gobi", "Kalahari", "Antarctic"],
        answer: 0,
        explanation: "The Antarctic Desert is the largest, even bigger than the Sahara."
    },
    {
        question: "Which law explains why we need seat belts?",
        options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Law of Gravitation"],
        answer: 0,
        explanation: "Newton’s First Law (Inertia) explains why you keep moving forward when a car stops suddenly."
    },
    {
        question: "Who was the first Mughal Emperor of India?",
        options: ["Akbar", "Babur", "Humayun", "Aurangzeb"],
        answer: 1,
        explanation: "Babur founded the Mughal Empire in India."
    },
    {
        question: "What is Hubble primarily used for?",
        options: ["Measuring earthquakes", "Studying stars and galaxies", "Mapping the ocean floor", "Tracking hurricanes"],
        answer: 1,
        explanation: "The Hubble Space Telescope observes distant stars, galaxies, and cosmic phenomena."
    },
    {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1939", "1946"],
        answer: 1,
        explanation: "World War II ended in 1945."
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

const quizEl = document.getElementById("quiz");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const timerEl = document.getElementById("timer");

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    timerEl.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showExplanation();
        }
    }, 1000);

    const q = questions[currentQuestion];
    quizEl.innerHTML = `
        <div class="question">${currentQuestion + 1}. ${q.question}</div>
        <div class="options">
            ${q.options.map((opt, i) => `<div class="option" data-index="${i}">${opt}</div>`).join("")}
        </div>
        <div class="explanation" id="explanation"></div>
    `;

    document.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", selectOption);
    });

    nextBtn.disabled = true;
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

function selectOption(e) {
    clearInterval(timer);
    const selected = e.target;
    const selectedIndex = parseInt(selected.dataset.index);
    const correctIndex = questions[currentQuestion].answer;

    if (selectedIndex === correctIndex) {
        selected.classList.add("correct");
        score++;
    } else {
        selected.classList.add("wrong");
        document.querySelector(`.option[data-index="${correctIndex}"]`).classList.add("correct");
    }

    showExplanation();
    document.querySelectorAll(".option").forEach(opt => opt.style.pointerEvents = "none");
    nextBtn.disabled = false;
}

function showExplanation() {
    document.getElementById("explanation").textContent = questions[currentQuestion].explanation;
}

nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizEl.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score: ${score} / ${questions.length}</p>
        <button onclick="location.reload()">Restart Quiz</button>
    `;
    progressBar.style.width = `100%`;
    timerEl.textContent = "";
}

loadQuestion();
