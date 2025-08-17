class MemoryTrainer {
    constructor() {
        this.currentGame = 'number-sequence';
        this.score = this.loadScore() || {
            correct: 0,
            total: 0
        };
        this.gameStats = this.loadGameStats() || {
            'number-sequence': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
            'card-sequence': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
            'object-memory': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
            'word-memory': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
            'number-image': { practiceCount: 0, lastPracticeDate: null },
            'card-image': { practiceCount: 0, lastPracticeDate: null }
        };
        this.recentResults = this.loadRecentResults() || [];
        this.practiceDates = this.loadPracticeDates() || [];
        this.currentStreak = 0;
        this.timer = null;
        this.timeRemaining = 0;
        this.speechSynthesis = window.speechSynthesis;
        
        // ランダム数字表示用の変数
        this.randomDisplayTimer = null;
        this.displayCount = 0;
        this.conversionCount = 0;
        this.conversionHistory = this.loadConversionHistory() || [];
        
        // ランダムカード表示用の変数
        this.randomCardTimer = null;
        this.cardDisplayCount = 0;
        this.cardConversionCount = 0;
        this.cardConversionHistory = this.loadCardConversionHistory() || [];
        this.availableCards = [...this.cards];
        this.usedCards = [];
        this.difficultySettings = {
            beginner: { digits: 2, count: 3, timeLimit: 0 },
            intermediate: { digits: 3, count: 5, timeLimit: 60 },
            advanced: { digits: 4, count: 8, timeLimit: 45 },
            expert: { digits: 5, count: 10, timeLimit: 30 }
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

        this.wordLists = {
            animals: ['犬', '猫', '象', '虎', '鳥', '魚', '馬', '牛', '豚', '羊', '兎', '熊', '鹿', '狼', '狐'],
            foods: ['りんご', 'パン', '米', '肉', '魚', '野菜', '果物', 'チーズ', '卵', '牛乳', 'お茶', 'コーヒー', 'ケーキ', 'ラーメン', '寿司'],
            colors: ['赤', '青', '緑', '黄色', '紫', '白', '黒', 'オレンジ', 'ピンク', '茶色', '灰色', '金色', '銀色', '水色', '紺色'],
            countries: ['日本', 'アメリカ', 'イギリス', 'フランス', 'ドイツ', '中国', '韓国', 'インド', 'ブラジル', 'ロシア', 'カナダ', 'オーストラリア', 'イタリア', 'スペイン', 'タイ'],
            sports: ['野球', 'サッカー', 'テニス', 'バスケ', 'バレー', '水泳', '陸上', 'ゴルフ', '卓球', '柔道', '空手', 'ボクシング', 'スキー', 'ラグビー', 'アメフト']
        };

        this.initializeEventListeners();
        this.updateScoreDisplay();
    }

    initializeEventListeners() {
        // ナビゲーションボタンのイベントリスナー
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchGame(e.currentTarget.dataset.game);
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


        document.getElementById('reset-data').addEventListener('click', () => {
            this.resetAllData();
        });

        document.getElementById('difficulty-level').addEventListener('change', (e) => {
            this.handleDifficultyChange(e.target.value);
        });

        document.getElementById('start-word-game').addEventListener('click', () => {
            this.startWordGame();
        });

        document.getElementById('submit-words').addEventListener('click', () => {
            this.submitWordAnswer();
        });

        // ランダム数字表示のイベントリスナー
        document.getElementById('number-format').addEventListener('change', (e) => {
            this.handleNumberFormatChange(e.target.value);
        });

        document.getElementById('start-random-display').addEventListener('click', () => {
            this.startRandomDisplay();
        });

        document.getElementById('stop-random-display').addEventListener('click', () => {
            this.stopRandomDisplay();
        });

        document.getElementById('next-random-number').addEventListener('click', () => {
            this.generateNewRandomNumber();
        });

        document.getElementById('save-conversion').addEventListener('click', () => {
            this.saveImageConversion();
        });

        document.getElementById('image-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveImageConversion();
            }
        });

        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearConversionHistory();
        });

        // ランダムカード表示のイベントリスナー
        document.getElementById('start-random-cards').addEventListener('click', () => {
            this.startRandomCardDisplay();
        });

        document.getElementById('stop-random-cards').addEventListener('click', () => {
            this.stopRandomCardDisplay();
        });

        document.getElementById('next-random-cards').addEventListener('click', () => {
            this.generateNewRandomCards();
        });

        document.getElementById('reset-deck').addEventListener('click', () => {
            this.resetCardDeck();
        });

        document.getElementById('save-card-conversion').addEventListener('click', () => {
            this.saveCardImageConversion();
        });

        document.getElementById('card-image-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveCardImageConversion();
            }
        });

        document.getElementById('clear-card-history').addEventListener('click', () => {
            this.clearCardConversionHistory();
        });

    }

    switchGame(gameId) {
        // アクティブなナビゲーションボタンを更新
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-game="${gameId}"]`).classList.add('active');

        document.querySelectorAll('.game-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(gameId).classList.add('active');

        this.currentGame = gameId;
        this.resetCurrentGame();
        
        // 統計画面を表示する場合は統計情報を更新
        if (gameId === 'statistics') {
            this.updateStatisticsDisplay();
        }
        
        // ランダム数字画面を表示する場合は履歴を更新
        if (gameId === 'random-numbers') {
            this.updateConversionHistoryDisplay();
            this.updateRandomNumberStats();
        }
        
        // ランダムカード画面を表示する場合は履歴を更新
        if (gameId === 'random-cards') {
            this.updateCardConversionHistoryDisplay();
            this.updateRandomCardStats();
        }
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
        const timeLimit = parseInt(document.getElementById('number-time-limit').value);
        const displayArea = document.getElementById('number-display');
        const inputArea = document.getElementById('number-input-area');
        const resultArea = document.getElementById('number-result');

        resultArea.innerHTML = '';
        resultArea.className = 'result-area';
        inputArea.style.display = 'none';
        this.stopTimer();

        const sequence = this.generateNumberSequence(digits, count);
        this.currentSequence = sequence;

        displayArea.innerHTML = '<p>数字を覚えてください...</p>';
        this.speakWithDelay('数字を覚えてください', 200);

        for (let i = 0; i < sequence.length; i++) {
            await this.sleep(500);
            displayArea.innerHTML = `<div class="highlight-number">${sequence[i]}</div>`;
            this.speakWithDelay(sequence[i], 100);
            await this.sleep(1000);
        }

        displayArea.innerHTML = '<p>覚えた数字を順番通りに入力してください（スペース区切り）</p>';
        inputArea.style.display = 'block';
        document.getElementById('number-answer').value = '';
        document.getElementById('number-answer').focus();

        // タイマー開始
        if (timeLimit > 0) {
            this.startTimer(timeLimit, () => {
                this.submitNumberAnswer(true); // 時間切れフラグ
            });
        }
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

    submitNumberAnswer(isTimeUp = false) {
        this.stopTimer(); // タイマーを停止
        
        const answer = document.getElementById('number-answer').value.trim();
        const userAnswers = answer.split(/\s+/);
        const correct = this.currentSequence;
        const resultArea = document.getElementById('number-result');

        this.score.total++;

        const isCorrect = userAnswers.length === correct.length && 
                         userAnswers.every((ans, index) => ans === correct[index]);

        if (isTimeUp) {
            resultArea.innerHTML = `時間切れです。正解は「${correct.join(' ')}」でした。<br>あなたの回答：「${answer}」`;
            resultArea.className = 'result-area error';
            this.speak('時間切れです');
        } else if (isCorrect) {
            this.score.correct++;
            resultArea.innerHTML = '正解です！素晴らしい記憶力ですね。';
            resultArea.className = 'result-area success';
            this.speak('正解です！素晴らしい記憶力ですね');
        } else {
            resultArea.innerHTML = `不正解です。正解は「${correct.join(' ')}」でした。<br>あなたの回答：「${answer}」`;
            resultArea.className = 'result-area error';
            this.speak('不正解です');
        }

        this.updateGameStats('number-sequence', isCorrect && !isTimeUp);
        this.addRecentResult(isCorrect && !isTimeUp);
        this.addPracticeDate();
        this.saveScore();
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

        this.updateGameStats('card-sequence', isCorrect);
        this.addRecentResult(isCorrect);
        this.addPracticeDate();
        this.saveScore();
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

    async startWordGame() {
        const category = document.getElementById('word-category').value;
        const wordCount = parseInt(document.getElementById('word-count').value);
        const displayTime = parseInt(document.getElementById('word-display-time').value);
        const displayArea = document.getElementById('word-display');
        const inputArea = document.getElementById('word-input-area');
        const resultArea = document.getElementById('word-result');

        resultArea.innerHTML = '';
        resultArea.className = 'result-area';
        inputArea.style.display = 'none';

        const words = this.getRandomWords(category, wordCount);
        this.currentWords = words;

        displayArea.innerHTML = '<p>単語を覚えてください...</p>';
        this.speakWithDelay('単語を覚えてください', 200);

        for (let i = 0; i < words.length; i++) {
            await this.sleep(500);
            displayArea.innerHTML = `
                <div class="word-display">
                    <div class="word-number">${i + 1}番目</div>
                    <div class="highlight-word">${words[i]}</div>
                </div>
            `;
            this.speakWithDelay(words[i], 100);
            await this.sleep(displayTime);
        }

        displayArea.innerHTML = '<p>覚えた単語を順番通りに入力してください（改行区切り）</p>';
        inputArea.style.display = 'block';
        document.getElementById('word-answer').value = '';
        document.getElementById('word-answer').focus();
    }

    getRandomWords(category, count) {
        let sourceWords = [];
        
        if (category === 'mixed') {
            // ミックスの場合は全カテゴリから選択
            Object.values(this.wordLists).forEach(wordList => {
                sourceWords = sourceWords.concat(wordList);
            });
        } else {
            sourceWords = this.wordLists[category] || [];
        }

        const shuffled = this.shuffleArray([...sourceWords]);
        return shuffled.slice(0, count);
    }

    submitWordAnswer() {
        const answer = document.getElementById('word-answer').value.trim();
        const userWords = answer.split('\n').map(word => word.trim()).filter(word => word);
        const correct = this.currentWords;
        const resultArea = document.getElementById('word-result');

        this.score.total++;

        // 順番と内容の両方が正確かどうかをチェック
        const isCorrect = userWords.length === correct.length && 
                         userWords.every((word, index) => word === correct[index]);

        // 部分正解の計算
        const correctCount = userWords.filter((word, index) => word === correct[index]).length;
        const partialScore = Math.round((correctCount / correct.length) * 100);

        if (isCorrect) {
            this.score.correct++;
            resultArea.innerHTML = '完璧です！すべての単語を正確に覚えられました。';
            resultArea.className = 'result-area success';
            this.speak('完璧です');
        } else {
            const correctList = correct.join('、');
            const userList = userWords.join('、');
            resultArea.innerHTML = `
                <p>部分正解率: ${partialScore}%</p>
                <p><strong>正解:</strong> ${correctList}</p>
                <p><strong>あなたの回答:</strong> ${userList}</p>
            `;
            resultArea.className = 'result-area error';
            this.speak(`部分正解率${partialScore}パーセント`);
        }

        this.updateGameStats('word-memory', isCorrect);
        this.addRecentResult(isCorrect);
        this.addPracticeDate();
        this.saveScore();
        this.updateScoreDisplay();
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

        this.updateGameStats('object-memory', isCorrectSequence);
        this.addRecentResult(isCorrectSequence);
        this.addPracticeDate();
        this.saveScore();
        this.updateScoreDisplay();
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

    startTimer(seconds, onTimeUp) {
        if (seconds <= 0) return;
        
        this.timeRemaining = seconds;
        const timerDisplay = document.getElementById('timer-display');
        const timerSeconds = document.getElementById('timer-seconds');
        
        timerDisplay.style.display = 'block';
        timerSeconds.textContent = this.timeRemaining;
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            timerSeconds.textContent = this.timeRemaining;
            
            // 残り10秒で警告色に変更
            if (this.timeRemaining <= 10) {
                timerDisplay.classList.add('timer-warning');
            }
            
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                if (onTimeUp) onTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.style.display = 'none';
        timerDisplay.classList.remove('timer-warning');
    }

    speak(text, rate = 1) {
        if (!this.speechSynthesis || !document.getElementById('voice-enabled').checked) {
            return;
        }

        // 既存の音声を停止
        this.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        this.speechSynthesis.speak(utterance);
    }

    async speakWithDelay(text, delay = 100) {
        if (!this.speechSynthesis || !document.getElementById('voice-enabled').checked) {
            return;
        }

        await this.sleep(delay);
        this.speak(text);
    }

    handleDifficultyChange(level) {
        const customSettings = document.getElementById('custom-settings');
        
        if (level === 'custom') {
            customSettings.style.display = 'block';
        } else {
            customSettings.style.display = 'none';
            this.applyDifficultySettings(level);
        }
    }

    applyDifficultySettings(level) {
        const settings = this.difficultySettings[level];
        if (!settings) return;

        document.getElementById('number-digits').value = settings.digits;
        document.getElementById('number-count').value = settings.count;
        document.getElementById('number-time-limit').value = settings.timeLimit;
    }

    getDifficultyRecommendation() {
        const overallAccuracy = this.score.total > 0 ? (this.score.correct / this.score.total) * 100 : 0;
        const bestStreak = Math.max(...Object.values(this.gameStats).map(stat => stat.bestStreak || 0));
        
        if (overallAccuracy >= 90 && bestStreak >= 15) {
            return 'expert';
        } else if (overallAccuracy >= 80 && bestStreak >= 10) {
            return 'advanced';
        } else if (overallAccuracy >= 70 && bestStreak >= 5) {
            return 'intermediate';
        } else {
            return 'beginner';
        }
    }

    updateScoreDisplay() {
        document.getElementById('correct-count').textContent = this.score.correct;
        document.getElementById('total-count').textContent = this.score.total;
        
        const accuracy = this.score.total > 0 ? 
            Math.round((this.score.correct / this.score.total) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        // 連続正解表示
        document.getElementById('current-streak').textContent = this.currentStreak;
        const bestStreak = Math.max(...Object.values(this.gameStats).map(stat => stat.bestStreak || 0));
        document.getElementById('best-streak').textContent = bestStreak;
        
        // ヘッダーの統計表示も更新
        const headerAccuracy = document.getElementById('header-accuracy');
        const headerStreak = document.getElementById('header-streak');
        if (headerAccuracy) headerAccuracy.textContent = `${accuracy}%`;
        if (headerStreak) headerStreak.textContent = this.currentStreak;
    }

    // ローカルストレージ関連メソッド
    saveScore() {
        localStorage.setItem('memoryTrainerScore', JSON.stringify(this.score));
    }

    loadScore() {
        const saved = localStorage.getItem('memoryTrainerScore');
        return saved ? JSON.parse(saved) : null;
    }

    saveGameStats() {
        localStorage.setItem('memoryTrainerGameStats', JSON.stringify(this.gameStats));
    }

    loadGameStats() {
        const saved = localStorage.getItem('memoryTrainerGameStats');
        return saved ? JSON.parse(saved) : null;
    }

    updateGameStats(gameType, isCorrect) {
        const stats = this.gameStats[gameType];
        stats.total++;
        
        if (isCorrect) {
            stats.correct++;
            stats.streak++;
            this.currentStreak++;
            if (stats.streak > stats.bestStreak) {
                stats.bestStreak = stats.streak;
            }
        } else {
            stats.streak = 0;
            this.currentStreak = 0;
        }
        
        this.saveGameStats();
    }

    loadRecentResults() {
        const saved = localStorage.getItem('memoryTrainerRecentResults');
        return saved ? JSON.parse(saved) : null;
    }

    saveRecentResults() {
        localStorage.setItem('memoryTrainerRecentResults', JSON.stringify(this.recentResults));
    }

    loadPracticeDates() {
        const saved = localStorage.getItem('memoryTrainerPracticeDates');
        return saved ? JSON.parse(saved) : null;
    }

    savePracticeDates() {
        localStorage.setItem('memoryTrainerPracticeDates', JSON.stringify(this.practiceDates));
    }

    addRecentResult(isCorrect) {
        this.recentResults.push(isCorrect);
        if (this.recentResults.length > 20) {
            this.recentResults.shift();
        }
        this.saveRecentResults();
    }

    addPracticeDate() {
        const today = new Date().toDateString();
        if (!this.practiceDates.includes(today)) {
            this.practiceDates.push(today);
            this.savePracticeDates();
        }
    }

    updateStatisticsDisplay() {
        // 全体統計
        document.getElementById('total-games').textContent = this.score.total;
        const overallAccuracy = this.score.total > 0 ? Math.round((this.score.correct / this.score.total) * 100) : 0;
        document.getElementById('overall-accuracy').textContent = `${overallAccuracy}%`;
        
        const bestStreak = Math.max(...Object.values(this.gameStats).map(stat => stat.bestStreak || 0));
        document.getElementById('total-streak').textContent = bestStreak;
        document.getElementById('practice-days').textContent = this.practiceDates.length;

        // ゲーム別統計
        const gameTypes = ['number-sequence', 'card-sequence', 'object-memory', 'word-memory'];
        const gameNames = ['number', 'card', 'object', 'word'];
        
        gameTypes.forEach((gameType, index) => {
            const stats = this.gameStats[gameType];
            const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const name = gameNames[index];
            
            document.getElementById(`${name}-accuracy`).textContent = `${accuracy}%`;
            document.getElementById(`${name}-correct`).textContent = stats.correct;
            document.getElementById(`${name}-total`).textContent = stats.total;
            document.getElementById(`${name}-streak`).textContent = stats.bestStreak;
        });

        // レベル評価
        this.updateLevelAssessment();
        
        // 簡易グラフ
        this.updateAccuracyChart();
    }

    updateLevelAssessment() {
        const totalCorrect = this.score.correct;
        const overallAccuracy = this.score.total > 0 ? (this.score.correct / this.score.total) * 100 : 0;
        const bestStreak = Math.max(...Object.values(this.gameStats).map(stat => stat.bestStreak || 0));
        
        let level = '初心者';
        let description = 'まずは基本的な記憶術を練習しましょう';
        let progress = 0;

        if (totalCorrect >= 100 && overallAccuracy >= 90 && bestStreak >= 20) {
            level = '記憶の達人';
            description = '素晴らしい記憶力です！';
            progress = 100;
        } else if (totalCorrect >= 50 && overallAccuracy >= 80 && bestStreak >= 15) {
            level = '上級者';
            description = '非常に優秀な記憶力をお持ちです';
            progress = 80;
        } else if (totalCorrect >= 25 && overallAccuracy >= 70 && bestStreak >= 10) {
            level = '中級者';
            description = '着実に記憶力が向上しています';
            progress = 60;
        } else if (totalCorrect >= 10 && overallAccuracy >= 60 && bestStreak >= 5) {
            level = '初級者';
            description = '基本的な記憶術が身についてきました';
            progress = 40;
        } else if (totalCorrect >= 5) {
            level = '練習中';
            description = '継続して練習を続けましょう';
            progress = 20;
        }

        document.getElementById('current-level').textContent = level;
        document.getElementById('level-description').textContent = description;
        document.getElementById('level-progress').style.width = `${progress}%`;
    }

    updateAccuracyChart() {
        const chartContainer = document.getElementById('accuracy-chart');
        
        if (this.recentResults.length === 0) {
            chartContainer.innerHTML = '<div class="chart-placeholder">データが蓄積されると表示されます</div>';
            return;
        }

        // 5問ずつのグループに分けて正解率を計算
        const groups = [];
        const groupSize = 5;
        
        for (let i = 0; i < this.recentResults.length; i += groupSize) {
            const group = this.recentResults.slice(i, i + groupSize);
            const accuracy = group.filter(result => result).length / group.length * 100;
            groups.push(accuracy);
        }

        const chartHTML = `
            <div class="simple-chart">
                ${groups.map(accuracy => 
                    `<div class="chart-bar" style="height: ${accuracy * 1.5}px" title="${Math.round(accuracy)}%"></div>`
                ).join('')}
            </div>
        `;
        
        chartContainer.innerHTML = chartHTML;
    }

    resetAllData() {
        if (confirm('すべてのデータをリセットしますか？この操作は取り消せません。')) {
            localStorage.removeItem('memoryTrainerScore');
            localStorage.removeItem('memoryTrainerGameStats');
            localStorage.removeItem('memoryTrainerRecentResults');
            localStorage.removeItem('memoryTrainerPracticeDates');
            
            this.score = { correct: 0, total: 0 };
            this.gameStats = {
                'number-sequence': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
                'card-sequence': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
                'object-memory': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
                'word-memory': { correct: 0, total: 0, streak: 0, bestStreak: 0 },
                'number-image': { practiceCount: 0, lastPracticeDate: null },
                'card-image': { practiceCount: 0, lastPracticeDate: null }
            };
            this.recentResults = [];
            this.practiceDates = [];
            this.currentStreak = 0;
            
            this.updateScoreDisplay();
            this.updateStatisticsDisplay();
            alert('データがリセットされました。');
        }
    }

    // ランダム数字表示機能
    handleNumberFormatChange(format) {
        const customDigits = document.getElementById('custom-digits');
        if (format === 'custom') {
            customDigits.style.display = 'block';
        } else {
            customDigits.style.display = 'none';
        }
    }

    startRandomDisplay() {
        const displaySpeed = document.getElementById('display-speed').value;
        const startBtn = document.getElementById('start-random-display');
        const stopBtn = document.getElementById('stop-random-display');
        const nextBtn = document.getElementById('next-random-number');

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';

        if (displaySpeed === 'manual') {
            nextBtn.style.display = 'inline-block';
            this.generateNewRandomNumber();
        } else {
            nextBtn.style.display = 'none';
            this.startAutoRandomDisplay(displaySpeed);
        }
    }

    stopRandomDisplay() {
        const startBtn = document.getElementById('start-random-display');
        const stopBtn = document.getElementById('stop-random-display');
        const nextBtn = document.getElementById('next-random-number');

        if (this.randomDisplayTimer) {
            clearInterval(this.randomDisplayTimer);
            this.randomDisplayTimer = null;
        }

        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    startAutoRandomDisplay(speed) {
        const intervals = {
            'slow': 3000,
            'medium': 2000,
            'fast': 1000
        };

        this.generateNewRandomNumber();
        
        this.randomDisplayTimer = setInterval(() => {
            this.generateNewRandomNumber();
        }, intervals[speed]);
    }

    generateNewRandomNumber() {
        const format = document.getElementById('number-format').value;
        let number;

        switch (format) {
            case 'single':
                number = Math.floor(Math.random() * 10).toString();
                break;
            case 'double':
                number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                break;
            case 'triple':
                number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                break;
            case 'custom':
                const digits = parseInt(document.getElementById('custom-digit-count').value);
                const max = Math.pow(10, digits);
                number = Math.floor(Math.random() * max).toString().padStart(digits, '0');
                break;
            default:
                number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        }

        document.getElementById('current-random-number').textContent = number;
        document.getElementById('image-input').value = '';
        
        this.displayCount++;
        this.updateRandomNumberStats();

        // アニメーション効果
        const numberElement = document.getElementById('current-random-number');
        numberElement.style.animation = 'none';
        setTimeout(() => {
            numberElement.style.animation = 'highlight 0.5s ease-in-out';
        }, 10);
    }

    saveImageConversion() {
        const number = document.getElementById('current-random-number').textContent;
        const image = document.getElementById('image-input').value.trim();

        if (number === '--' || !image) {
            alert('数字とイメージを入力してください。');
            return;
        }

        const conversion = {
            number: number,
            image: image,
            timestamp: new Date().toLocaleString('ja-JP')
        };

        this.conversionHistory.unshift(conversion);
        if (this.conversionHistory.length > 50) {
            this.conversionHistory.pop();
        }

        this.conversionCount++;
        this.saveConversionHistory();
        this.updateConversionHistoryDisplay();
        this.updateRandomNumberStats();

        document.getElementById('image-input').value = '';
        
        // 成功メッセージ
        const saveBtn = document.getElementById('save-conversion');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '保存済み！';
        saveBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 1500);
    }

    updateRandomNumberStats() {
        document.getElementById('display-count').textContent = this.displayCount;
        document.getElementById('conversion-count').textContent = this.conversionCount;
    }

    updateConversionHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        const clearBtn = document.getElementById('clear-history');

        if (this.conversionHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history">まだ履歴がありません</p>';
            clearBtn.style.display = 'none';
        } else {
            const historyHTML = this.conversionHistory.map(item => `
                <div class="history-item">
                    <div class="history-number">${item.number}</div>
                    <div class="history-image">${item.image}</div>
                    <div class="history-timestamp">${item.timestamp}</div>
                </div>
            `).join('');
            
            historyList.innerHTML = historyHTML;
            clearBtn.style.display = 'inline-block';
        }
    }

    clearConversionHistory() {
        if (confirm('変換履歴をすべて削除しますか？')) {
            this.conversionHistory = [];
            this.conversionCount = 0;
            this.saveConversionHistory();
            this.updateConversionHistoryDisplay();
            this.updateRandomNumberStats();
        }
    }

    saveConversionHistory() {
        localStorage.setItem('memoryTrainerConversionHistory', JSON.stringify(this.conversionHistory));
        localStorage.setItem('memoryTrainerConversionCount', this.conversionCount.toString());
        localStorage.setItem('memoryTrainerDisplayCount', this.displayCount.toString());
    }

    loadConversionHistory() {
        const history = localStorage.getItem('memoryTrainerConversionHistory');
        const conversionCount = localStorage.getItem('memoryTrainerConversionCount');
        const displayCount = localStorage.getItem('memoryTrainerDisplayCount');
        
        if (conversionCount) this.conversionCount = parseInt(conversionCount);
        if (displayCount) this.displayCount = parseInt(displayCount);
        
        return history ? JSON.parse(history) : null;
    }

    // ランダムカード表示機能
    startRandomCardDisplay() {
        const displaySpeed = document.getElementById('card-display-speed').value;
        const startBtn = document.getElementById('start-random-cards');
        const stopBtn = document.getElementById('stop-random-cards');
        const nextBtn = document.getElementById('next-random-cards');
        const resetBtn = document.getElementById('reset-deck');

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block';

        if (displaySpeed === 'manual') {
            nextBtn.style.display = 'inline-block';
            this.generateNewRandomCards();
        } else {
            nextBtn.style.display = 'none';
            this.startAutoRandomCardDisplay(displaySpeed);
        }
    }

    stopRandomCardDisplay() {
        const startBtn = document.getElementById('start-random-cards');
        const stopBtn = document.getElementById('stop-random-cards');
        const nextBtn = document.getElementById('next-random-cards');

        if (this.randomCardTimer) {
            clearInterval(this.randomCardTimer);
            this.randomCardTimer = null;
        }

        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    startAutoRandomCardDisplay(speed) {
        const intervals = {
            'slow': 4000,
            'medium': 3000,
            'fast': 2000
        };

        this.generateNewRandomCards();
        
        this.randomCardTimer = setInterval(() => {
            this.generateNewRandomCards();
        }, intervals[speed]);
    }

    generateNewRandomCards() {
        const cardCount = parseInt(document.getElementById('random-card-count').value);
        const excludeUsed = document.getElementById('exclude-used-cards').checked;
        
        let cardsToUse = excludeUsed ? this.availableCards : this.cards;
        
        if (excludeUsed && this.availableCards.length < cardCount) {
            // 残りカードが不足している場合の処理
            this.resetCardDeck();
            cardsToUse = this.availableCards;
        }

        const selectedCards = this.getRandomCardsFromDeck(cardsToUse, cardCount);
        
        if (excludeUsed) {
            // 使用済みカードをリストに移動
            selectedCards.forEach(card => {
                const index = this.availableCards.findIndex(c => 
                    c.value === card.value && c.suit === card.suit
                );
                if (index !== -1) {
                    this.availableCards.splice(index, 1);
                    this.usedCards.push(card);
                }
            });
        }

        this.displayRandomCards(selectedCards);
        this.cardDisplayCount++;
        this.updateRandomCardStats();

        document.getElementById('card-image-input').value = '';
    }

    getRandomCardsFromDeck(deck, count) {
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    displayRandomCards(cards) {
        const container = document.getElementById('current-random-cards');
        
        const cardsHTML = cards.map(card => this.createCardElement(card, true)).join('');
        container.innerHTML = `<div class="random-cards-grid">${cardsHTML}</div>`;

        // アニメーション効果
        const cardElements = container.querySelectorAll('.card');
        cardElements.forEach((cardEl, index) => {
            cardEl.style.opacity = '0';
            cardEl.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => {
                cardEl.style.transition = 'all 0.5s ease';
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'scale(1) translateY(0)';
            }, index * 100);
        });
    }

    resetCardDeck() {
        this.availableCards = [...this.cards];
        this.usedCards = [];
        this.updateRandomCardStats();
        
        // 成功メッセージ
        const resetBtn = document.getElementById('reset-deck');
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'リセット完了！';
        resetBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = '';
        }, 1500);
    }

    saveCardImageConversion() {
        const container = document.getElementById('current-random-cards');
        const cardElements = container.querySelectorAll('.card');
        
        if (cardElements.length === 0) {
            alert('カードが表示されていません。');
            return;
        }

        const image = document.getElementById('card-image-input').value.trim();
        if (!image) {
            alert('イメージを入力してください。');
            return;
        }

        // 表示されているカードの情報を取得
        const cardInfo = Array.from(cardElements).map(cardEl => {
            const valueEl = cardEl.querySelector('.card-value');
            const suitEl = cardEl.querySelector('.card-suit');
            return `${valueEl.textContent}${suitEl.textContent}`;
        }).join(', ');

        const conversion = {
            cards: cardInfo,
            image: image,
            timestamp: new Date().toLocaleString('ja-JP')
        };

        this.cardConversionHistory.unshift(conversion);
        if (this.cardConversionHistory.length > 50) {
            this.cardConversionHistory.pop();
        }

        this.cardConversionCount++;
        this.saveCardConversionHistory();
        this.updateCardConversionHistoryDisplay();
        this.updateRandomCardStats();

        document.getElementById('card-image-input').value = '';
        
        // 成功メッセージ
        const saveBtn = document.getElementById('save-card-conversion');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '保存済み！';
        saveBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 1500);
    }

    updateRandomCardStats() {
        document.getElementById('cards-display-count').textContent = this.cardDisplayCount;
        document.getElementById('cards-conversion-count').textContent = this.cardConversionCount;
        document.getElementById('remaining-cards').textContent = this.availableCards.length;
    }

    updateCardConversionHistoryDisplay() {
        const historyList = document.getElementById('card-history-list');
        const clearBtn = document.getElementById('clear-card-history');

        if (this.cardConversionHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history">まだ履歴がありません</p>';
            clearBtn.style.display = 'none';
        } else {
            const historyHTML = this.cardConversionHistory.map(item => `
                <div class="history-item">
                    <div class="history-cards">${item.cards}</div>
                    <div class="history-image">${item.image}</div>
                    <div class="history-timestamp">${item.timestamp}</div>
                </div>
            `).join('');
            
            historyList.innerHTML = historyHTML;
            clearBtn.style.display = 'inline-block';
        }
    }

    clearCardConversionHistory() {
        if (confirm('カード変換履歴をすべて削除しますか？')) {
            this.cardConversionHistory = [];
            this.cardConversionCount = 0;
            this.saveCardConversionHistory();
            this.updateCardConversionHistoryDisplay();
            this.updateRandomCardStats();
        }
    }

    saveCardConversionHistory() {
        localStorage.setItem('memoryTrainerCardConversionHistory', JSON.stringify(this.cardConversionHistory));
        localStorage.setItem('memoryTrainerCardConversionCount', this.cardConversionCount.toString());
        localStorage.setItem('memoryTrainerCardDisplayCount', this.cardDisplayCount.toString());
    }

    loadCardConversionHistory() {
        const history = localStorage.getItem('memoryTrainerCardConversionHistory');
        const conversionCount = localStorage.getItem('memoryTrainerCardConversionCount');
        const displayCount = localStorage.getItem('memoryTrainerCardDisplayCount');
        
        if (conversionCount) this.cardConversionCount = parseInt(conversionCount);
        if (displayCount) this.cardDisplayCount = parseInt(displayCount);
        
        return history ? JSON.parse(history) : null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryTrainer();
});