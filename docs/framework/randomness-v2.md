# 随机系统框架设计 V2

> 本文档记录游戏随机性机制的重新设计
> 创建时间：2025-11-15
> 版本：V2（重构版）

---

## ⚠️ 重要说明

**旧版本**：`randomness.md` 已废弃（六层随机系统）
**新版本**：本文件（简化版随机系统）

**设计原则**：
- ✅ 简单清晰，易于理解和维护
- ✅ 固定小概率，避免复杂计算
- ✅ 用户体验优先
- ✅ 体现"人生无常"的主题

---

## 🎯 随机系统核心组成

### 四层随机判定

```
第1层：旁白事件触发判定（概率：20%平均）
    ↓ 否
第2层：选择事件筛选与随机选择（加权随机）
    ↓
第3层：选择结果判定（成功率：事件定义）
    ↓ 成功
第4层：反转事件触发判定（概率：15%）
```

---

## 📊 第1层：旁白事件触发机制

### 触发概率（按年龄段）

```javascript
// config.js 配置
narrativeChance: {
  baby: 0.25,    // 25% - 婴儿期多用旁白快速跳过
  child: 0.15,   // 15%
  teen: 0.10,    // 10% - 青少年期减少旁白，增加选择
  young: 0.15,   // 15% - 核心年龄段也要有旁白丰富度
  middle: 0.20,  // 20%
  elder: 0.25    // 25% - 老年期多用旁白快速收尾
}
```

### 触发逻辑

```javascript
function shouldTriggerNarrative(age) {
  const ageGroup = GameConfig.getAgeGroup(age);
  const chance = GameConfig.narrativeChance[ageGroup];

  return Math.random() < chance;
}
```

### 设计原则

**完全随机，与属性无关**
- ✅ 只受年龄段影响
- ❌ 不受运气值、健康值等属性影响
- 🎯 目标：20次选择约4次旁白（20%平均概率）

**年龄段差异化**
- 婴儿期/老年期：高概率（25%）- 快速跳过
- 青年期：中等概率（15%）- 平衡体验
- 青少年期：低概率（10%）- 更多选择

---

## 🎲 第2层：选择事件筛选与选择

### 事件筛选条件

```javascript
function filterChoiceEvents(age, character) {
  const ageGroup = GameConfig.getAgeGroup(age);

  return allEvents.filter(event => {
    // 条件1：年龄段匹配
    if (event.ageGroup !== ageGroup) return false;

    // 条件2：年龄范围匹配
    if (age < event.requirements.minAge ||
        age > event.requirements.maxAge) {
      return false;
    }

    // 条件3：属性要求（可选）
    if (event.requirements.attributes) {
      for (let attr in event.requirements.attributes) {
        const required = event.requirements.attributes[attr].min;
        if (character.attributes[attr] < required) {
          return false;
        }
      }
    }

    // 条件4：去重（最近5个事件不重复）
    if (recentEvents.includes(event.id)) return false;

    return true;
  });
}
```

### 加权随机选择

```javascript
function selectWeightedEvent(events, character) {
  // 计算每个事件的实际权重
  const weightedEvents = events.map(event => {
    let weight = event.weight;

    // 可选：根据年龄段调整权重
    const ageGroup = GameConfig.getAgeGroup(character.age);
    const categoryWeight = GameConfig.categoryWeightByAge[ageGroup];

    if (categoryWeight && categoryWeight[event.category]) {
      weight *= categoryWeight[event.category];
    }

    // 可选：根据属性调整权重（影响程度：不高不低）
    if (event.category === 'love' && character.charm > 50) {
      weight *= 1.3;  // 高魅力：恋爱事件权重 +30%
    }

    if (event.category === 'career' && character.intelligence > 50) {
      weight *= 1.3;  // 高智力：职场事件权重 +30%
    }

    return { event, weight };
  });

  // 加权随机选择
  const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (let item of weightedEvents) {
    random -= item.weight;
    if (random <= 0) return item.event;
  }

  return weightedEvents[0].event; // fallback
}
```

### 设计原则

**基础权重**（基于吸引力）
- 高吸引力事件（恋爱/职场/暴富）：权重 10
- 中等吸引力事件（友情/学业）：权重 5
- 低吸引力事件（日常琐事）：权重 2

**动态调整**（可选）
- 年龄段权重：青少年期恋爱事件 × 2
- 属性权重：高魅力恋爱事件 × 1.3
- 影响程度：30%左右（不高不低）

---

## ✅ 第3层：选择结果判定

### 成功率设定

```javascript
// 事件定义中的成功率
choice: {
  text: "勇敢表白",
  successRate: 0.6,  // 60%成功率（由事件设计者定义）

  success: {
    message: "她接受了你的表白！",
    attributes: { charm: +15, health: +10 }
  },

  failure: {
    message: "她拒绝了你...",
    attributes: { health: -15, charm: -5 },
    deathChance: 0.05  // 5%死亡概率
  }
}
```

### 判定逻辑

```javascript
function makeChoice(choiceIndex) {
  const choice = currentEvent.choices[choiceIndex];

  // 判断成功/失败（纯随机）
  const success = Math.random() < choice.successRate;

  if (success) {
    // 应用成功结果
    applyResult(choice.success);

    // 判断是否触发反转（第4层）
    checkReversal(choice);
  } else {
    // 应用失败结果
    applyResult(choice.failure);

    // 判断是否死亡
    checkDeath(choice.failure.deathChance, choice.failure.deathMessage);
  }
}
```

### 设计原则

**成功率范围**
- 低风险选择：70-90% 成功率
- 中等风险选择：50-70% 成功率
- 高风险选择：30-50% 成功率
- 极端选择：10-30% 成功率

**失败惩罚**
- 低风险失败：-5 ~ -10 属性，0%死亡
- 中等风险失败：-10 ~ -15 属性，0-5%死亡
- 高风险失败：-15 ~ -20 属性，5-10%死亡
- 极端失败：-20+ 属性，10-20%死亡

---

## 🔄 第4层：反转事件触发机制

### 触发概率

```javascript
// config.js 配置
reversalChance: 0.15  // 15%固定概率
```

### 触发逻辑

```javascript
function checkReversal(choice) {
  // 只在选择成功后才有可能触发反转
  if (!choice.reversal) return;

  // 15%概率触发反转
  if (Math.random() < GameConfig.reversalChance) {
    triggerReversal(choice.reversal);
  }
}

function triggerReversal(reversal) {
  // 显示反转文本
  showMessage('【反转】' + reversal.message, 'death');

  // 应用反转属性变化（通常是负面）
  applyAttributeChanges(reversal.attributes);

  // 判断是否死亡
  checkDeath(reversal.deathChance, reversal.deathMessage);
}
```

### 反转事件设计原则

**触发时机**
- ✅ 只在选择成功后触发
- ❌ 失败后不触发（已经够惨了）

**属性变化**
- 通常是负面变化（-10 ~ -20）
- 可能抵消部分成功收益
- 甚至可能让总收益变负

**死亡概率**
- 一般反转：5-10%死亡
- 严重反转：10-15%死亡
- 极端反转：15-20%死亡

**文案风格**
- 体现"人生无常"
- 黑色幽默
- 反差感强

**示例**：
```javascript
reversal: {
  chance: 0.15,  // 使用全局配置
  message: "但你学习过度，突发疾病住院...",
  attributes: { health: -20, intelligence: -5 },
  deathChance: 0.10,
  deathMessage: "你因过劳猝死"
}
```

---

## ☠️ 死亡机制

### 三个死亡触发点

**1. 旁白事件死亡**
```javascript
// 小概率（0-10%）
narrativeEvent: {
  effects: {
    deathChance: 0.08,  // 8%死亡概率
    deathMessage: "食物中毒，死于廉价麻辣烫"
  }
}
```

**2. 选择失败死亡**
```javascript
// 较高概率（5-20%）
failure: {
  deathChance: 0.15,  // 15%死亡概率
  deathMessage: "你因心碎过度，抑郁而终"
}
```

**3. 反转事件死亡**
```javascript
// 中等概率（5-15%）
reversal: {
  deathChance: 0.10,  // 10%死亡概率
  deathMessage: "你因过劳猝死"
}
```

### 死亡判定逻辑

```javascript
function checkDeath(deathChance, deathMessage) {
  if (!deathChance) return false;

  if (Math.random() < deathChance) {
    triggerDeath(deathMessage);
    return true;
  }

  return false;
}

function triggerDeath(reason) {
  character.isAlive = false;

  showMessage('═════════════════════════════════════', 'system');
  showMessage('【你死了】', 'death');
  showMessage(`▸ 死因: ${reason}`, 'death');
  showMessage(`▸ 享年: ${character.age}岁`, 'death');
  showMessage('═════════════════════════════════════', 'system');

  endGame();
}
```

### 健康归零死亡

```javascript
// 属性变化后检查
function applyAttributeChanges(changes) {
  for (let attr in changes) {
    character.attributes[attr] += changes[attr];

    // 限制范围 0-100
    character.attributes[attr] = Math.max(0,
      Math.min(100, character.attributes[attr])
    );
  }

  // 健康归零 = 死亡
  if (character.attributes.health <= 0) {
    triggerDeath('健康耗尽');
  }
}
```

### 死亡概率设计原则

**平衡性目标**
- 平均游戏时长：19次选择
- 平均死亡年龄：30-50岁
- 不能太简单（无脑通关）
- 不能太难（一直死亡）

**概率分配**
```
19次选择中：
- 4次旁白事件 × 5%平均死亡率 = 0.2次死亡
- 15次选择事件 × 40%失败率 × 10%死亡率 = 0.6次死亡
- 9次成功 × 15%反转 × 10%死亡率 = 0.135次死亡

总期望死亡次数：约 0.935次 ≈ 1次

结论：平均每局会死亡1次左右，符合预期 ✅
```

---

## 🎯 属性系统的随机影响

### 影响方式

**方式1：作为事件触发条件**
```javascript
requirements: {
  attributes: {
    charm: { min: 10 }  // 需要最低魅力10
  }
}
```

**方式2：影响成功率（可选实现）**
```javascript
function calculateSuccessRate(baseRate, event, character) {
  let rate = baseRate;

  // 魅力影响恋爱事件成功率（轻微影响）
  if (event.category === 'love') {
    const charmBonus = (character.charm - 10) / 90 * 0.3;  // 最多±30%
    // 基准10（初始值中位数），范围90（10-100），影响30%
    rate += charmBonus;
  }

  // 智力影响职场事件成功率
  if (event.category === 'career') {
    const intBonus = (character.intelligence - 10) / 90 * 0.3;
    rate += intBonus;
  }

  // 限制范围 5-95%
  return Math.max(0.05, Math.min(0.95, rate));
}
```

**方式3：影响事件权重**
```javascript
// 高魅力 → 恋爱事件权重 +30%
if (event.category === 'love' && character.charm > 50) {
  weight *= 1.3;
}
```

### 设计原则

**影响程度**："不能没有影响，也不能影响太高"
- ✅ 属性差异带来 10-30% 的影响
- ❌ 避免属性完全决定结果（运气仍然重要）
- 🎯 体现"选择和努力有用，但运气也很重要"

**推荐实现**
- 优先使用：触发条件（简单明确）
- 可选使用：权重影响（适度增加体验）
- 谨慎使用：成功率影响（容易破坏平衡）

---

## 🔧 配置文件整合

### config.js 需要的随机系统配置

```javascript
// ========== 随机系统配置 ==========

randomSystem: {
  // 旁白事件触发概率（按年龄段）
  narrativeChance: {
    baby: 0.25,
    child: 0.15,
    teen: 0.10,
    young: 0.15,
    middle: 0.20,
    elder: 0.25
  },

  // 反转事件触发概率（固定）
  reversalChance: 0.15,  // 15%

  // 属性对事件的影响程度
  attributeInfluence: {
    enabled: true,        // 是否启用属性影响
    maxBonus: 0.30,       // 最大影响幅度 ±30%

    // 哪些属性影响哪些事件
    mapping: {
      love: 'charm',      // 恋爱事件受魅力影响
      career: 'intelligence',  // 职场事件受智力影响
      money: 'luck',      // 暴富事件受运气影响
      family: 'charm'     // 家庭事件受魅力影响
    }
  }
}
```

---

## 📊 随机性验证

### 示例：1000次模拟测试

```javascript
// 伪代码：模拟1000次游戏
function simulateGames(count = 1000) {
  const results = {
    totalChoices: [],
    narrativeCount: [],
    reversalCount: [],
    deathAge: [],
    deathReason: []
  };

  for (let i = 0; i < count; i++) {
    const game = playGameSimulation();
    results.totalChoices.push(game.choiceCount);
    results.narrativeCount.push(game.narrativeCount);
    results.reversalCount.push(game.reversalCount);
    results.deathAge.push(game.deathAge);
    results.deathReason.push(game.deathReason);
  }

  return {
    avgChoices: average(results.totalChoices),      // 期望：19次
    avgNarrative: average(results.narrativeCount),  // 期望：4次（20%）
    avgReversal: average(results.reversalCount),    // 期望：1-2次
    avgDeathAge: average(results.deathAge),         // 期望：30-50岁

    deathByNarrative: countReason(results, 'narrative'),    // 期望：20%
    deathByFailure: countReason(results, 'failure'),        // 期望：60%
    deathByReversal: countReason(results, 'reversal'),      // 期望：20%
    deathByHealth: countReason(results, 'health_zero')      // 期望：<5%
  };
}
```

### 预期结果

```
平均选择次数：19 ± 3次
平均旁白次数：4 ± 1次（21%）
平均反转次数：1-2次
平均死亡年龄：35 ± 15岁

死亡原因分布：
- 旁白事件死亡：15-20%
- 选择失败死亡：50-60%
- 反转事件死亡：15-20%
- 健康归零死亡：<5%
```

---

## 🎮 与旧系统的对比

### 旧系统（已废弃）
```
❌ 复杂：六层随机判定
❌ 难懂：属性影响计算复杂
❌ 失控：突发死亡概率过高（0岁死亡）
❌ 冗余：世界混乱度、连胜连败系统
```

### 新系统（当前）
```
✅ 简洁：四层随机判定
✅ 清晰：固定概率，易于调整
✅ 平衡：死亡概率合理分散
✅ 灵活：配置化，易于测试
```

---

## 📝 关键设计决策

### 决策1：固定概率 vs 动态计算
**选择**：固定概率（旁白20%、反转15%）
**原因**：简单、可预测、易于调整

### 决策2：属性影响程度
**选择**：轻微影响（10-30%）
**原因**：平衡"选择重要性"和"随机性"

### 决策3：死亡概率分散
**选择**：三个死亡点，不同概率
**原因**：避免单点死亡率过高，保持游戏体验

### 决策4：去掉六层随机
**选择**：简化为四层判定
**原因**：旧系统过于复杂，难以维护和平衡

---

## 🔄 版本历史

- **V1** (2025-11-13) - 六层随机系统（已废弃）
  - 游戏自我关闭彩蛋
  - 旁白事件（动态概率）
  - 突发死亡（绑定运气值，问题严重）
  - 选择事件
  - 属性反转机制
  - 世界混乱度

- **V2** (2025-11-15) - 简化随机系统（当前版本）
  - 旁白事件触发（固定概率20%）
  - 选择事件筛选和选择（加权随机）
  - 选择结果判定（成功率）
  - 反转事件触发（固定概率15%）
  - 死亡机制（三个触发点）
  - 属性影响（轻微10-30%）

---

## 📌 快速参考

### 关键概率
- 旁白触发：20%（平均）
- 反转触发：15%
- 失败死亡：5-20%（视事件）
- 旁白死亡：0-10%（视事件）
- 反转死亡：5-15%（视事件）

### 关键文件
- `docs/framework/randomness-v2.md` - 本文件
- `docs/framework/event.md` - 事件系统框架
- `docs/framework/distribution.md` - 事件分布框架
- `src/config.js` - 配置文件

### 设计原则
1. 简单清晰 > 复杂精巧
2. 固定概率 > 动态计算
3. 用户体验 > 机制完美
4. 易于调整 > 一次到位
