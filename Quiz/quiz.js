/* quiz.js — self-contained quiz logic
   - Uses window.QUESTION_BANK if provided (external questions.js)
   - Otherwise falls back to built-in internal question bank (100 items)
   - Picks up to POOL_SIZE (100) from bank, then uses SESSION_SIZE (10) randomly
*/

(() => {
  // --- Configuration ---
  const POOL_SIZE = 100;    // choose up to this many questions from bank
  const SESSION_SIZE = 10;  // show this many per session
  const AUTO_SHUFFLE = true;

  // --- Built-in fallback question bank (100 items) ---
  // Each item: { q: "Question?", choices: ["A","B","C","D"], correct: "A" }
  const BUILT_IN_BANK = [
    { q: "What is 2^5 × 2^3 equal to (exponent rule)?", choices: ["2^8","2^15","2^10","2^5"], correct: "2^8" },
    { q: "Which gas is the major contributor to the greenhouse effect?", choices: ["Carbon dioxide","Oxygen","Nitrogen","Helium"], correct: "Carbon dioxide" },
    { q: "Who proposed the law of universal gravitation?", choices: ["Isaac Newton","Albert Einstein","Galileo Galilei","Kepler"], correct: "Isaac Newton" },
    { q: "What is the chemical formula of ozone?", choices: ["O3","O2","CO2","H2O"], correct: "O3" },
    { q: "Which metal is extracted from bauxite ore?", choices: ["Aluminium","Iron","Copper","Zinc"], correct: "Aluminium" },
    { q: "Which part of a plant cell contains chlorophyll?", choices: ["Chloroplast","Mitochondrion","Nucleus","Golgi apparatus"], correct: "Chloroplast" },
    { q: "What does DNA stand for?", choices: ["Deoxyribonucleic acid","Dinucleic acid","Deoxyribose nucleic acid","Dideoxyribonucleic acid"], correct: "Deoxyribonucleic acid" },
    { q: "Which vitamin is primarily produced when skin is exposed to sunlight?", choices: ["Vitamin D","Vitamin C","Vitamin B12","Vitamin K"], correct: "Vitamin D" },
    { q: "What is the SI unit of force?", choices: ["Newton","Joule","Watt","Pascal"], correct: "Newton" },
    { q: "If f(x) = 3x + 2, what is f(4)?", choices: ["14","12","10","8"], correct: "14" },

    { q: "What is the derivative of x^2?", choices: ["2x","x","x^2","1"], correct: "2x" },
    { q: "π (pi) approximately equals to 3 decimal places?", choices: ["3.142","3.141","3.143","3.140"], correct: "3.142" },
    { q: "If two angles of a triangle are 35° and 65°, the third angle is?", choices: ["80°","70°","90°","85°"], correct: "80°" },
    { q: "What is the next prime after 29?", choices: ["31","30","33","29"], correct: "31" },
    { q: "Which continent has the most countries?", choices: ["Africa","Asia","Europe","South America"], correct: "Africa" },
    { q: "Which river is commonly cited as the longest in the world?", choices: ["Nile","Amazon","Yangtze","Mississippi"], correct: "Nile" },
    { q: "Which country is the largest by land area?", choices: ["Russia","Canada","China","USA"], correct: "Russia" },
    { q: "What is the capital of Australia?", choices: ["Canberra","Sydney","Melbourne","Perth"], correct: "Canberra" },
    { q: "Mount Everest belongs to which mountain range?", choices: ["Himalayas","Andes","Rockies","Alps"], correct: "Himalayas" },
    { q: "Who was the first Prime Minister of independent India?", choices: ["Jawaharlal Nehru","Mahatma Gandhi","Sardar Patel","Lal Bahadur Shastri"], correct: "Jawaharlal Nehru" },

    { q: "Which major event began on 1 September 1939?", choices: ["World War II","World War I","American Civil War","Cold War"], correct: "World War II" },
    { q: "The Renaissance began in which country?", choices: ["Italy","France","England","Spain"], correct: "Italy" },
    { q: "Who wrote 'The Republic'?", choices: ["Plato","Aristotle","Socrates","Homer"], correct: "Plato" },
    { q: "Which civilization built the pyramids at Giza?", choices: ["Ancient Egyptians","Babylonians","Romans","Greeks"], correct: "Ancient Egyptians" },
    { q: "Which element has atomic number 1?", choices: ["Hydrogen","Helium","Lithium","Oxygen"], correct: "Hydrogen" },
    { q: "Which element uses the symbol 'Fe'?", choices: ["Iron","Fluorine","Fermium","Francium"], correct: "Iron" },
    { q: "Which organ produces bile in humans?", choices: ["Liver","Pancreas","Stomach","Spleen"], correct: "Liver" },
    { q: "What is the main component of natural gas?", choices: ["Methane","Propane","Butane","Ethane"], correct: "Methane" },
    { q: "Which subatomic particle carries a positive charge?", choices: ["Proton","Electron","Neutron","Photon"], correct: "Proton" },
    { q: "What does HTTP stand for?", choices: ["HyperText Transfer Protocol","High Transfer Text Protocol","HyperText Transmission Program","Hyper Transmission Text Protocol"], correct: "HyperText Transfer Protocol" },

    { q: "Which data structure follows FIFO ordering?", choices: ["Queue","Stack","Tree","Graph"], correct: "Queue" },
    { q: "Which language is primarily used for styling web pages?", choices: ["CSS","Python","JavaScript","C++"], correct: "CSS" },
    { q: "Which company created the Java programming language?", choices: ["Sun Microsystems","Microsoft","Apple","IBM"], correct: "Sun Microsystems" },
    { q: "Which number is the multiplicative identity?", choices: ["1","0","-1","2"], correct: "1" },
    { q: "Which gas makes up about 78% of Earth's atmosphere?", choices: ["Nitrogen","Oxygen","Argon","Carbon dioxide"], correct: "Nitrogen" },
    { q: "Which organ is primarily used for respiration in fish?", choices: ["Gills","Lungs","Skin","Fins"], correct: "Gills" },
    { q: "Which process converts CO₂ and sunlight into sugars in plants?", choices: ["Photosynthesis","Respiration","Transpiration","Fermentation"], correct: "Photosynthesis" },
    { q: "What is the hardest natural substance?", choices: ["Diamond","Graphite","Quartz","Topaz"], correct: "Diamond" },
    { q: "Which scale measures earthquake magnitude?", choices: ["Richter scale","Celsius scale","Beaufort scale","Fujita scale"], correct: "Richter scale" },
    { q: "Who discovered penicillin?", choices: ["Alexander Fleming","Louis Pasteur","Marie Curie","Robert Koch"], correct: "Alexander Fleming" },

    { q: "The Great Barrier Reef is off the coast of which country?", choices: ["Australia","Indonesia","Philippines","Madagascar"], correct: "Australia" },
    { q: "Which symbol means 'approximately equal'?", choices: ["≈","=","≠","≤"], correct: "≈" },
    { q: "Which chemicals were historically linked to ozone depletion?", choices: ["CFCs (chlorofluorocarbons)","CO2","Methane","Nitrous oxide"], correct: "CFCs (chlorofluorocarbons)" },
    { q: "Which brain region regulates the pituitary (master regulator)?", choices: ["Hypothalamus","Liver","Pancreas","Kidney"], correct: "Hypothalamus" },
    { q: "Which country launched the first artificial satellite (Sputnik)?", choices: ["Soviet Union","USA","China","UK"], correct: "Soviet Union" },
    { q: "How many semitones are there in an octave?", choices: ["12","8","7","10"], correct: "12" },
    { q: "Who formulated the theory of relativity?", choices: ["Albert Einstein","Isaac Newton","Galileo Galilei","Niels Bohr"], correct: "Albert Einstein" },
    { q: "Which philosopher tutored Alexander the Great?", choices: ["Aristotle","Plato","Socrates","Epicurus"], correct: "Aristotle" },
    { q: "What is the SI unit of electrical capacitance?", choices: ["Farad","Henry","Weber","Tesla"], correct: "Farad" },
    { q: "Which phenomenon explains the change in frequency of sound with motion?", choices: ["Doppler effect","Photoelectric effect","Compton effect","Hall effect"], correct: "Doppler effect" },

    { q: "Which ocean is the largest by area?", choices: ["Pacific Ocean","Atlantic Ocean","Indian Ocean","Arctic Ocean"], correct: "Pacific Ocean" },
    { q: "What is the chemical symbol for gold?", choices: ["Au","Ag","Gd","Go"], correct: "Au" },
    { q: "Which instrument measures atmospheric pressure?", choices: ["Barometer","Thermometer","Hygrometer","Anemometer"], correct: "Barometer" },
    { q: "Which metal has the highest melting point?", choices: ["Tungsten","Iron","Gold","Lead"], correct: "Tungsten" },
    { q: "Which is the largest internal organ of the human body?", choices: ["Liver","Lung","Brain","Heart"], correct: "Liver" },
    { q: "What is the smallest prime number?", choices: ["2","1","3","5"], correct: "2" },
    { q: "Which planet rotates in a retrograde (clockwise) direction?", choices: ["Venus","Earth","Mars","Mercury"], correct: "Venus" },
    { q: "What is the currency of South Korea?", choices: ["Won","Yen","Ringgit","Baht"], correct: "Won" },
    { q: "Which element has the highest electronegativity (Pauling)?", choices: ["Fluorine","Oxygen","Chlorine","Nitrogen"], correct: "Fluorine" },
    { q: "Which mountain range is the longest above water?", choices: ["Andes","Rockies","Himalayas","Alps"], correct: "Andes" },

    { q: "Which unit measures luminous intensity?", choices: ["Candela","Lumen","Lux","Watt"], correct: "Candela" },
    { q: "How many bits are in one byte?", choices: ["8","4","16","2"], correct: "8" },
    { q: "Which country has the most freshwater lakes?", choices: ["Canada","Russia","USA","Brazil"], correct: "Canada" },
    { q: "Which river flows through Paris?", choices: ["Seine","Thames","Danube","Rhine"], correct: "Seine" },
    { q: "Which sea lies between Saudi Arabia and Africa?", choices: ["Red Sea","Arabian Sea","Caspian Sea","Black Sea"], correct: "Red Sea" },
    { q: "Mount Kilimanjaro is located in which country?", choices: ["Tanzania","Kenya","Ethiopia","Uganda"], correct: "Tanzania" },
    { q: "Which canal connects the Mediterranean Sea to the Red Sea?", choices: ["Suez Canal","Panama Canal","Kiel Canal","Corinth Canal"], correct: "Suez Canal" },
    { q: "Where is the deepest point on Earth located (Mariana Trench)?", choices: ["Mariana Trench","Puerto Rico Trench","Java Trench","Tonga Trench"], correct: "Mariana Trench" },
    { q: "Which organ produces insulin in the human body?", choices: ["Pancreas","Liver","Spleen","Thyroid"], correct: "Pancreas" },
    { q: "GDP per capita is:", choices: ["GDP divided by population","GDP minus imports","GDP times population","GDP per city"], correct: "GDP divided by population" },

    { q: "Who is associated with the uncertainty principle?", choices: ["Heisenberg","Einstein","Bohr","Planck"], correct: "Heisenberg" },
    { q: "Who composed the 'Moonlight Sonata'?", choices: ["Beethoven","Mozart","Bach","Chopin"], correct: "Beethoven" },
    { q: "What is the chemical formula for table salt?", choices: ["NaCl","KCl","Na2SO4","HCl"], correct: "NaCl" },
    { q: "Which device converts chemical energy into electrical energy?", choices: ["Battery","Motor","Transformer","Capacitor"], correct: "Battery" },
    { q: "Which mammal is capable of true powered flight?", choices: ["Bat","Flying squirrel","Sugar glider","Colugo"], correct: "Bat" },
    { q: "Which gas is commonly used in neon signs?", choices: ["Neon","Argon","Krypton","Xenon"], correct: "Neon" },
    { q: "Which programming language emphasizes 'write once, run anywhere'?", choices: ["Java","C","Python","Ruby"], correct: "Java" },
    { q: "Which noble gas is the lightest?", choices: ["Helium","Neon","Argon","Krypton"], correct: "Helium" },
    { q: "Who co-authored the Communist Manifesto with Engels?", choices: ["Karl Marx","Lenin","Machiavelli","Hegel"], correct: "Karl Marx" },
    { q: "Who discovered the sea route to India in 1498?", choices: ["Vasco da Gama","Christopher Columbus","Magellan","Cabot"], correct: "Vasco da Gama" },

    { q: "Who was called the 'Iron Lady'?", choices: ["Margaret Thatcher","Indira Gandhi","Golda Meir","Angela Merkel"], correct: "Margaret Thatcher" },
    { q: "Which treaty officially ended World War I?", choices: ["Treaty of Versailles","Treaty of Paris","Treaty of Vienna","Treaty of Ghent"], correct: "Treaty of Versailles" },
    { q: "Which composer wrote 'The Four Seasons'?", choices: ["Vivaldi","Bach","Mozart","Haydn"], correct: "Vivaldi" },
    { q: "Which SI unit measures luminous flux?", choices: ["Lumen","Candela","Lux","Watt"], correct: "Lumen" },
    { q: "Which element has the chemical symbol 'W'?", choices: ["Tungsten","Silver","Tin","Zinc"], correct: "Tungsten" },
    { q: "The process of asexual reproduction in bacteria is called?", choices: ["Binary fission","Mitosis","Meiosis","Budding"], correct: "Binary fission" },
    { q: "Who was the founder of the Maurya Empire?", choices: ["Chandragupta Maurya","Ashoka","Bindusara","Harsha"], correct: "Chandragupta Maurya" },
    { q: "Which hot desert is the largest by area?", choices: ["Sahara Desert","Gobi Desert","Kalahari Desert","Arabian Desert"], correct: "Sahara Desert" },
    { q: "Solve for x: 5x - 3 = 2x + 12. x = ?", choices: ["5","3","-5","6"], correct: "5" },
    { q: "The sum of interior angles of a pentagon (degrees) is?", choices: ["540°","360°","720°","900°"], correct: "540°" }
  ];

  // --- Utility helpers ---
  function isArrayNonEmpty(a){ return Array.isArray(a) && a.length > 0; }
  function shuffle(arr){
    for(let i = arr.length -1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function normalize(s){ return String(s ?? "").replace(/\s+/g,' ').trim().toLowerCase(); }

  // --- Determine source bank: external window.QUESTION_BANK preferred ---
  const external = (typeof window !== "undefined" && isArrayNonEmpty(window.QUESTION_BANK)) ? window.QUESTION_BANK.slice() : null;
  const MASTER_BANK = external ? external : BUILT_IN_BANK.slice();

  // If master bank has fewer than POOL_SIZE, use what's available
  const pool = shuffle(MASTER_BANK.slice()).slice(0, Math.min(POOL_SIZE, MASTER_BANK.length));
  // We'll present SESSION_SIZE randomly chosen from pool (shuffle again)
  let sessionQuestions = shuffle(pool.slice()).slice(0, Math.min(SESSION_SIZE, pool.length));

  // Ensure each question's choices are shuffled so correct remains string-matched
  sessionQuestions.forEach(q => q.choices = shuffle(q.choices.slice()));

  // --- DOM refs ---
  const startBtn = document.getElementById('startBtn');
  const intro = document.getElementById('intro');
  const quiz = document.getElementById('quiz');
  const result = document.getElementById('result');

  const questionText = document.getElementById('questionText');
  const optionsWrap = document.getElementById('options');
  const questionCounter = document.getElementById('questionCounter');
  const timerEl = document.getElementById('timer');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  const scoreBox = document.getElementById('scoreBox');
  const reviewList = document.getElementById('reviewList');
  const retryBtn = document.getElementById('retryBtn');
  const backBtn = document.getElementById('backBtn');

  // --- State ---
  let index = 0;
  let answers = {}; // index -> selected text
  let perQuestionSeconds = 45;
  let perTimer = null;
  let timeLeft = perQuestionSeconds;

  // --- Functions ---
  function renderQuestion(i){
    const q = sessionQuestions[i];
    if(!q) return;
    questionText.textContent = q.q;
    questionCounter.textContent = `Question ${i+1} of ${sessionQuestions.length}`;
    optionsWrap.innerHTML = '';
    q.choices.forEach((ch, ci) => {
      const div = document.createElement('div');
      div.className = 'option';
      if(answers[i] && normalize(answers[i]) === normalize(ch)) div.classList.add('selected');
      const span = document.createElement('span');
      span.className = 'text';
      span.textContent = ch;
      div.appendChild(span);
      div.addEventListener('click', () => {
        answers[i] = ch;
        // refresh options visual
        renderQuestion(i);
        submitBtn.disabled = false;
      });
      optionsWrap.appendChild(div);
    });

    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === sessionQuestions.length - 1;
    // reset timer
    resetTimer();
  }

  function startTimer(){
    stopTimer();
    timeLeft = perQuestionSeconds;
    timerEl.textContent = `⏱ ${timeLeft}s`;
    perTimer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `⏱ ${timeLeft}s`;
      if(timeLeft <= 0){
        stopTimer();
        // auto-advance
        if(index < sessionQuestions.length - 1) { index++; renderQuestion(index); }
      }
    }, 1000);
  }
  function stopTimer(){ if(perTimer) { clearInterval(perTimer); perTimer = null; } }
  function resetTimer(){ stopTimer(); startTimer(); }

  function grade(){
    stopTimer();
    const total = sessionQuestions.length;
    let correct = 0;
    reviewList.innerHTML = '';
    sessionQuestions.forEach((q, i) => {
      const sel = answers[i] ?? null;
      if(sel !== null && normalize(sel) === normalize(q.correct)) correct++;
      else {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `<strong>Q:</strong> ${q.q}<br>
                         <strong>Your:</strong> ${sel ?? '<em>Unanswered</em>'}<br>
                         <strong>Correct:</strong> ${q.correct}`;
        reviewList.appendChild(div);
      }
    });
    const pct = ((correct/total)*100).toFixed(1);
    scoreBox.textContent = `Score: ${correct} / ${total} (${pct}%)`;
    // show result
    quiz.classList.add('hidden');
    result.classList.remove('hidden');
  }

  function startSession(){
    // re-pick session from pool for a fresh run
    const poolCopy = shuffle(pool.slice());
    sessionQuestions = shuffle(poolCopy).slice(0, Math.min(SESSION_SIZE, poolCopy.length));
    sessionQuestions.forEach(q => q.choices = shuffle(q.choices.slice()));
    index = 0;
    answers = {};
    submitBtn.disabled = true;
    intro.classList.add('hidden');
    result.classList.add('hidden');
    quiz.classList.remove('hidden');
    renderQuestion(0);
  }

  // --- Event listeners ---
  startBtn.addEventListener('click', () => startSession());
  prevBtn.addEventListener('click', () => { if(index>0){ index--; renderQuestion(index); } });
  nextBtn.addEventListener('click', () => { if(index < sessionQuestions.length-1){ index++; renderQuestion(index); } });
  submitBtn.addEventListener('click', grade);
  retryBtn.addEventListener('click', () => startSession());
  backBtn.addEventListener('click', () => { result.classList.add('hidden'); intro.classList.remove('hidden'); });

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if(quiz.classList.contains('hidden')) return;
    if(e.key === 'ArrowLeft') prevBtn.click();
    if(e.key === 'ArrowRight') nextBtn.click();
    if(e.key === 'Enter') {
      // if currently focused on option, choose it; otherwise next
      if(document.activeElement && document.activeElement.classList.contains('option')){
        document.activeElement.click();
      } else {
        nextBtn.click();
      }
    }
  });

  // initial UI state
  quiz.classList.add('hidden');
  result.classList.add('hidden');
  timerEl.textContent = `⏱ ${perQuestionSeconds}s`;

  // expose for debugging (optional)
  window.__curriculens = {
    poolSize: pool.length,
    session: () => sessionQuestions,
    useExternal: !!external
  };
})();
