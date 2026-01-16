/* let allQuestions = [];
let current = 0;
let score = 0;
let test = [];

fetch("data/khanate.json")
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    startTest();
  });

function startTest() {
  test = shuffle(allQuestions).slice(0, 20);
  showQuestion();
}

function showQuestion() {
  const q = test[current];
  document.getElementById("question").innerText = q.question;

  let options = [q.answer];

  while (options.length < 4) {
    let rand = allQuestions[Math.floor(Math.random() * allQuestions.length)].answer;
    if (!options.includes(rand)) options.push(rand);
  }

  options = shuffle(options);

  const box = document.getElementById("options");
  box.innerHTML = "";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.answer);
    box.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) score++;
  current++;

  if (current < test.length) showQuestion();
  else finish();
}

function finish() {
  document.body.innerHTML = `
    <h1>Тест аяқталды</h1>
    <h2>Нәтиже: ${score} / ${test.length}</h2>
    <button onclick="location.reload()">Қайта бастау</button>
  `;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
 */
let allQuestions = [];
let test = [];
let current = 0;
let score = 0;
let mistakes = [];

// Файлды жүктеу
fetch("data/khanat-v2.json")
  .then(r => r.json())
  .then(data => {
    allQuestions = data;
    start();
  });

function start() {
  // Фишер-Йейтс алгоритмімен араластырып, 20 сұрақ алу
  test = shuffle([...allQuestions]).slice(0, 20);
  current = 0;
  score = 0;
  mistakes = [];
  render();
}

function render() {
  const q = test[current];
  
  // Прогрессті көрсету
  document.getElementById("progress").innerHTML = `
    <div class="bar-container">
      <div class="bar" style="width: ${(current / test.length) * 100}%"></div>
    </div>
    <p>Сұрақ ${current + 1} / ${test.length}</p>
  `;

  document.getElementById("question").innerText = q.question;

  // Жауаптарды араластыру (JSON-дағы options-ты қолданамыз)
  let answers = shuffle([...q.options]);

  const box = document.getElementById("options");
  box.innerHTML = "";

  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = ans;
    btn.onclick = () => select(ans, q.answer, btn);
    box.appendChild(btn);
  });
}

function select(selected, correct, btn) {
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => b.style.pointerEvents = "none"); // Қайта басуды блоктау

  if (selected === correct) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    mistakes.push({
      question: test[current].question,
      correct,
      selected
    });
    // Дұрыс жауапты көрсету
    buttons.forEach(b => {
      if (b.innerText === correct) b.classList.add("correct");
    });
  }

  // Келесі сұраққа өту
  setTimeout(() => {
    current++;
    current < test.length ? render() : finish();
  }, 1200);
}

function finish() {
  const app = document.getElementById("app");
  const percent = Math.round((score / test.length) * 100);

  // Нәтиже тақтасы
  let html = `
    <div class="result">
      <div class="score-circle">${percent}%</div>
      <h2>Тест аяқталды</h2>
      <p>Жиналған ұпай: <b>${score}</b> / ${test.length}</p>
      <button class="retry-btn" onclick="location.reload()">Қайта бастау</button>
    </div>
  `;

  // Қателермен жұмыс бөлімі
  if (mistakes.length > 0) {
    html += `<div class="mistakes-container">
      <h3 class="mistakes-title">Қателермен жұмыс:</h3>`;
    
    mistakes.forEach((m, index) => {
      html += `
        <div class="mistake-card">
          <div class="m-number">${index + 1}</div>
          <div class="m-content">
            <div class="m-question">${m.question}</div>
            <div class="m-details">
              <div class="m-line wrong-line">
                <span class="m-icon">✕</span>
                <span class="m-label">Сіздің жауабыңыз:</span> 
                <span class="m-val">${m.selected}</span>
              </div>
              <div class="m-line correct-line">
                <span class="m-icon">✓</span>
                <span class="m-label">Дұрыс жауап:</span> 
                <span class="m-val">${m.correct}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  } else {
    html += `<div class="perfect-score">Керемет! Сіз ешқандай қате жібермедіңіз! 🚀</div>`;
  }

  app.innerHTML = `<div class="container">${html}</div>`;
}

// Фишер-Йейтс араластыру алгоритмі
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}