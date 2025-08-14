class MemoryTrainer {
    constructor() {
        this.currentGame = 'number-sequence';
        this.score = {
            correct: 0,
            total: 0
        };
        
        this.cards = [
            {value: 'A', suit: '♠', color: 'black'},
            {value: '2', suit: '♠', color: 'black'},
            {value: '3', suit: '♠', color: 'black'},
            {value: '4', suit: '♠', color: 'black'},
            {value: '5', suit: '♠', color: 'black'},
            {value: '6', suit: '♠', color: 'black'},
            {value: '7', suit: '♠', color: 'black'},
            {value: '8', suit: '♠', color: 'black'},
            {value: '9', suit: '♠', color: 'black'},
            {value: '10', suit: '♠', color: 'black'},
            {value: 'J', suit: '♠', color: 'black'},
            {value: 'Q', suit: '♠', color: 'black'},
            {value: 'K', suit: '♠', color: 'black'},
            {value: 'A', suit: '♥', color: 'red'},
            {value: '2', suit: '♥', color: 'red'},
            {value: '3', suit: '♥', color: 'red'},
            {value: '4', suit: '♥', color: 'red'},
            {value: '5', suit: '♥', color: 'red'},
            {value: '6', suit: '♥', color: 'red'},
            {value: '7', suit: '♥', color: 'red'},
            {value: '8', suit: '♥', color: 'red'},
            {value: '9', suit: '♥', color: 'red'},
            {value: '10', suit: '♥', color: 'red'},
            {value: 'J', suit: '♥', color: 'red'},
            {value: 'Q', suit: '♥', color: 'red'},
            {value: 'K', suit: '♥', color: 'red'},
            {value: 'A', suit: '♣', color: 'black'},
            {value: '2', suit: '♣', color: 'black'},
            {value: '3', suit: '♣', color: 'black'},
            {value: '4', suit: '♣', color: 'black'},
            {value: '5', suit: '♣', color: 'black'},
            {value: '6', suit: '♣', color: 'black'},
            {value: '7', suit: '♣', color: 'black'},
            {value: '8', suit: '♣', color: 'black'},
            {value: '9', suit: '♣', color: 'black'},
            {value: '10', suit: '♣', color: 'black'},
            {value: 'J', suit: '♣', color: 'black'},
            {value: 'Q', suit: '♣', color: 'black'},
            {value: 'K', suit: '♣', color: 'black'},
            {value: 'A', suit: '♦', color: 'red'},
            {value: '2', suit: '♦', color: 'red'},
            {value: '3', suit: '♦', color: 'red'},
            {value: '4', suit: '♦', color: 'red'},
            {value: '5', suit: '♦', color: 'red'},
            {value: '6', suit: '♦', color: 'red'},
            {value: '7', suit: '♦', color: 'red'},
            {value: '8', suit: '♦', color: 'red'},
            {value: '9', suit: '♦', color: 'red'},
            {value: '10', suit: '♦', color: 'red'},
            {value: 'J', suit: '♦', color: 'red'},
            {value: 'Q', suit: '♦', color: 'red'},
            {value: 'K', suit: '♦', color: 'red'}
        ];

        this.objects = [
            '🍎', '🐱', '🚗', '🏠', '📱', '⚽', '🌸', '📚', '☕', '🎵',
            '🎯', '🍕', '🐶', '✈️', '🌙', '🔑', '🎈', '🍰', '🐝', '🎨',
            '🌺', '🦋', '🍊', '🐯', '🏰', '💎', '🎭', '🌊', '🔥', '⭐',
            '🍉', '🐘', '🚂', '🌅', '💮', '🎪', '🐢', '🎸', '🌴', '🦊'
        ];

        this.initializeEventListeners();
        this.updateScoreDisplay();
    }

    initializeEventListeners() {
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchGame(e.target.dataset.game);
            });
        });

        document.getElementById('start-number-game').addEventListener('click', () => {
            this.startNumberGame();
        });

        document.getElementById('submit-number').addEventListener('click', () => {
            this.submitNumberAnswer();
        });

        document.getElementById('number-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitNumberAnswer();
            }
        });

        document.getElementById('start-card-game').addEventListener('click', () => {
            this.startCardGame();
        });

        document.getElementById('start-object-game').addEventListener('click', () => {
            this.startObjectGame();
        });

        document.getElementById('submit-objects').addEventListener('click', () => {
            this.submitObjectAnswer();
        });

        document.getElementById('reset-objects').addEventListener('click', () => {
            this.resetObjectSelection();
        });

        document.getElementById('start-number-image').addEventListener('click', () => {
            this.startNumberImagePractice();
        });

        document.getElementById('next-number').addEventListener('click', () => {
            this.nextNumberImage();
        });

        document.getElementById('start-card-image').addEventListener('click', () => {
            this.startCardImagePractice();
        });

        document.getElementById('next-card').addEventListener('click', () => {
            this.nextCardImage();
        });
    }

    switchGame(gameId) {
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-game="${gameId}"]`).classList.add('active');

        document.querySelectorAll('.game-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(gameId).classList.add('active');

        this.currentGame = gameId;
        this.resetCurrentGame();
    }

    resetCurrentGame() {
        document.querySelectorAll('.display-area').forEach(area => {
            area.innerHTML = '';
        });
        document.querySelectorAll('.input-area').forEach(area => {
            area.style.display = 'none';
        });
        document.querySelectorAll('.result-area').forEach(area => {
            area.innerHTML = '';
            area.className = 'result-area';
        });
    }

    async startNumberGame() {
        const digits = parseInt(document.getElementById('number-digits').value);
        const count = parseInt(document.getElementById('number-count').value);
        const displayArea = document.getElementById('number-display');
        const inputArea = document.getElementById('number-input-area');
        const resultArea = document.getElementById('number-result');

        resultArea.innerHTML = '';
        resultArea.className = 'result-area';
        inputArea.style.display = 'none';

        const sequence = this.generateNumberSequence(digits, count);
        this.currentSequence = sequence;

        displayArea.innerHTML = '<p>数字を覚えてください...</p>';

        for (let i = 0; i < sequence.length; i++) {
            await this.sleep(500);
            displayArea.innerHTML = `<div class="highlight-number">${sequence[i]}</div>`;
            await this.sleep(1000);
        }

        displayArea.innerHTML = '<p>覚えた数字を順番通りに入力してください（スペース区切り）</p>';
        inputArea.style.display = 'block';
        document.getElementById('number-answer').value = '';
        document.getElementById('number-answer').focus();
    }

    generateNumberSequence(digits, count) {
        const sequence = [];
        for (let i = 0; i < count; i++) {
            let number = '';
            for (let j = 0; j < digits; j++) {
                if (j === 0 && digits > 1) {
                    // 最初の桁は1-9（0で始まらないように）
                    number += Math.floor(Math.random() * 9) + 1;
                } else {
                    // その他の桁は0-9
                    number += Math.floor(Math.random() * 10);
                }
            }
            sequence.push(number);
        }
        return sequence;
    }

    submitNumberAnswer() {
        const answer = document.getElementById('number-answer').value.trim();
        const userAnswers = answer.split(/\s+/);
        const correct = this.currentSequence;
        const resultArea = document.getElementById('number-result');

        this.score.total++;

        const isCorrect = userAnswers.length === correct.length && 
                         userAnswers.every((ans, index) => ans === correct[index]);

        if (isCorrect) {
            this.score.correct++;
            resultArea.innerHTML = '正解です！素晴らしい記憶力ですね。';
            resultArea.className = 'result-area success';
        } else {
            resultArea.innerHTML = `不正解です。正解は「${correct.join(' ')}」でした。<br>あなたの回答：「${answer}」`;
            resultArea.className = 'result-area error';
        }

        this.updateScoreDisplay();
    }

    async startCardGame() {
        const cardCount = parseInt(document.getElementById('card-count').value);
        const displayArea = document.getElementById('card-display');
        const inputArea = document.getElementById('card-input-area');
        const resultArea = document.getElementById('card-result');

        resultArea.innerHTML = '';
        resultArea.className = 'result-area';
        inputArea.style.display = 'none';
        inputArea.innerHTML = '';

        const selectedCards = this.getRandomCards(cardCount);
        this.currentCardSequence = selectedCards;
        this.userCardSequence = [];

        displayArea.innerHTML = '<p>カードの順番を覚えてください...</p>';
        await this.sleep(1000);

        for (let i = 0; i < selectedCards.length; i++) {
            await this.sleep(500);
            displayArea.innerHTML = this.createCardElement(selectedCards[i], true);
            await this.sleep(1500);
        }

        displayArea.innerHTML = '<p>覚えた順番でカードをクリックしてください</p>';
        
        // 選択されたカード + 追加のランダムカードを混ぜる
        const additionalCards = this.getRandomCards(Math.min(cardCount * 2, 16))
            .filter(card => !selectedCards.some(selected => 
                selected.value === card.value && selected.suit === card.suit));
        const allCards = this.shuffleArray([...selectedCards, ...additionalCards.slice(0, cardCount)]);
        
        inputArea.innerHTML = allCards.map((card, index) => 
            this.createCardElement(card, false, index)
        ).join('');
        inputArea.style.display = 'block';

        inputArea.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectCard(e.target, allCards[parseInt(e.target.dataset.index)]);
            });
        });
    }

    getRandomCards(count) {
        const shuffled = this.shuffleArray([...this.cards]);
        return shuffled.slice(0, count);
    }

    createCardElement(card, isLarge = false, index = null) {
        const sizeClass = isLarge ? 'style="width: 120px; height: 160px;"' : '';
        const dataAttr = index !== null ? `data-index="${index}"` : '';
        const cardContent = this.formatCardContent(card);
        return `<div class="card ${card.color}" ${sizeClass} ${dataAttr}>${cardContent}</div>`;
    }

    formatCardContent(card) {
        return `
            <div class="card-corner top-left">
                <div class="card-value">${card.value}</div>
                <div class="card-suit">${card.suit}</div>
            </div>
            <div class="card-center">
                <div class="card-suit-large">${card.suit}</div>
            </div>
            <div class="card-corner bottom-right">
                <div class="card-value rotated">${card.value}</div>
                <div class="card-suit rotated">${card.suit}</div>
            </div>
        `;
    }

    selectCard(element, card) {
        if (element.classList.contains('selected')) return;

        element.classList.add('selected');
        this.userCardSequence.push(card);

        if (this.userCardSequence.length === this.currentCardSequence.length) {
            this.checkCardSequence();
        }
    }

    checkCardSequence() {
        const resultArea = document.getElementById('card-result');
        this.score.total++;

        const isCorrect = this.userCardSequence.every((card, index) => 
            card.value === this.currentCardSequence[index].value && 
            card.suit === this.currentCardSequence[index].suit
        );

        if (isCorrect) {
            this.score.correct++;
            resultArea.innerHTML = '正解です！カードの順番を正確に覚えられました。';
            resultArea.className = 'result-area success';
        } else {
            const correctSequence = this.currentCardSequence.map(card => `${card.value}${card.suit}`).join(', ');
            resultArea.innerHTML = `不正解です。正解の順番は「${correctSequence}」でした。`;
            resultArea.className = 'result-area error';
        }

        this.updateScoreDisplay();
    }

    async startObjectGame() {
        const objectCount = parseInt(document.getElementById('object-count').value);
        const displayArea = document.getElementById('object-display');
        const inputArea = document.getElementById('object-input-area');
        const resultArea = document.getElementById('object-result');

        resultArea.innerHTML = '';
        resultArea.className = 'result-area';
        inputArea.style.display = 'none';

        const selectedObjects = this.getRandomObjects(objectCount);
        this.currentObjects = selectedObjects;
        this.selectedObjectsUser = [];

        displayArea.innerHTML = '<p>物や動物が一つずつ表示されます。順番を覚えてください...</p>';
        await this.sleep(1000);

        // 一つずつ表示
        for (let i = 0; i < selectedObjects.length; i++) {
            await this.sleep(500);
            displayArea.innerHTML = `
                <div class="single-object-display">
                    <div class="object-item large">${selectedObjects[i]}</div>
                    <p>第${i + 1}番目</p>
                </div>
            `;
            await this.sleep(1500);
        }

        displayArea.innerHTML = '<p>順番通りにクリックしてください</p>';

        // 選択されたオブジェクト + 追加のランダムオブジェクトを表示
        const additionalObjects = this.getRandomObjects(objectCount * 2)
            .filter(obj => !selectedObjects.includes(obj));
        const allChoices = this.shuffleArray([...selectedObjects, ...additionalObjects.slice(0, objectCount)]);
        
        const choicesArea = document.getElementById('object-choices');
        choicesArea.innerHTML = allChoices.map((obj, index) => 
            `<div class="object-item clickable" data-object="${obj}">${obj}</div>`
        ).join('');

        choicesArea.querySelectorAll('.object-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectObjectInSequence(e.target);
            });
        });

        inputArea.style.display = 'block';
        this.updateSelectedSequenceDisplay();
    }

    getRandomObjects(count) {
        const shuffled = this.shuffleArray([...this.objects]);
        return shuffled.slice(0, count);
    }

    selectObjectInSequence(element) {
        if (element.classList.contains('disabled')) return;

        const object = element.dataset.object;
        this.selectedObjectsUser.push(object);
        
        element.classList.add('selected');
        element.classList.add('disabled');
        element.innerHTML += ` <small>(${this.selectedObjectsUser.length})</small>`;
        
        this.updateSelectedSequenceDisplay();
        
        // 完了チェック
        if (this.selectedObjectsUser.length === this.currentObjects.length) {
            document.getElementById('submit-objects').style.display = 'inline-block';
        }
    }

    resetObjectSelection() {
        this.selectedObjectsUser = [];
        const choicesArea = document.getElementById('object-choices');
        choicesArea.querySelectorAll('.object-item').forEach(item => {
            item.classList.remove('selected', 'disabled');
            item.innerHTML = item.dataset.object;
        });
        this.updateSelectedSequenceDisplay();
        document.getElementById('submit-objects').style.display = 'none';
    }

    updateSelectedSequenceDisplay() {
        const sequenceDisplay = document.getElementById('selected-sequence');
        if (this.selectedObjectsUser.length === 0) {
            sequenceDisplay.innerHTML = '<em>まだ選択されていません</em>';
        } else {
            sequenceDisplay.innerHTML = this.selectedObjectsUser.map((obj, index) => 
                `<span class="sequence-item">${index + 1}. ${obj}</span>`
            ).join(' ');
        }
    }

    submitObjectAnswer() {
        const resultArea = document.getElementById('object-result');
        this.score.total++;

        // 順番が正確かどうかをチェック
        const isCorrectSequence = this.selectedObjectsUser.length === this.currentObjects.length &&
                                 this.selectedObjectsUser.every((obj, index) => obj === this.currentObjects[index]);

        if (isCorrectSequence) {
            this.score.correct++;
            resultArea.innerHTML = '完璧です！順番も含めて正確に覚えられました。';
            resultArea.className = 'result-area success';
        } else {
            const correctSequence = this.currentObjects.join(' → ');
            const userSequence = this.selectedObjectsUser.join(' → ');
            resultArea.innerHTML = `
                <p>不正解です。</p>
                <p><strong>正解の順番:</strong> ${correctSequence}</p>
                <p><strong>あなたの回答:</strong> ${userSequence}</p>
            `;
            resultArea.className = 'result-area error';
        }

        this.updateScoreDisplay();
    }

    startNumberImagePractice() {
        const displayArea = document.getElementById('number-image-display');
        const resultArea = document.getElementById('number-image-result');
        
        displayArea.style.display = 'block';
        resultArea.innerHTML = '';
        
        this.numberImageHistory = [];
        this.nextNumberImage();
    }

    nextNumberImage() {
        const numberElement = document.querySelector('.number-to-convert');
        const inputElement = document.getElementById('image-description');
        const resultArea = document.getElementById('number-image-result');

        // 前の回答を記録
        const previousValue = inputElement.value.trim();
        const previousNumber = numberElement.textContent;
        
        if (previousValue && previousNumber) {
            this.numberImageHistory.push({
                number: previousNumber,
                image: previousValue
            });
            
            resultArea.innerHTML = `
                <div class="practice-history">
                    <h4>練習履歴</h4>
                    ${this.numberImageHistory.slice(-5).map(item => 
                        `<div class="history-item">
                            <strong>${item.number}</strong> → ${item.image}
                        </div>`
                    ).join('')}
                    ${this.numberImageHistory.length > 5 ? '<div class="history-note">...他' + (this.numberImageHistory.length - 5) + '個</div>' : ''}
                </div>
            `;
            resultArea.className = 'result-area success';
        }

        // 新しい数字を表示
        const randomNumber = Math.floor(Math.random() * 100);
        numberElement.textContent = randomNumber;
        inputElement.value = '';
        inputElement.focus();
    }

    startCardImagePractice() {
        const displayArea = document.getElementById('card-image-display');
        const resultArea = document.getElementById('card-image-result');
        
        displayArea.style.display = 'block';
        resultArea.innerHTML = '';
        
        this.cardImageHistory = [];
        this.nextCardImage();
    }

    nextCardImage() {
        const cardElement = document.querySelector('.card-to-convert');
        const inputElement = document.getElementById('card-image-description');
        const resultArea = document.getElementById('card-image-result');

        // 前の回答を記録
        const previousValue = inputElement.value.trim();
        const previousCard = cardElement.dataset.currentCard;
        
        if (previousValue && previousCard) {
            this.cardImageHistory.push({
                card: previousCard,
                image: previousValue
            });
            
            resultArea.innerHTML = `
                <div class="practice-history">
                    <h4>練習履歴</h4>
                    ${this.cardImageHistory.slice(-5).map(item => 
                        `<div class="history-item">
                            <strong>${item.card}</strong> → ${item.image}
                        </div>`
                    ).join('')}
                    ${this.cardImageHistory.length > 5 ? '<div class="history-note">...他' + (this.cardImageHistory.length - 5) + '個</div>' : ''}
                </div>
            `;
            resultArea.className = 'result-area success';
        }

        // 新しいカードを表示
        const randomCard = this.cards[Math.floor(Math.random() * this.cards.length)];
        cardElement.innerHTML = this.createCardElement(randomCard, true);
        cardElement.className = `card-to-convert ${randomCard.color}`;
        cardElement.dataset.currentCard = `${randomCard.value}${randomCard.suit}`;
        
        inputElement.value = '';
        inputElement.focus();
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateScoreDisplay() {
        document.getElementById('correct-count').textContent = this.score.correct;
        document.getElementById('total-count').textContent = this.score.total;
        
        const accuracy = this.score.total > 0 ? 
            Math.round((this.score.correct / this.score.total) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryTrainer();
});