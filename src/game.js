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

        // 生活状态追踪 (v2.0简化版)
        this.lifeState = {
            partner: {
                hasPartner: false,      // 是否有伴侣(结婚/同居/长期恋爱都算)
                partnerSince: null      // 有伴侣的起始年龄
            },
            children: {
                hasChild: false,        // 是否有孩子(亲生/领养/继子女都算)
                childJoinAge: null,     // 孩子加入家庭时玩家年龄
                childLeftHome: false    // 孩子是否离家/独立
            }
        };

        // 事件去重 (分别记录选择事件和旁白事件)
        this.recentChoiceEvents = [];     // 最近5个选择事件
        this.recentNarrativeEvents = [];  // 最近7个旁白事件

        // 属性名称中文映射
        this.attrNameMap = {
            health: '健康',
            intelligence: '智力',
            luck: '运气',
            charm: '魅力'
        };

        // DOM 元素
        this.outputEl = document.getElementById('output');
        this.choicesEl = document.getElementById('choices');
        this.ageEl = document.getElementById('age');
        this.healthEl = document.getElementById('health');
        this.intelligenceEl = document.getElementById('intelligence');
        this.luckEl = document.getElementById('luck');
        this.charmEl = document.getElementById('charm');
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
        this.ageEl.textContent = `年龄: ${this.character.age}`;
        this.healthEl.textContent = `健康: ${this.character.attributes.health}`;
        this.intelligenceEl.textContent = `智力: ${this.character.attributes.intelligence}`;
        this.luckEl.textContent = `运气: ${this.character.attributes.luck}`;
        this.charmEl.textContent = `魅力: ${this.character.attributes.charm}`;
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
        this.recentChoiceEvents = [];
        this.recentNarrativeEvents = [];

        // 重置生活状态
        this.lifeState = {
            partner: {
                hasPartner: false,
                partnerSince: null
            },
            children: {
                hasChild: false,
                childJoinAge: null,
                childLeftHome: false
            }
        };

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
    // 事件筛选系统
    // ============================================

    // 检查事件前置条件 (v2.0)
    canTriggerEvent(event) {
        if (!event.prerequisites) return true;

        const prereq = event.prerequisites;

        // 检查伴侣状态
        if (prereq.hasPartner !== undefined) {
            if (prereq.hasPartner !== this.lifeState.partner.hasPartner) {
                return false;
            }
        }

        // 检查有伴侣年数
        if (prereq.partnerYears !== undefined) {
            if (!this.lifeState.partner.hasPartner) return false;
            const yearsWithPartner = this.character.age - this.lifeState.partner.partnerSince;
            if (prereq.partnerYears.min && yearsWithPartner < prereq.partnerYears.min) {
                return false;
            }
            if (prereq.partnerYears.max && yearsWithPartner > prereq.partnerYears.max) {
                return false;
            }
        }

        // 检查孩子状态
        if (prereq.hasChild !== undefined) {
            if (prereq.hasChild !== this.lifeState.children.hasChild) {
                return false;
            }
        }

        // 检查孩子年龄范围
        if (prereq.childAgeRange !== undefined) {
            if (!this.lifeState.children.hasChild) return false;
            const childAge = this.character.age - this.lifeState.children.childJoinAge;
            const [minAge, maxAge] = prereq.childAgeRange;
            if (childAge < minAge || childAge > maxAge) {
                return false;
            }
        }

        // 检查孩子最小年龄
        if (prereq.childAge !== undefined) {
            if (!this.lifeState.children.hasChild) return false;
            const childAge = this.character.age - this.lifeState.children.childJoinAge;
            if (prereq.childAge.min && childAge < prereq.childAge.min) {
                return false;
            }
            if (prereq.childAge.max && childAge > prereq.childAge.max) {
                return false;
            }
        }

        // 检查孩子未离家
        if (prereq.NOT_childLeftHome !== undefined) {
            if (prereq.NOT_childLeftHome && this.lifeState.children.childLeftHome) {
                return false;
            }
        }

        // 检查玩家年龄限制
        if (prereq.age !== undefined) {
            if (prereq.age.min && this.character.age < prereq.age.min) {
                return false;
            }
            if (prereq.age.max && this.character.age > prereq.age.max) {
                return false;
            }
        }

        return true;
    }

    // 根据年龄段筛选事件
    filterEventsByAge(events, ageGroup) {
        return events.filter(event => event.ageGroup === ageGroup);
    }

    // 事件去重筛选
    filterEventsByDeduplication(events, isNarrative) {
        const recentList = isNarrative ? this.recentNarrativeEvents : this.recentChoiceEvents;
        return events.filter(event => !recentList.includes(event.id));
    }

    // 计算事件权重（基于吸引力和属性影响）
    calculateEventWeight(event) {
        // 基础权重（根据吸引力）
        const baseWeight = GameConfig.eventSystem.attractivenessWeight[event.attractiveness] || 5;

        // 属性影响（轻度影响，最大±30%）
        let attributeBonus = 0;
        if (GameConfig.eventSystem.attributeInfluence.enabled) {
            const mapping = GameConfig.eventSystem.attributeInfluence.mapping;
            const attrName = mapping[event.category];

            if (attrName && this.character.attributes[attrName] !== undefined) {
                const attrValue = this.character.attributes[attrName];
                // 基准值10（初始值中位数），范围0-100
                // 影响范围：-30%到+30%
                attributeBonus = ((attrValue - 10) / 90) * GameConfig.eventSystem.attributeInfluence.maxBonus;
            }
        }

        // 年龄段内容分类权重加成
        const ageGroup = GameConfig.getAgeGroup(this.character.age);
        const categoryWeights = GameConfig.eventSystem.categoryWeightByAge[ageGroup];
        const categoryMultiplier = (categoryWeights && categoryWeights[event.category]) || 1.0;

        // 最终权重 = 基础权重 × (1 + 属性加成) × 类别倍数
        const finalWeight = baseWeight * (1 + attributeBonus) * categoryMultiplier;

        return Math.max(0.1, finalWeight); // 确保权重至少为0.1
    }

    // 加权随机选择事件
    selectEventByWeight(events) {
        if (events.length === 0) return null;
        if (events.length === 1) return events[0];

        // 计算所有事件的权重
        const weights = events.map(event => this.calculateEventWeight(event));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        // 加权随机
        let random = Math.random() * totalWeight;
        for (let i = 0; i < events.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return events[i];
            }
        }

        return events[events.length - 1];
    }

    // 选择一个事件（整合所有筛选逻辑）
    selectEvent(isNarrative) {
        const ageGroup = GameConfig.getAgeGroup(this.character.age);
        const allEvents = isNarrative ? GameEvents.narrativeEvents : GameEvents.choiceEvents;

        // 第一步：按年龄段筛选
        let candidates = this.filterEventsByAge(allEvents, ageGroup);

        // 如果当前年龄段没有事件，尝试相邻年龄段
        if (candidates.length === 0) {
            console.warn(`年龄段 ${ageGroup} 没有${isNarrative ? '旁白' : '选择'}事件，尝试其他年龄段`);
            candidates = allEvents;
        }

        // 第二步：前置条件筛选 (v2.0新增)
        const beforePrereqCount = candidates.length;
        candidates = candidates.filter(event => this.canTriggerEvent(event));
        if (beforePrereqCount > candidates.length) {
            console.log(`[状态系统] 前置条件筛选: ${beforePrereqCount} → ${candidates.length} (过滤了${beforePrereqCount - candidates.length}个)`);
        }

        // 第三步：去重筛选
        candidates = this.filterEventsByDeduplication(candidates, isNarrative);

        // 如果去重后没有候选事件，清空去重列表重新筛选
        if (candidates.length === 0) {
            console.warn(`去重后没有可用事件，清空去重列表`);
            if (isNarrative) {
                this.recentNarrativeEvents = [];
            } else {
                this.recentChoiceEvents = [];
            }
            candidates = this.filterEventsByAge(allEvents, ageGroup);
            // 重新应用前置条件筛选
            candidates = candidates.filter(event => this.canTriggerEvent(event));
            if (candidates.length === 0) candidates = allEvents.filter(event => this.canTriggerEvent(event));
        }

        // 第四步：加权随机选择
        return this.selectEventByWeight(candidates);
    }

    // 记录事件到去重列表
    recordEvent(eventId, isNarrative) {
        if (isNarrative) {
            this.recentNarrativeEvents.push(eventId);
            if (this.recentNarrativeEvents.length > GameConfig.eventSystem.deduplication.narrativeEvents) {
                this.recentNarrativeEvents.shift();
            }
        } else {
            this.recentChoiceEvents.push(eventId);
            if (this.recentChoiceEvents.length > GameConfig.eventSystem.deduplication.choiceEvents) {
                this.recentChoiceEvents.shift();
            }
        }
    }

    // ============================================
    // 事件触发（基于框架设计）
    // ============================================

    triggerRandomEvent() {
        if (!this.character.isAlive) return;

        // 判断是触发旁白事件还是选择事件
        const narrativeChance = GameConfig.getNarrativeChance(this.character.age);
        const isNarrative = Math.random() < narrativeChance;

        if (isNarrative) {
            this.triggerNarrativeEvent();
        } else {
            this.triggerChoiceEvent();
        }
    }

    // ============================================
    // 旁白事件处理
    // ============================================

    triggerNarrativeEvent() {
        const event = this.selectEvent(true); // 选择旁白事件

        if (!event) {
            console.error('没有可用的旁白事件！');
            this.triggerChoiceEvent(); // 降级到选择事件
            return;
        }

        this.currentEvent = event;
        this.recordEvent(event.id, true);

        // 显示年龄(使用age样式)
        this.addMessage('', 'normal');
        this.addMessage(`【${this.character.age}岁】`, 'age');

        // 显示事件文本
        this.addMessage(event.text, 'event');
        this.addMessage('', 'normal');

        // 显示结果
        if (event.result) {
            this.addMessage(event.result, 'normal');
            this.addMessage('', 'normal');
        }

        // 判断是否死亡
        const isDead = Math.random() < event.death.chance;

        if (isDead) {
            this.handleNarrativeDeath(event);
        } else {
            this.handleNarrativeSurvival(event);
        }
    }

    handleNarrativeDeath(event) {
        this.character.isAlive = false;

        this.addMessage('💀 你死了。', 'death');
        this.addMessage(`▸ 死因: ${event.death.reason}`, 'death');
        this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');

        this.endGame();
    }

    handleNarrativeSurvival(event) {
        // 应用属性变化
        if (event.attributes) {
            this.applyAttributeChanges(event.attributes);
        }

        // 应用生活状态变化 (v2.0)
        if (event.effects) {
            this.applyEventEffects(event.effects);
        }

        // 年龄跳跃
        const ageJump = this.random(event.ageJump.min, event.ageJump.max);
        this.character.age += ageJump;
        this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
        this.addMessage('', 'normal');

        this.updateStats();

        // 检查是否自然死亡（年龄过大）
        if (this.character.age >= 100) {
            this.character.isAlive = false;
            this.addMessage('💀 你寿终正寝了。', 'death');
            this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');
            this.endGame();
            return;
        }

        // 继续下一个事件
        setTimeout(() => {
            this.triggerRandomEvent();
        }, 1500);
    }

    // ============================================
    // 选择事件处理
    // ============================================

    triggerChoiceEvent() {
        const event = this.selectEvent(false); // 选择选择事件

        if (!event) {
            console.error('没有可用的选择事件！');
            this.handleGameOver('事件池耗尽');
            return;
        }

        this.currentEvent = event;
        this.recordEvent(event.id, false);

        // 显示年龄(使用age样式)
        this.addMessage('', 'normal');
        this.addMessage(`【${this.character.age}岁】`, 'age');

        // 显示事件描述
        this.addMessage(event.event, 'event');
        this.addMessage('', 'normal');

        // 显示选项
        this.showChoices(event);
    }

    showChoices(event) {
        this.clearChoices();

        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => this.makeChoice(choice, event);
            this.choicesEl.appendChild(button);
        });
    }

    makeChoice(choice, event) {
        this.clearChoices();

        // 显示用户选择
        this.addMessage(`▸ 你选择了: ${choice.text}`, 'system');
        this.addMessage('', 'normal');

        // 判断成功或失败
        const isSuccess = Math.random() < choice.successRate;

        if (isSuccess) {
            this.handleChoiceSuccess(choice, event);
        } else {
            this.handleChoiceFailure(choice, event);
        }
    }

    handleChoiceSuccess(choice, event) {
        const success = choice.success;

        // 显示结果
        this.addMessage(success.result, 'success');
        this.addMessage('', 'normal');

        // 静默应用属性变化(不显示)
        if (success.attributes) {
            this.applyAttributeChangesSilent(success.attributes);
        }

        // 静默应用生活状态变化 (v2.0) - 可能会被reversal撤销
        if (success.effects) {
            this.applyEventEffects(success.effects);
        }

        // 检查是否触发反转事件
        const hasReversal = success.reversal && Math.random() < success.reversal.chance;

        if (hasReversal) {
            // 反转时显示属性变化
            this.handleReversalEvent(success.reversal, event, success.attributes, success.effects);
        } else {
            // 没有反转时才显示成功的属性变化
            if (success.attributes) {
                this.showAttributeChanges(success.attributes);
            }
            this.proceedAfterChoice(event);
        }
    }

    handleChoiceFailure(choice, event) {
        const failure = choice.failure;

        // 显示结果
        this.addMessage(failure.result, 'failure');
        this.addMessage('', 'normal');

        // 应用属性变化
        if (failure.attributes) {
            this.applyAttributeChanges(failure.attributes);
        }

        // 应用生活状态变化 (v2.0)
        if (failure.effects) {
            this.applyEventEffects(failure.effects);
        }

        // 判断是否死亡
        const isDead = Math.random() < failure.death.chance;

        if (isDead) {
            this.handleChoiceDeath(failure.death);
        } else {
            this.proceedAfterChoice(event);
        }
    }

    handleChoiceDeath(death) {
        this.character.isAlive = false;

        this.addMessage('💀 你死了。', 'death');
        this.addMessage(`▸ 死因: ${death.reason}`, 'death');
        this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');

        this.endGame();
    }

    proceedAfterChoice(event) {
        // 年龄跳跃
        const ageJump = this.random(event.ageJump.min, event.ageJump.max);
        this.character.age += ageJump;
        this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
        this.addMessage('', 'normal');

        this.updateStats();

        // 检查是否自然死亡（年龄过大）
        if (this.character.age >= 100) {
            this.character.isAlive = false;
            this.addMessage('💀 你寿终正寝了。', 'death');
            this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');
            this.endGame();
            return;
        }

        // 继续下一个事件
        setTimeout(() => {
            this.triggerRandomEvent();
        }, 1500);
    }

    // ============================================
    // 反转事件处理
    // ============================================

    handleReversalEvent(reversal, event, successAttributes, successEffects) {
        this.addMessage('', 'normal');

        // 直接显示反转文本(移除"但是..."提示)
        this.addMessage(reversal.text, 'failure');
        this.addMessage('', 'normal');

        // 先撤销成功的属性变化,再应用反转的属性变化
        if (successAttributes) {
            // 撤销成功的属性
            for (const [attr, change] of Object.entries(successAttributes)) {
                if (this.character.attributes[attr] !== undefined) {
                    this.character.attributes[attr] = Math.max(-8888, Math.min(100, this.character.attributes[attr] - change));
                }
            }
        }

        // 撤销成功的生活状态变化 (v2.0) - 如果反转有自己的effects就应用反转的,否则撤销成功的
        if (successEffects && !reversal.effects) {
            // 如果反转事件没有指定effects,就撤销成功的effects
            // 例如: hasPartner变true → 撤销为false
            if (successEffects.hasPartner !== undefined) {
                this.lifeState.partner.hasPartner = !successEffects.hasPartner;
                if (!successEffects.hasPartner) {
                    this.lifeState.partner.partnerSince = null;
                }
            }
            if (successEffects.hasChild !== undefined) {
                this.lifeState.children.hasChild = !successEffects.hasChild;
                if (!successEffects.hasChild) {
                    this.lifeState.children.childJoinAge = null;
                }
            }
        }

        // 应用反转的属性变化并显示
        if (reversal.attributes) {
            this.applyAttributeChanges(reversal.attributes);
        }

        // 应用反转的生活状态变化 (v2.0)
        if (reversal.effects) {
            this.applyEventEffects(reversal.effects);
        }

        // 判断是否死亡
        const isDead = Math.random() < reversal.death.chance;

        if (isDead) {
            this.handleReversalDeath(reversal.death);
        } else {
            this.proceedAfterChoice(event);
        }
    }

    handleReversalDeath(death) {
        this.character.isAlive = false;

        this.addMessage('💀 你死了。', 'death');
        this.addMessage(`▸ 死因: ${death.reason}`, 'death');
        this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');

        this.endGame();
    }

    // ============================================
    // 状态改变处理 (v2.0)
    // ============================================

    // 应用事件导致的生活状态改变
    applyEventEffects(effects) {
        if (!effects) return;

        // Debug日志
        console.log('[状态系统] 应用effects:', effects);

        // 处理伴侣状态变化
        if (effects.hasPartner !== undefined) {
            this.lifeState.partner.hasPartner = effects.hasPartner;
            console.log(`[状态系统] 伴侣状态变更: ${effects.hasPartner}`);
        }

        // 记录获得伴侣的时间
        if (effects.partnerSince === 'current') {
            this.lifeState.partner.partnerSince = this.character.age;
            console.log(`[状态系统] 记录伴侣起始年龄: ${this.character.age}`);
        }

        // 处理孩子状态变化
        if (effects.hasChild !== undefined) {
            this.lifeState.children.hasChild = effects.hasChild;
            console.log(`[状态系统] 孩子状态变更: ${effects.hasChild}`);
        }

        // 记录孩子加入家庭的时间
        if (effects.childJoinAge === 'current') {
            this.lifeState.children.childJoinAge = this.character.age;
            console.log(`[状态系统] 记录孩子加入年龄: ${this.character.age}`);
        }

        // 处理孩子离家状态
        if (effects.childLeftHome !== undefined) {
            this.lifeState.children.childLeftHome = effects.childLeftHome;
            console.log(`[状态系统] 孩子离家状态变更: ${effects.childLeftHome}`);
        }

        // 显示当前完整状态
        console.log('[状态系统] 当前生活状态:', JSON.stringify(this.lifeState, null, 2));
    }

    // ============================================
    // 属性变化处理
    // ============================================

    // 应用属性变化并显示
    applyAttributeChanges(attributes) {
        for (const [attr, change] of Object.entries(attributes)) {
            if (this.character.attributes[attr] !== undefined) {
                const oldValue = this.character.attributes[attr];
                this.character.attributes[attr] = Math.max(-8888, Math.min(100, oldValue + change));
                const newValue = this.character.attributes[attr];

                // 显示属性变化(使用中文名称)
                const attrName = this.attrNameMap[attr] || attr;
                const changeText = change > 0 ? `+${change}` : `${change}`;
                const color = change > 0 ? 'success' : 'failure';
                this.addMessage(`▸ ${attrName} ${changeText} (${oldValue} → ${newValue})`, color);
            }
        }
    }

    // 静默应用属性变化(不显示)
    applyAttributeChangesSilent(attributes) {
        for (const [attr, change] of Object.entries(attributes)) {
            if (this.character.attributes[attr] !== undefined) {
                this.character.attributes[attr] = Math.max(-8888, Math.min(100, this.character.attributes[attr] + change));
            }
        }
    }

    // 只显示属性变化(不应用)
    showAttributeChanges(attributes) {
        for (const [attr, change] of Object.entries(attributes)) {
            if (this.character.attributes[attr] !== undefined) {
                const currentValue = this.character.attributes[attr];
                const oldValue = currentValue - change;  // 反推旧值

                const attrName = this.attrNameMap[attr] || attr;
                const changeText = change > 0 ? `+${change}` : `${change}`;
                const color = change > 0 ? 'success' : 'failure';
                this.addMessage(`▸ ${attrName} ${changeText} (${oldValue} → ${currentValue})`, color);
            }
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
