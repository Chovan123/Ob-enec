
//slova které budou hádana
var WORDS = {
    animals:   [{w:'SLON',h:'Největší suchozemský savec'},{w:'TYGR',h:'Pruhovaná velká kočka'},{w:'DELFIN',h:'Chytrý mořský savec'},{w:'PAPOUŠEK',h:'Pták, který umí mluvit'},{w:'KROKODYL',h:'Plaz s ostrými zuby'},{w:'GORILA',h:'Největší primát'},{w:'ŽIRAFA',h:'Nejdelší krk ze savců'},{w:'GEPARD',h:'Nejrychlejší savec'},{w:'NOSOROŽEC',h:'Savec s rohem na nose'},{w:'CHOBOTNICE',h:'Má 8 chapadel'},{w:'VEVERKA',h:'Sbírá šišky a ořechy'}],
    countries: [{w:'JAPONSKO',h:'Země vycházejícího slunce'},{w:'BRAZILIE',h:'Největší stát Jižní Ameriky'},{w:'KANADA',h:'Druhý největší stát světa'},{w:'AUSTRÁLIE',h:'Kontinent i stát'},{w:'MAROKO',h:'Na severu Afriky'},{w:'NORSKO',h:'Země fjordů'},{w:'FINSKO',h:'Tisíce jezer na severu'},{w:'MEXIKO',h:'Sousedí s USA na jihu'},{w:'TURECKO',h:'Pomezí Evropy a Asie'},{w:'ARGENTINA',h:'Domov tanga a Messiho'}],
    food:      [{w:'AVOKADO',h:'Zelené máslo přírody'},{w:'TIRAMISU',h:'Italský dezert s kávou'},{w:'SUSHI',h:'Japonské jídlo z rýže'},{w:'PAELLA',h:'Španělský pokrm s rýží'},{w:'FALAFEL',h:'Smažené kuličky z cizrny'},{w:'GUACAMOLE',h:'Mexická omáčka z avokáda'},{w:'CROISSANT',h:'Francouzský máslový rohlík'},{w:'BAKLAVA',h:'Sladkost z listového těsta'},{w:'KIMCHI',h:'Korejská kvašená zelenina'}]
};
//promenne
var MAX = 6;
var word, hint, guessed, misses, over;

//nacte vybranou kategorii a nahodne vybere slovo z vyberu.
function startGame() {
    try {
        var cat = document.getElementById('cat').value;
        var pool = [];
        //osetreni chyb
        if (cat === 'custom') {
            pool = JSON.parse(localStorage.getItem('hangman_custom') || '[]').map(function(x){ return {w: x.word, h: x.hint}; });
            if (!pool.length) throw new Error('Nejsou přidána žádná vlastní slova. Přidej je na stránce O hře.');
        } else if (cat === 'all') {
            Object.keys(WORDS).forEach(function(k){ pool = pool.concat(WORDS[k]); });
        } else {
            pool = WORDS[cat] || [];
        }
        //osetreni chyb
        if (!pool.length) throw new Error('Žádná slova v kategorii.');
        var pick = pool[Math.floor(Math.random() * pool.length)];
        word = pick.w.toUpperCase();
        hint = pick.h || '';
        guessed = [];
        misses = 0;
        over = false;

        document.getElementById('game').style.display = 'block';
        document.getElementById('hint-box').style.display = 'none';
        document.getElementById('hint-btn').style.display = 'inline-block';
        document.getElementById('new-btn').style.display = 'none';
        render();
    } catch(e) {
        alert('Chyba: ' + e.message);
    }
}
//preklesli herni prochu : sibenici zivoty pismena
function render() {
    var i;
    for (i = 0; i < 8; i++) {
        document.getElementById('p' + i).setAttribute('visibility', i < misses ? 'visible' : 'hidden');
    }

    var livesHtml = '';
    for (i = 0; i < MAX; i++) {
        livesHtml += '<span style="opacity:' + (i < misses ? '0.15' : '1') + '">❤️</span>';
    }
    document.getElementById('lives').innerHTML = livesHtml;

    var wordHtml = '';
    for (i = 0; i < word.length; i++) {
        var ch = word[i];
        if (ch === ' ') {
            wordHtml += '<span class="space"></span>';
        } else {
            wordHtml += '<span>' + (guessed.indexOf(ch) >= 0 ? ch : '') + '</span>';
        }
    }
    document.getElementById('word-display').innerHTML = wordHtml;

    var el = document.getElementById('status');
    if (isWin()) {
        el.className = 'win';
        el.textContent = '🎉 Výborně! Uhodl(a) jsi slovo!';
    } else if (isLose()) {
        el.className = 'lose';
        el.textContent = '💀 Prohra! Slovo bylo: ' + word;
        revealWord();
    } else {
        el.className = '';
        el.textContent = 'Hádeš... chyby: ' + misses + ' / ' + MAX;
    }

    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
    var letHtml = '';
    for (i = 0; i < alpha.length; i++) {
        var c = alpha[i];
        var used = guessed.indexOf(c) >= 0;
        var cls = used ? (word.indexOf(c) >= 0 ? 'hit' : 'miss') : '';
        letHtml += '<button onclick="guess(\'' + c + '\')" ' + (used || over ? 'disabled' : '') + ' class="' + cls + '">' + c + '</button>';
    }
    document.getElementById('letters').innerHTML = letHtml;
}

//zpracuje zadane pismeno
function guess(ch) {
    try {
        if (over) return;
        if (guessed.indexOf(ch) >= 0) throw new Error('Písmeno již bylo použito');
        guessed.push(ch);
        if (word.indexOf(ch) < 0) misses++;
        if (isWin() || isLose()) endGame();
        render();
    } catch(e) { /* duplikát – ignorovat */ }
}

//kontroluje vyhru
function isWin() {
    for (var i = 0; i < word.length; i++) {
        if (word[i] !== ' ' && guessed.indexOf(word[i]) < 0) return false;
    }
    return true;
}

//kontroluje prohru
function isLose() { return misses >= MAX; }

//ukonci hru
function endGame() {
    over = true;
    document.getElementById('new-btn').style.display = 'inline-block';
    document.getElementById('hint-btn').style.display = 'none';
}
//jestli prohraje ukaze slovo
function revealWord() {
    var spans = document.getElementById('word-display').querySelectorAll('span:not(.space)');
    var clean = word.replace(/ /g, '');
    for (var i = 0; i < spans.length; i++) {
        if (!spans[i].textContent) { spans[i].textContent = clean[i]; spans[i].className = 'wrong'; }
    }
}
//zobrazi napovedu za cenu zivotu
function useHint() {
    if (over) return;
    if (!hint) { alert('Nápověda není k dispozici.'); return; }
    if (misses >= MAX - 1) { alert('Nemáš dost životů na nápovědu!'); return; }
    misses++;
    var hb = document.getElementById('hint-box');
    hb.style.display = 'block';
    hb.textContent = '💡 ' + hint;
    if (isLose()) endGame();
    render();
}

//umoznuje hadat pismena z klavesnice
document.addEventListener('keydown', function(e) {
    if (over || document.getElementById('game').style.display === 'none') return;
    var ch = e.key.toUpperCase();
    if (/^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]$/.test(ch)) guess(ch);
});