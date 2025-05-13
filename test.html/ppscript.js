// Данные тестов
// Текущий тест и состояние
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let testResults = {};

// Запуск теста
function startTest(testId) {
    currentTest = testId;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // Показываем контейнер теста
    document.getElementById('test-container').classList.remove('hidden');
    document.getElementById('test-title').textContent = testsData[testId].title;
    
    // Скрываем другие секции
    document.querySelector('.section-tests').classList.add('hidden');
    document.querySelector('.section-about').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    
    // Загружаем первый вопрос
    loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
    const question = testsData[currentTest].questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    
    // Обновляем прогресс
    updateProgress();
    
    // Создаем HTML для вопроса
    questionContainer.innerHTML = `
        <div class="question-text">${question.question}</div>
        <ul class="answers-list">
            ${question.answers.map((answer, index) => `
                <li class="answer-item">
                    <label class="answer-label">
                        <input type="radio" name="answer" value="${index}" class="answer-input"
                            ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                        ${answer.text}
                    </label>
                </li>
            `).join('')}
        </ul>
    `;
    
    // Обновляем состояние кнопок навигации
    document.getElementById('btn-prev').disabled = currentQuestionIndex === 0;
    document.getElementById('btn-next').classList.toggle('hidden', currentQuestionIndex === testsData[currentTest].questions.length - 1);
    document.getElementById('btn-finish').classList.toggle('hidden', currentQuestionIndex !== testsData[currentTest].questions.length - 1);
}

// Обновление прогресс-бара
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / testsData[currentTest].questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${currentQuestionIndex + 1}/${testsData[currentTest].questions.length}`;
}

// Переход к следующему вопросу
document.getElementById('btn-next').addEventListener('click', () => {
    saveAnswer();
    currentQuestionIndex++;
    loadQuestion();
});

// Переход к предыдущему вопросу
document.getElementById('btn-prev').addEventListener('click', () => {
    saveAnswer();
    currentQuestionIndex--;
    loadQuestion();
});

// Завершение теста
document.getElementById('btn-finish').addEventListener('click', () => {
    saveAnswer();
    finishTest();
});

// Сохранение ответа
function saveAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    userAnswers[currentQuestionIndex] = selectedAnswer ? parseInt(selectedAnswer.value) : null;
}

// Завершение теста и показ результатов
function finishTest() {
    // Вычисляем результаты
    const correctAnswers = testsData[currentTest].questions.reduce((count, question, index) => {
        return count + (userAnswers[index] !== undefined && 
                       question.answers[userAnswers[index]]?.correct ? 1 : 0);
    }, 0);
    
    const totalQuestions = testsData[currentTest].questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Сохраняем результаты
    testResults = {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: percentage
    };
    
    // Показываем результаты
    showResults();
}

// Показ результатов
function showResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    document.getElementById('test-container').classList.add('hidden');
    
    // Устанавливаем данные результатов
    document.getElementById('result-title').textContent = testsData[currentTest].title;
    document.getElementById('score-percent').textContent = `${testResults.percentage}%`;
    document.getElementById('score-correct').textContent = testResults.correct;
    document.getElementById('score-total').textContent = testResults.total;
    
    // Устанавливаем сообщение в зависимости от результата
    let message = '';
    if (testResults.percentage >= 80) {
        message = 'Отличный результат!';
    } else if (testResults.percentage >= 50) {
        message = 'Хороший результат, но есть куда расти!';
    } else {
        message = 'Попробуйте еще раз и изучите рекомендации!';
    }
    document.getElementById('score-message').textContent = message;
    
    // Заполняем рекомендации
    const recommendationsList = document.getElementById('recommendations');
    recommendationsList.innerHTML = testsData[currentTest].recommendations
        .map(rec => `<li>${rec}</li>`)
        .join('');
    
    // Анимируем круг прогресса
    animateProgressCircle(testResults.percentage);
}

// Анимация круга прогресса
function animateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.style.stroke = '#3498db';
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// Перезапуск теста
function restartTest() {
    startTest(currentTest);
}

// Показ выбора тестов
function showTestSelection() {
    document.getElementById('results').classList.add('hidden');
    document.querySelector('.section-tests').classList.remove('hidden');
    document.querySelector('.section-about').classList.remove('hidden');
}
const testsData = {
    russian: {
        title: "Тест по русскому языку",
        questions: [
            // Простые вопросы
            {
                question: "В каком слове пропущена буква 'и'?",
                answers: [
                    { text: "ц..ркуль", correct: false },
                    { text: "ц..ганский", correct: true },
                    { text: "ц..кот", correct: false },
                    { text: "ц..плёнок", correct: false }
                ],
                difficulty: "easy"
            },
            {
                question: "Какое слово пишется с одной 'н'?",
                answers: [
                    { text: "деревя..ый", correct: false },
                    { text: "стекля..ый", correct: false },
                    { text: "оловя..ый", correct: false },
                    { text: "ветре..ый", correct: true }
                ],
                difficulty: "easy"
            },
            
            // Средней сложности
            {
                question: "В каком предложении НЕ со словом пишется раздельно?",
                answers: [
                    { text: "Это (не)правда, а ложь.", correct: true },
                    { text: "Он (не)ряшливый, а аккуратный.", correct: false },
                    { text: "Задача (не)решена.", correct: false },
                    { text: "(Не)смотря на дождь, мы пошли гулять.", correct: false }
                ],
                difficulty: "medium"
            },
            {
                question: "Укажите предложение с грамматической ошибкой:",
                answers: [
                    { text: "Благодаря усилиям врачей больной быстро выздоровел.", correct: false },
                    { text: "По окончанию университета он получил диплом.", correct: true },
                    { text: "Вопреки прогнозам погода улучшилась.", correct: false },
                    { text: "Согласно приказу все должны явиться вовремя.", correct: false }
                ],
                difficulty: "medium"
            },
            
            // Сложные вопросы
            {
                question: "В каком ряду во всех словах пропущена буква Е?",
                answers: [
                    { text: "Прим..рять соседей, прим..рять костюм", correct: true },
                    { text: "Зап..вать песню, зап..вать лекарство", correct: false },
                    { text: "Пос..деть на скамейке, пос..деть от старости", correct: false },
                    { text: "Подр..внять клумбу, подр..внять в правах", correct: false }
                ],
                difficulty: "hard"
            },
            {
                question: "В каком варианте ответа правильно указаны все цифры, на месте которых пишется НН?<br>Искус(1)ый мрамор был обработа(2) полирова(3)ыми инструментами и выглядел как настоящий.",
                answers: [
                    { text: "1, 2, 3", correct: false },
                    { text: "1, 2", correct: false },
                    { text: "2, 3", correct: true },
                    { text: "1, 3", correct: false }
                ],
                difficulty: "hard"
            }
        ],
        recommendations: [
            "Повторите правила написания безударных гласных в корне слова",
            "Изучите случаи слитного и раздельного написания НЕ с разными частями речи",
            "Обратите внимание на управление предлогов",
            "Повторите правила написания одной и двух букв Н в разных частях речи",
            "Практикуйтесь в различении омонимов (слов, звучащих одинаково, но имеющих разное значение)"
        ]
    },
    math: {
        title: "Тест по математике",
        questions: [
            // Простые вопросы
            {
                question: "Решите уравнение: 2x + 3 = 11",
                answers: [
                    { text: "4", correct: true },
                    { text: "5", correct: false },
                    { text: "6", correct: false },
                    { text: "7", correct: false }
                ],
                difficulty: "easy"
            },
            {
                question: "Чему равна площадь квадрата со стороной 5 см?",
                answers: [
                    { text: "10 см²", correct: false },
                    { text: "20 см²", correct: false },
                    { text: "25 см²", correct: true },
                    { text: "30 см²", correct: false }
                ],
                difficulty: "easy"
            },
            
            // Средней сложности
            {
                question: "Решите систему уравнений:<br>x + y = 10<br>x - y = 4",
                answers: [
                    { text: "x=7, y=3", correct: true },
                    { text: "x=6, y=4", correct: false },
                    { text: "x=8, y=2", correct: false },
                    { text: "x=5, y=5", correct: false }
                ],
                difficulty: "medium"
            },
            {
                question: "Какое из этих чисел является иррациональным?",
                answers: [
                    { text: "√9", correct: false },
                    { text: "√16", correct: false },
                    { text: "√25", correct: false },
                    { text: "√2", correct: true }
                ],
                difficulty: "medium"
            },
            
            // Сложные вопросы
            {
                question: "Решите уравнение: log₂(x) + log₂(x-4) = 5",
                answers: [
                    { text: "8", correct: true },
                    { text: "6", correct: false },
                    { text: "10", correct: false },
                    { text: "12", correct: false }
                ],
                difficulty: "hard"
            },
            {
                question: "Найдите производную функции f(x) = 3x⁴ - 2x³ + 5x - 1",
                answers: [
                    { text: "12x³ - 6x² + 5", correct: true },
                    { text: "12x³ - 6x² + 5x", correct: false },
                    { text: "3x³ - 2x² + 5", correct: false },
                    { text: "12x³ - 2x² + 5", correct: false }
                ],
                difficulty: "hard"
            }
        ],
        recommendations: [
            "Повторите решение линейных уравнений",
            "Изучите формулы площадей геометрических фигур",
            "Практикуйтесь в решении систем уравнений",
            "Повторите свойства различных типов чисел (натуральные, целые, рациональные, иррациональные)",
            "Освойте основы дифференциального исчисления"
        ]
    },
    it: {
        title: "Тест по информатике",
        questions: [
            // Простые вопросы
            {
                question: "Какой язык используется для стилизации веб-страниц?",
                answers: [
                    { text: "HTML", correct: false },
                    { text: "CSS", correct: true },
                    { text: "JavaScript", correct: false },
                    { text: "Python", correct: false }
                ],
                difficulty: "easy"
            },
            {
                question: "Какое устройство используется для ввода информации в компьютер?",
                answers: [
                    { text: "Монитор", correct: false },
                    { text: "Принтер", correct: false },
                    { text: "Клавиатура", correct: true },
                    { text: "Колонки", correct: false }
                ],
                difficulty: "easy"
            },
            
            // Средней сложности
            {
                question: "Какой алгоритм сортировки имеет среднюю сложность O(n log n)?",
                answers: [
                    { text: "Пузырьковая сортировка", correct: false },
                    { text: "Сортировка вставками", correct: false },
                    { text: "Быстрая сортировка", correct: true },
                    { text: "Сортировка выбором", correct: false }
                ],
                difficulty: "medium"
            },
            {
                question: "Какой протокол используется для безопасной передачи данных в интернете?",
                answers: [
                    { text: "HTTP", correct: false },
                    { text: "FTP", correct: false },
                    { text: "HTTPS", correct: true },
                    { text: "SMTP", correct: false }
                ],
                difficulty: "medium"
            },
            
            // Сложные вопросы
            {
                question: "Что выведет следующий код на Python?<br>def foo(x, lst=[]):<br>&nbsp;&nbsp;lst.append(x)<br>&nbsp;&nbsp;return lst<br>print(foo(1))<br>print(foo(2))",
                answers: [
                    { text: "[1] [2]", correct: false },
                    { text: "[1] [1, 2]", correct: true },
                    { text: "[1] [2, 1]", correct: false },
                    { text: "Ошибку", correct: false }
                ],
                difficulty: "hard"
            },
            {
                question: "Какая из этих структур данных работает по принципу LIFO?",
                answers: [
                    { text: "Очередь", correct: false },
                    { text: "Стек", correct: true },
                    { text: "Связный список", correct: false },
                    { text: "Дерево", correct: false }
                ],
                difficulty: "hard"
            }
        ],
        recommendations: [
            "Изучите основы веб-технологий (HTML, CSS, JavaScript)",
            "Познакомьтесь с различными алгоритмами сортировки и их сложностью",
            "Узнайте больше о сетевых протоколах и их применении",
            "Изучите особенности работы с функциями в Python",
            "Повторите основные структуры данных и их свойства"
        ]
    }
};

