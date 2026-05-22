//nacte a ulozi vlastni slova
function getCW() {
    try { return JSON.parse(localStorage.getItem('hangman_custom') || '[]'); }
    catch(e) { return []; }
}
function saveCW(a) { localStorage.setItem('hangman_custom', JSON.stringify(a)); }

//kontroluje jestli je slovo spravne podle pravidel
function valWord() {
    var v = document.getElementById('cword').value.trim();
    var err = document.getElementById('err');
    if (!v) { err.textContent = ''; return false; }
    if (v.length < 3) { err.textContent = 'Slovo musí mít alespoň 3 znaky.'; return false; }
    if (!/^[a-záčďéěíňóřšťúůýžA-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ ]+$/.test(v)) { err.textContent = 'Pouze písmena a mezery.'; return false; }
    err.textContent = ''; return true;
}
//uklada slovo, kontroluje duplicitu, vola validaci
function addWord() {
    try {
        if (!valWord()) throw new Error(document.getElementById('err').textContent || 'Neplatné slovo');
        var word = document.getElementById('cword').value.trim().toUpperCase();
        var hint = document.getElementById('chint').value.trim();
        var arr = getCW();
        if (arr.filter(function(x){ return x.word === word; }).length) throw new Error('Toto slovo již existuje.');
        arr.push({word: word, hint: hint});
        saveCW(arr);
        document.getElementById('cword').value = '';
        document.getElementById('chint').value = '';
        document.getElementById('ok').textContent = '✔ Přidáno!';
        setTimeout(function(){ document.getElementById('ok').textContent = ''; }, 2000);
    } catch(e) {
        document.getElementById('err').textContent = e.message;
    } finally {
        renderCW();
    }
}
//odstrani pridane slovo
function removeWord(i) {
    var a = getCW();
    a.splice(i, 1);
    saveCW(a);
    renderCW();
}

function clearAll() {
    if (confirm('Smazat všechna vlastní slova?')) { localStorage.removeItem('hangman_custom'); renderCW(); }
}
//preklesly seznam ulozenych slov
function renderCW() {
    var a = getCW();
    document.getElementById('cnt').textContent = a.length;
    document.getElementById('clrBtn').style.display = a.length ? 'inline-block' : 'none';
    var html = '';
    for (var i = 0; i < a.length; i++) {
        html += '<span>' + a[i].word + '<button onclick="removeWord(' + i + ')">×</button></span>';
    }
    document.getElementById('cwlist').innerHTML = html;
}
renderCW();