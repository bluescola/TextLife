// ============================================
// 文字人生 - Text Life Game Engine (重构版)
// ============================================
// 只保留核心框架，删除复杂随机系统

class TextLifeGame {
    constructor() {
        // 基础游戏状态
        this.character = null;
        this.gameState = 'menu'; // menu, playing, dead
        this.currentEvent = null;

        // 事件去重
        this.recentEvents = [];

        // DOM 元素
        this.outputEl = document.getElementById('output');
        this.choicesEl = document.getElementById('choices');
        this.ageEl = document.getElementById('age');
        this.healthEl = document.getElementById('health');
        this.intelligenceEl = document.getElementById('intelligence');
        this.luckEl = document.getElementById('luck');
        this.highscoreListEl = document.getElementById('highscore-list');

        this.init();
    }

    init() {
        this.loadHighscores();
        this.showStartScreen();
    }

    // ============================================
    // UI 显示方法
    // ============================================

    addMessage(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = `line ${type}`;
        line.textContent = text;
        this.outputEl.appendChild(line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    clearOutput() {
        this.outputEl.innerHTML = '';
    }

    clearChoices() {
        this.choicesEl.innerHTML = '';
    }

    updateStats() {
        this.ageEl.textContent = this.character.age;
        this.healthEl.textContent = this.character.attributes.health;
        this.intelligenceEl.textContent = this.character.attributes.intelligence;
        this.luckEl.textContent = this.character.attributes.luck;
    }

    // ============================================
    // 角色生成
    // ============================================

    generateCharacter() {
        const firstNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
        const maleNames = ['明', '强', '伟', '军', '磊', '勇', '杰', '鹏', '涛', '浩'];
        const femaleNames = ['娜', '敏', '静', '丽', '芳', '秀', '英', '华', '慧', '婷'];
        const lastNames = ['伟', '强', '明', '军', '杰', '峰', '磊', '勇', '涛', '浩',
                          '丽', '娜', '敏', '静', '芳', '秀', '英', '华', '慧', '婷',
                          '倩', '欣', '颖', '雪', '梅', '霞', '玲', '红', '艳', '云'];

        const gender = Math.random() > 0.5 ? '男' : '女';
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = firstName + lastName + (Math.random() > 0.7 ? lastNames[Math.floor(Math.random() * lastNames.length)] : '');

        const backgrounds = ['普通家庭', '富豪家庭', '单亲家庭', '孤儿', '军人家庭'];

        // 使用 config.js 的初始属性范围
        const stats = GameConfig.characterStats;

        this.character = {
            name: name,
            gender: gender,
            age: 0,
            background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
            isAlive: true,
            attributes: {
                health: this.random(stats.health.min, stats.health.max),
                intelligence: this.random(stats.intelligence.min, stats.intelligence.max),
                luck: this.random(stats.luck.min, stats.luck.max),
                charm: this.random(stats.charm.min, stats.charm.max)
            }
        };
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ============================================
    // 游戏流程
    // ============================================

    showStartScreen() {
        this.clearOutput();
        this.clearChoices();

        this.addMessage('█████████████████████████████████████████', 'system');
        this.addMessage('█                                       █', 'system');
        this.addMessage('█      欢迎来到【文字人生】游戏        █', 'system');
        this.addMessage('█                                       █', 'system');
        this.addMessage('█  在这个世界里，生活充满了意外...    █', 'system');
        this.addMessage('█  每个选择都可能改变你的命运         █', 'system');
        this.addMessage('█                                       █', 'system');
        this.addMessage('█████████████████████████████████████████', 'system');

        const startBtn = document.createElement('button');
        startBtn.className = 'start-button';
        startBtn.textContent = '█ 开始新人生 █';
        startBtn.onclick = () => this.startNewGame();
        this.choicesEl.appendChild(startBtn);

        this.displayHighscores();
    }

    startNewGame() {
        this.generateCharacter();
        this.gameState = 'playing';
        this.recentEvents = [];

        this.clearOutput();
        this.clearChoices();

        this.addMessage('═════════════════════════════════════', 'system');
        this.addMessage(`▸ 系统正在生成随机人生...`, 'system');

        setTimeout(() => {
            this.addMessage(`▸ 姓名: ${this.character.name}`, 'system');
            this.addMessage(`▸ 性别: ${this.character.gender}`, 'system');
            this.addMessage(`▸ 出生背景: ${this.character.background}`, 'system');
            this.addMessage(`▸ 初始健康: ${this.character.attributes.health}`, 'system');
            this.addMessage(`▸ 初始智力: ${this.character.attributes.intelligence}`, 'system');
            this.addMessage(`▸ 初始运气: ${this.character.attributes.luck}`, 'system');
            this.addMessage(`▸ 初始魅力: ${this.character.attributes.charm}`, 'system');
            this.addMessage('═════════════════════════════════════', 'system');
            this.addMessage('', 'system');
            this.addMessage('你的人生开始了...', 'event');
            this.addMessage('', 'system');

            this.updateStats();

            setTimeout(() => {
                this.triggerRandomEvent();
            }, 1000);
        }, 1000);
    }

    // ============================================
    // 事件触发（简化版）
    // ============================================

    triggerRandomEvent() {
        if (!this.character.isAlive) return;

        // TODO: 这里需要实现事件筛选逻辑
        // 暂时显示占位信息
        this.addMessage(`【${this.character.age}岁】`, 'system');
        this.addMessage('事件系统待实现...', 'event');

        // 临时：创建测试选项
        this.showTestChoices();
    }

    // 临时测试方法
    showTestChoices() {
        this.clearChoices();

        const choice1 = document.createElement('button');
        choice1.className = 'choice-button';
        choice1.textContent = '选择 A（存活）';
        choice1.onclick = () => this.makeTestChoice(true);
        this.choicesEl.appendChild(choice1);

        const choice2 = document.createElement('button');
        choice2.className = 'choice-button';
        choice2.textContent = '选择 B（死亡）';
        choice2.onclick = () => this.makeTestChoice(false);
        this.choicesEl.appendChild(choice2);
    }

    makeTestChoice(survived) {
        this.clearChoices();

        if (survived) {
            this.addMessage('你选择了 A，成功存活！', 'success');
            this.addMessage(`▸ health +5`, 'success');
            this.character.attributes.health += 5;

            // 使用 config.js 的年龄跳跃规则
            const ageJump = GameConfig.getAgeJump(this.character.age);
            this.character.age += ageJump;
            this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
            this.addMessage('', 'normal');

            this.updateStats();

            // 继续下一个事件
            setTimeout(() => {
                this.triggerRandomEvent();
            }, 1500);
        } else {
            this.addMessage('你选择了 B，不幸死亡。', 'death');
            this.addMessage('', 'death');
            this.addMessage(`▸ 死因: 测试死亡`, 'death');
            this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');

            this.character.isAlive = false;
            this.endGame();
        }
    }

    // ============================================
    // 游戏结束
    // ============================================

    endGame() {
        this.gameState = 'dead';
        this.saveHighscore();

        this.addMessage('═════════════════════════════════════', 'system');
        this.addMessage('游戏结束', 'death');
        this.addMessage('═════════════════════════════════════', 'system');

        const restartBtn = document.createElement('button');
        restartBtn.className = 'start-button';
        restartBtn.textContent = '█ 再来一次 █';
        restartBtn.onclick = () => this.startNewGame();
        this.choicesEl.appendChild(restartBtn);

        const menuBtn = document.createElement('button');
        menuBtn.className = 'start-button';
        menuBtn.textContent = '█ 返回主菜单 █';
        menuBtn.onclick = () => this.showStartScreen();
        this.choicesEl.appendChild(menuBtn);
    }

    // ============================================
    // 排行榜系统
    // ============================================

    saveHighscore() {
        const highscores = this.loadHighscores();

        const newScore = {
            name: this.character.name,
            age: this.character.age,
            date: new Date().toLocaleDateString()
        };

        highscores.push(newScore);
        highscores.sort((a, b) => b.age - a.age);
        highscores.splice(10);

        localStorage.setItem('textlife_highscores', JSON.stringify(highscores));
    }

    loadHighscores() {
        const saved = localStorage.getItem('textlife_highscores');
        return saved ? JSON.parse(saved) : [];
    }

    displayHighscores() {
        const highscores = this.loadHighscores();

        if (highscores.length === 0) {
            this.highscoreListEl.innerHTML = '<div class="line system">暂无记录</div>';
            return;
        }

        this.highscoreListEl.innerHTML = '';
        highscores.forEach((score, index) => {
            const line = document.createElement('div');
            line.className = 'line normal';
            line.textContent = `${index + 1}. ${score.name} - ${score.age}岁 (${score.date})`;
            this.highscoreListEl.appendChild(line);
        });
    }
}

// ============================================
// 初始化游戏
// ============================================

let game;
window.onload = () => {
    game = new TextLifeGame();
};
