let vocabWords = [];
let puzzle = [];
let answers = {};

function addVocab() {
    const japanese = document.getElementById('japanese').value.trim();
    const english = document.getElementById('english').value.trim();
    
    if (japanese && english) {
        vocabWords.push({ japanese, english });
        document.getElementById('japanese').value = '';
        document.getElementById('english').value = '';
        updateVocabList();
    }
}

function updateVocabList() {
    const list = document.getElementById('vocabList');
    list.innerHTML = vocabWords.map((word, idx) => `
        <div class="vocab-item">
            <span><strong>${word.japanese}</strong> - ${word.english}</span>
            <button class="delete-btn" onclick="deleteVocab(${idx})">Delete</button>
        </div>
    `).join('');
}

function deleteVocab(idx) {
    vocabWords.splice(idx, 1);
    updateVocabList();
}

function generatePuzzle() {
    if (vocabWords.length < 2) {
        alert('Please add at least 2 vocabulary words!');
        return;
    }

    const size = Math.max(8, Math.min(15, vocabWords.length + 3));
    puzzle = Array(size).fill(null).map(() => Array(size).fill(null));
    answers = {};
    
    let clueNumber = 1;
    let acrossClues = [];
    let downClues = [];

    vocabWords.forEach((word, idx) => {
        const isAcross = idx % 2 === 0;
        const chars = word.japanese.split('');
        
        if (isAcross) {
            const row = Math.floor(idx / 2) + 2;
            const col = 2;
            
            for (let i = 0; i < chars.length; i++) {
                if (col + i < size) {
                    puzzle[row][col + i] = { char: chars[i], number: i === 0 ? clueNumber : null };
                }
            }
            
            acrossClues.push({ number: clueNumber, clue: word.english, answer: word.japanese });
            answers[clueNumber] = { direction: 'across', row, col, answer: word.japanese };
        } else {
            const row = 2;
            const col = Math.floor(idx / 2) * 2 + 2;
            
            for (let i = 0; i < chars.length; i++) {
                if (row + i < size) {
                    if (!puzzle[row + i][col]) {
                        puzzle[row + i][col] = { char: chars[i], number: i === 0 ? clueNumber : null };
                    }
                }
            }
            
            downClues.push({ number: clueNumber, clue: word.english, answer: word.japanese });
            answers[clueNumber] = { direction: 'down', row, col, answer: word.japanese };
        }
        
        clueNumber++;
    });

    renderPuzzle(acrossClues, downClues);
}

function renderPuzzle(acrossClues, downClues) {
    const grid = document.getElementById('puzzleGrid');
    const size = puzzle.length;
    
    grid.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    grid.innerHTML = '';

    puzzle.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            
            if (cell) {
                if (cell.number) {
                    const num = document.createElement('span');
                    num.className = 'cell-number';
                    num.textContent = cell.number;
                    cellDiv.appendChild(num);
                }
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;
                input.dataset.answer = cell.char;
                cellDiv.appendChild(input);
            } else {
                cellDiv.classList.add('black');
            }
            
            grid.appendChild(cellDiv);
        });
    });

    document.getElementById('acrossClues').innerHTML = acrossClues.map(clue => 
        `<div class="clue-item"><strong>${clue.number}.</strong> ${clue.clue}</div>`
    ).join('');

    document.getElementById('downClues').innerHTML = downClues.map(clue => 
        `<div class="clue-item"><strong>${clue.number}.</strong> ${clue.clue}</div>`
    ).join('');

    document.getElementById('puzzleContainer').style.display = 'block';
}

function checkAnswers() {
    const inputs = document.querySelectorAll('.cell input');
    let correct = 0;
    let total = 0;

    inputs.forEach(input => {
        total++;
        if (input.value === input.dataset.answer) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            correct++;
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
    });

    alert(`You got ${correct} out of ${total} correct!`);
}