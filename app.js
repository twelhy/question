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

fetch("data/khanate.json")
  .then(r => r.json())
  .then(data => {
    allQuestions = data;
    start();
  });

function start() {
  test = shuffle([...allQuestions]).slice(0, 20);
  current = 0;
  score = 0;
  mistakes = [];
  render();
}

function render() {
  const q = test[current];

  document.getElementById("progress").innerText =
    `Сұрақ ${current + 1} / ${test.length}`;

  document.getElementById("question").innerText = q.question;

  let answers = [q.answer];
  while (answers.length < 4) {
    const rand = allQuestions[Math.floor(Math.random() * allQuestions.length)].answer;
    if (!answers.includes(rand)) answers.push(rand);
  }

  answers = shuffle(answers);

  const box = document.getElementById("options");
  box.innerHTML = "";

  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = () => select(ans, q.answer, btn);
    box.appendChild(btn);
  });
}

function select(selected, correct, btn) {
  const buttons = document.querySelectorAll(".options button");
  buttons.forEach(b => b.disabled = true);

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
    buttons.forEach(b => {
      if (b.innerText === correct) b.classList.add("correct");
    });
  }

  setTimeout(() => {
    current++;
    current < test.length ? render() : finish();
  }, 800);
}

function finish() {
  const app = document.getElementById("app");

  let html = `
    <div class="result">
      <h2>Тест аяқталды</h2>
      <p>Дұрыс жауаптар: <b>${score}</b> / ${test.length}</p>
      <p>Қате: <b>${mistakes.length}</b></p>
  `;

  if (mistakes.length) {
    html += `<h3>Қателер:</h3>`;
    mistakes.forEach(m => {
      html += `
        <div class="mistake">
          <b>${m.question}</b><br>
          Сен таңдадың: ❌ ${m.selected}<br>
          Дұрыс жауап: ✅ ${m.correct}
        </div>
      `;
    });
  }

  html += `<button onclick="location.reload()">Қайта бастау</button></div>`;
  app.innerHTML = html;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
