# 事件系统框架设计

> 本文档记录游戏事件系统的完整设计
> 创建时间：2025-11-15
> 最后更新：2025-11-15

---

## 📋 核心设计理念

### 游戏主题
**"文字人生" - 体现人生的无常和不确定性**

### 设计目标
1. **没有绝对安全的选项** - 同一选择可能有不同结果
2. **平衡难度和趣味性** - 不能太简单也不能太难
3. **丰富的人生体验** - 通过多种事件类型增加趣味性
4. **保证用户体验感** - 在吸引玩家的同时有游戏挑战性

---

## 🎯 三种事件类型

### 1. 旁白事件（Narrative Event）

**定义**：无选择的纯文本事件，体现"人生无常"

**核心特点**：
- ✅ 完全随机触发，与玩家属性无关
- ✅ 只有文本，没有选项
- ✅ 可能导致死亡（看玩家真实运气，非属性运气）
- ✅ 文本长度多样（从短到长）
- ✅ 增加人生丰富度和趣味性
- ✅ **事件结果多样化**：有好有坏，但都要诙谐有趣
  - 好事件：幸运、意外收获、惊喜
  - 坏事件：倒霉、尴尬、小灾小难
  - 死亡事件：荒诞、黑色幽默的死法
  - **游戏风格**：诙谐有趣，不死板，黑色幽默

**文本格式**：
```
1. 发生了什么事件
2. （可选）玩家为何这么做的原因
3. 结果
4. 年龄跳跃
5. 属性变化（±10-20）
```

**数据结构**：
```javascript
{
  id: "narrative_001",
  type: "narrative",              // 标记为旁白事件
  title: "街头好人",
  ageGroup: "young",               // 适用年龄段

  // 旁白事件完整文本（按格式组织）
  content: {
    event: "你在街上捡到了一个钱包...",
    reason: "你决定交给警察。",      // 可选
    result: "失主非常感激，给了你 500 元作为感谢。"
  },

  // 属性变化
  effects: {
    attributes: { luck: +15, charm: +10 },
    deathChance: 0.0,              // 此事件不导致死亡
    deathMessage: null
  },

  // 年龄跳跃（使用配置）
  useAgeJump: true                  // 使用 GameConfig.getAgeJump()
}
```

**示例1（正面 - 幸运事件）**：
```
【旁白】你在街上捡到了一个钱包...
你决定交给警察。
失主竟然是个富豪，给了你 5000 元作为感谢！

时间流逝... +2岁

▸ luck +15
▸ charm +10
```

**示例2（负面 - 倒霉事件）**：
```
【旁白】你走在路上，突然被一只流浪狗追着咬...
你拼命逃跑，摔了一跤。
路人哈哈大笑，你感到很尴尬。

时间流逝... +1岁

▸ health -10
▸ charm -5
```

**示例3（负面 + 死亡 - 黑色幽默）**：
```
【旁白】你吃了一碗街边摊的麻辣烫...
感觉味道有点奇怪，但还是吃完了。
半夜突然腹痛难忍...

【你死了】
▸ 死因：食物中毒，死于廉价麻辣烫
▸ 享年：25岁
```

**示例4（正面 - 意外惊喜）**：
```
【旁白】你无聊地刮了一张彩票...
居然中了 1000 元！
你兴奋地跳了起来。

时间流逝... +1岁

▸ luck +20
▸ health +5
```

**示例5（中性 - 日常趣事）**：
```
【旁白】你在电梯里遇到了暗恋的人...
紧张到说不出话，按错了楼层。
对方似乎注意到了你的窘态，微微一笑。

时间流逝... +1岁

▸ charm -5
▸ intelligence -3（智商感人）
```

### 旁白事件的文案风格

**游戏主题**：诙谐有趣的"文字人生"，不死板

**风格原则**：
1. **黑色幽默** - 即使是死亡也要有趣
2. **生活化** - 贴近现实但夸张化
3. **反差感** - 平凡事件 + 荒诞结果
4. **多样化** - 有好有坏，有喜有悲

**事件分类与风格示例**：

**1. 幸运事件（属性 +10 ~ +20）**
```
主题：意外之财、贵人相助、好运连连
风格：惊喜、夸张、让人会心一笑

示例：
- 路边捡钱包 → 失主是富豪 → 重金酬谢
- 随手买彩票 → 中了大奖 → 兴奋到跳起来
- 帮老奶奶过马路 → 她是某公司董事长 → 给你内推机会
```

**2. 倒霉事件（属性 -5 ~ -15）**
```
主题：小灾小难、尴尬瞬间、倒霉日常
风格：搞笑、自嘲、让人哭笑不得

示例：
- 被流浪狗追咬 → 摔跤 → 路人笑话
- 约会迟到 → 路上堵车 → 对方已经走了
- 面试穿反裤子 → 被人指出 → 社死现场
- 吃火锅烫到舌头 → 说话大舌头 → 被人嘲笑
```

**3. 荒诞死亡事件（死亡概率 5-10%）**
```
主题：意外死亡、荒诞方式、黑色幽默
风格：夸张、讽刺、让人哭笑不得

示例：
- 吃街边摊 → 食物中毒 → 死于廉价麻辣烫
- 玩手机过马路 → 没看红绿灯 → 被车撞飞
- 熬夜打游戏 → 连续通宵 → 猝死在电脑前
- 模仿网红挑战 → 失败摔倒 → 头部着地身亡
- 吃播挑战 → 噎住 → 窒息而亡
```

**4. 日常趣事（属性 ±5 或无变化）**
```
主题：生活小事、尴尬瞬间、有趣经历
风格：轻松、幽默、贴近生活

示例：
- 电梯遇见暗恋对象 → 紧张到按错楼层 → 尴尬
- 上课打瞌睡 → 被老师点名 → 答非所问
- 发朋友圈 → 发现发错群了 → 秒删
- 吃饭塞牙 → 没带牙签 → 用手抠被人看到
```

**文案写作技巧**：

**技巧1：反差萌**
```
平凡开头 → 荒诞结尾

❌ 死板：你生病了，去医院治疗，但是没钱。
✅ 有趣：你感冒了去医院，医生说"多喝热水"。你回家喝了一吨水，感冒没好反而尿频了。
```

**技巧2：自嘲式幽默**
```
通过玩家视角的自嘲增加代入感

❌ 死板：你考试不及格。
✅ 有趣：你考试得了 30 分，老师说："恭喜你，至少比 0 分高！"你：？？？
```

**技巧3：夸张化**
```
现实事件夸张化处理

❌ 死板：你跑步摔倒了。
✅ 有趣：你跑步时突然被鞋带绊倒，在空中翻了 360 度后完美着地...脸着地。
```

**技巧4：网络梗和时代感**
```
结合当下流行的网络用语和梗

示例：
- "你发了一条朋友圈，没有人点赞。社交性死亡。"
- "你尝试学网红跳舞，结果扭伤了腰。医生：年纪轻轻就这样？"
- "你参加相亲，对方看了你一眼说：'我还有事先走了。'你：？"
```

**文案长度建议**：
- 短文案：1-2句话（20-40字）
- 中文案：3-5句话（40-100字）
- 长文案：5-8句话（100-200字）
- 建议比例：短30% / 中50% / 长20%

---

### 2. 选择事件（Choice Event）

**定义**：玩家需要做出选择的事件

**核心特点**：
- ✅ 有2-4个选项供玩家选择
- ✅ 每个选项有成功/失败概率
- ✅ 成功 → 属性增加，可能触发反转事件
- ✅ 失败 → 属性减少，可能死亡

**数据结构**：
```javascript
{
  id: "choice_001",
  type: "choice",                   // 标记为选择事件
  title: "校园表白",
  description: "你暗恋的人就在面前...",

  ageGroup: "teen",                 // 适用年龄段
  attractiveness: "high",           // 吸引力等级: high/medium/low
  category: "love",                 // 内容分类: love/career/money/friendship
  weight: 10,                       // 出现权重（高吸引力=高权重）

  // 触发条件（可选）
  requirements: {
    minAge: 13,
    maxAge: 18,
    attributes: {                   // 属性要求（可选）
      charm: { min: 10 }            // 需要最低魅力10
    }
  },

  // 选项列表
  choices: [
    {
      text: "勇敢表白",

      // 成功/失败结果
      successRate: 0.6,             // 60%成功率

      success: {
        message: "她接受了你的表白！",
        attributes: { charm: +15, health: +10 },
        deathChance: 0.0            // 成功不会死亡
      },

      failure: {
        message: "她拒绝了你...",
        attributes: { health: -15, charm: -5 },
        deathChance: 0.05,          // 5%死亡概率（极端情况：心碎而亡）
        deathMessage: "你因心碎过度，抑郁而终"
      }
    },
    {
      text: "默默关注",
      successRate: 0.9,
      success: {
        message: "你继续默默关注她，心中充满期待。",
        attributes: { health: +5 },
        deathChance: 0.0
      },
      failure: {
        message: "她发现了你的关注，感到不适...",
        attributes: { charm: -10 },
        deathChance: 0.0
      }
    }
  ]
}
```

**流程**：
```
显示事件描述和选项
    ↓
玩家选择
    ↓
根据 successRate 判断成功/失败
    ↓ 成功
    显示成功消息
    属性变化 +10-20
    判断反转事件触发？（下一节）

    ↓ 失败
    显示失败消息
    属性变化 -10-20
    判断死亡（deathChance）
```

---

### 3. 反转事件（Reversal Event）

**定义**：在选择成功后，有小概率触发的负面事件

**设计目的**：
- ❌ 让玩家无法认定"安全选项"
- ❌ 同一个选项不是"完全增加属性"的保险选择
- ✅ 增加游戏的不确定性和趣味性
- ✅ 体现"人生无常"的主题

**触发时机**：
```
玩家选择成功
    ↓
属性已增加（+10-20）
    ↓
触发反转事件概率（配置：15%）
    ↓ 是
    显示反转文本
    属性反向变化（-10-20）
    可能死亡
```

**数据结构**（内嵌在选择事件中）：
```javascript
{
  id: "choice_001",
  type: "choice",
  // ... 其他字段

  choices: [
    {
      text: "努力学习",
      successRate: 0.8,

      success: {
        message: "你的成绩突飞猛进！",
        attributes: { intelligence: +15 }
      },

      // 反转事件（可选）
      reversal: {
        chance: 0.15,               // 15%触发概率（可使用全局配置）
        message: "但你学习过度，突发疾病住院...",
        attributes: { health: -20, intelligence: -5 },
        deathChance: 0.1,           // 10%死亡概率
        deathMessage: "你因过劳猝死"
      }
    }
  ]
}
```

**示例流程**：
```
你选择了"努力学习"
→ 判断成功（80%）→ 成功！

▸ intelligence +15 ✓

→ 判断反转（15%）→ 触发！

【反转】但你学习过度，突发疾病住院...
▸ health -20
▸ intelligence -5

→ 判断死亡（10%）→ 存活
```

---

## ☠️ 死亡机制（核心）

### 设计原则
- ✅ 平衡吸引力和难度
- ✅ 不能太简单（无脑通关）
- ✅ 不能太难（一直死亡）
- ✅ 保证体验感和趣味性

### 三个死亡触发点

**死亡点1：旁白事件**
- 时机：旁白事件结果
- 概率：小概率（0-10%，取决于事件）
- 特点：完全随机，体现"人生无常"

**死亡点2：选择事件失败**
- 时机：选择失败后
- 概率：较高概率（5-20%，取决于事件）
- 特点：玩家可以通过选择影响

**死亡点3：反转事件**
- 时机：反转事件触发后
- 概率：中等概率（5-15%，取决于事件）
- 特点：即使选择成功也可能死亡，体现"无绝对安全"

### 死亡触发逻辑

```javascript
// 判断是否死亡
function checkDeath(deathChance, deathMessage) {
  if (!deathChance) return false;

  if (Math.random() < deathChance) {
    this.triggerDeath(deathMessage);
    return true;
  }

  return false;
}

// 触发死亡
function triggerDeath(reason) {
  this.character.isAlive = false;
  this.addMessage('═════════════════════════════════════', 'system');
  this.addMessage('【你死了】', 'death');
  this.addMessage(`▸ 死因: ${reason}`, 'death');
  this.addMessage(`▸ 享年: ${this.character.age}岁`, 'death');
  this.addMessage('═════════════════════════════════════', 'system');

  this.endGame();
}
```

### 属性归零死亡

```javascript
// 健康值归零 = 死亡
if (this.character.attributes.health <= 0) {
  this.triggerDeath('健康耗尽');
}
```

---

## 📊 属性系统

### 设计原则
**"低初始值，高改变值"**

- **目的**：体现选择的重要性
- **初始差异小** → 公平性，不会一开始就天差地别
- **变化幅度大** → 每次选择都很重要，影响深远

### 属性配置

**属性范围**：0-100
- 0 = 死亡（health）或极差
- 100 = 极佳

**初始属性范围**：5-15（个位数到十几）
```javascript
// config.js
characterStats: {
  health: { min: 5, max: 15 },
  intelligence: { min: 5, max: 15 },
  luck: { min: 5, max: 15 },
  charm: { min: 5, max: 15 }
}
```

**属性变化范围**：±10-20
```javascript
// 事件效果
effects: {
  success: {
    attributes: { health: +15 }      // 10-20之间
  },
  failure: {
    attributes: { health: -15 }      // -10 到 -20
  }
}
```

### 属性对事件的影响

**影响程度**：不能没有影响，也不能影响太高

**方式1：作为触发条件**
```javascript
requirements: {
  attributes: {
    charm: { min: 10 }              // 需要最低魅力10才能触发
  }
}
```

**方式2：影响成功率（可选实现）**
```javascript
// 根据属性微调成功率
function calculateSuccessRate(baseRate, requiredAttr, playerAttr) {
  // 属性每高10点，成功率+5%
  const bonus = Math.floor((playerAttr - requiredAttr) / 10) * 0.05;
  return Math.min(0.95, baseRate + bonus);  // 最高95%
}

// 示例：
// 基础成功率60%，魅力要求10，玩家魅力30
// → 成功率 = 60% + (30-10)/10 * 5% = 60% + 10% = 70%
```

**方式3：作为事件筛选权重（推荐）**
```javascript
// 高魅力的人更容易遇到恋爱事件
function getEventWeight(event, character) {
  let weight = event.weight;

  if (event.category === 'love' && character.attributes.charm > 30) {
    weight *= 1.5;  // 高魅力时恋爱事件权重+50%
  }

  return weight;
}
```

---

## 🎲 事件触发流程

### 完整流程图

```
开始回合
    ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第1层】旁白事件触发判定
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
随机判定：是否触发旁白事件？
（概率：GameConfig.narrativeChance，按年龄段）
    ↓ 是
    显示旁白文本
    （事件 → 原因 → 结果）
    ↓
    属性变化 ± 10-20
    ↓
    判断死亡？（deathChance）
    ↓ 是 → 游戏结束
    ↓ 否
    年龄跳跃（GameConfig.getAgeJump()）
    → 下一回合

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第2层】选择事件（旁白未触发时）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓ 否
    筛选符合条件的事件
    （年龄段、属性要求、去重）
    ↓
    加权随机选择事件
    （高吸引力事件权重更高）
    ↓
    显示事件描述和选项
    ↓
    玩家选择
    ↓
    判断成功/失败（successRate）

    ━━━━ 成功分支 ━━━━
    ↓ 成功
    显示成功消息
    属性增加 +10-20

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    【第3层】反转事件判定（成功后）
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
    随机判定：是否触发反转？
    （概率：reversal.chance，默认15%）
    ↓ 是
    显示反转文本
    属性反转 -10-20
    ↓
    判断死亡？（reversal.deathChance）
    ↓ 是 → 游戏结束
    ↓ 否
    年龄跳跃
    → 下一回合

    ↓ 否（无反转）
    年龄跳跃
    → 下一回合

    ━━━━ 失败分支 ━━━━
    ↓ 失败
    显示失败消息
    属性减少 -10-20
    ↓
    判断死亡？（failure.deathChance）
    ↓ 是 → 游戏结束
    ↓ 否
    年龄跳跃
    → 下一回合
```

---

## 💻 代码实现示例

### 1. 事件触发主函数

```javascript
triggerRandomEvent() {
  if (!this.character.isAlive) return;

  // 第1层：旁白事件
  const narrativeChance = GameConfig.getNarrativeChance(this.character.age);
  if (Math.random() < narrativeChance) {
    this.triggerNarrativeEvent();
    return;
  }

  // 第2层：选择事件
  this.triggerChoiceEvent();
}
```

### 2. 旁白事件处理

```javascript
triggerNarrativeEvent() {
  // 筛选符合年龄的旁白事件
  const ageGroup = GameConfig.getAgeGroup(this.character.age);
  const events = narrativeEvents.filter(e => e.ageGroup === ageGroup);

  // 随机选择
  const event = events[Math.floor(Math.random() * events.length)];

  this.addMessage(`【${this.character.age}岁】`, 'system');
  this.addMessage(`【旁白】${event.content.event}`, 'event');

  if (event.content.reason) {
    this.addMessage(event.content.reason, 'normal');
  }

  this.addMessage(event.content.result, 'normal');
  this.addMessage('', 'normal');

  // 判断死亡
  if (event.effects.deathChance && Math.random() < event.effects.deathChance) {
    this.triggerDeath(event.effects.deathMessage);
    return;
  }

  // 属性变化
  this.applyAttributeChanges(event.effects.attributes);

  // 年龄跳跃
  const ageJump = GameConfig.getAgeJump(this.character.age);
  this.character.age += ageJump;
  this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
  this.addMessage('', 'normal');

  this.updateStats();

  // 继续下一回合
  setTimeout(() => this.triggerRandomEvent(), 1500);
}
```

### 3. 选择事件处理

```javascript
triggerChoiceEvent() {
  // 筛选事件
  const events = this.filterChoiceEvents();

  // 加权随机选择
  const event = this.selectWeightedEvent(events);

  // 显示事件
  this.currentEvent = event;
  this.addMessage(`【${this.character.age}岁】`, 'system');
  this.addMessage(event.description, 'event');
  this.addMessage('', 'normal');

  // 显示选项
  this.showChoices(event.choices);
}

filterChoiceEvents() {
  const ageGroup = GameConfig.getAgeGroup(this.character.age);
  const age = this.character.age;

  return choiceEvents.filter(event => {
    // 年龄段匹配
    if (event.ageGroup !== ageGroup) return false;

    // 年龄范围
    if (age < event.requirements.minAge || age > event.requirements.maxAge) {
      return false;
    }

    // 属性要求
    if (event.requirements.attributes) {
      for (let attr in event.requirements.attributes) {
        const required = event.requirements.attributes[attr].min;
        if (this.character.attributes[attr] < required) {
          return false;
        }
      }
    }

    // 去重：选择事件最近5个不重复，旁白事件最近7个不重复
    if (event.type === 'narrative') {
      if (this.recentNarratives.includes(event.id)) return false;
    } else {
      if (this.recentEvents.includes(event.id)) return false;
    }

    return true;
  });
}

selectWeightedEvent(events) {
  const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (let event of events) {
    random -= event.weight;
    if (random <= 0) return event;
  }

  return events[0]; // fallback
}
```

### 4. 选择结果处理

```javascript
makeChoice(choiceIndex) {
  const choice = this.currentEvent.choices[choiceIndex];
  this.clearChoices();

  // 判断成功/失败
  const success = Math.random() < choice.successRate;
  const result = success ? choice.success : choice.failure;

  this.addMessage(`你选择了"${choice.text}"`, 'normal');
  this.addMessage(result.message, success ? 'success' : 'death');
  this.addMessage('', 'normal');

  // 应用属性变化
  this.applyAttributeChanges(result.attributes);

  // 判断死亡
  if (result.deathChance && Math.random() < result.deathChance) {
    this.triggerDeath(result.deathMessage);
    return;
  }

  // 如果成功，判断反转
  if (success && choice.reversal) {
    if (Math.random() < choice.reversal.chance) {
      this.triggerReversal(choice.reversal);
      return;
    }
  }

  // 年龄跳跃
  const ageJump = GameConfig.getAgeJump(this.character.age);
  this.character.age += ageJump;
  this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
  this.addMessage('', 'normal');

  this.updateStats();

  // 记录事件（去重）
  this.recentEvents.push(this.currentEvent.id);
  if (this.recentEvents.length > 5) this.recentEvents.shift();  // 保留最近5个

  // 继续下一回合
  setTimeout(() => this.triggerRandomEvent(), 1500);
}
```

### 5. 反转事件处理

```javascript
triggerReversal(reversal) {
  this.addMessage('【反转】' + reversal.message, 'death');
  this.addMessage('', 'normal');

  // 属性反转
  this.applyAttributeChanges(reversal.attributes);

  // 判断死亡
  if (reversal.deathChance && Math.random() < reversal.deathChance) {
    this.triggerDeath(reversal.deathMessage);
    return;
  }

  // 年龄跳跃
  const ageJump = GameConfig.getAgeJump(this.character.age);
  this.character.age += ageJump;
  this.addMessage(`时间流逝... +${ageJump}岁`, 'system');
  this.addMessage('', 'normal');

  this.updateStats();

  // 继续下一回合
  setTimeout(() => this.triggerRandomEvent(), 1500);
}
```

### 6. 属性变化处理

```javascript
applyAttributeChanges(changes) {
  for (let attr in changes) {
    const change = changes[attr];
    this.character.attributes[attr] += change;

    // 限制范围 0-100
    this.character.attributes[attr] = Math.max(0,
      Math.min(100, this.character.attributes[attr])
    );

    // 显示变化
    const symbol = change > 0 ? '+' : '';
    const color = change > 0 ? 'success' : 'death';
    this.addMessage(`▸ ${attr} ${symbol}${change}`, color);
  }

  // 健康归零 = 死亡
  if (this.character.attributes.health <= 0) {
    this.triggerDeath('健康耗尽');
  }
}
```

---

## 📈 配置文件扩展

### config.js 需要添加的配置

```javascript
// ========== 事件系统配置 ==========

// 旁白事件触发概率（按年龄段）
narrativeChance: {
  baby: 0.15,      // 15%
  child: 0.10,
  teen: 0.05,      // 减少旁白，增加选择
  young: 0.03,     // 最少旁白，核心体验
  middle: 0.08,
  elder: 0.12
},

// 反转事件概率
reversalChance: 0.15,  // 15%

// 属性初始范围（修正为 5-15）
characterStats: {
  health: { min: 5, max: 15 },
  intelligence: { min: 5, max: 15 },
  luck: { min: 5, max: 15 },
  charm: { min: 5, max: 15 }
},

// 辅助函数
getNarrativeChance(age) {
  const ageGroup = this.getAgeGroup(age);
  return this.narrativeChance[ageGroup];
}
```

---

## 📝 事件数据组织

### 建议的文件结构

```
src/
├── events/
│   ├── narrative/           # 旁白事件
│   │   ├── baby.js
│   │   ├── teen.js
│   │   └── young.js
│   │
│   └── choice/              # 选择事件
│       ├── love.js          # 情感类
│       ├── career.js        # 职场类
│       └── money.js         # 暴富类
│
├── game.js
└── config.js
```

### 或使用单文件（初期）

```javascript
// events.js

const narrativeEvents = [
  {
    id: "narrative_baby_001",
    type: "narrative",
    ageGroup: "baby",
    content: {
      event: "你第一次学会了走路...",
      result: "摔了一跤，但很快爬起来了。"
    },
    effects: {
      attributes: { health: +5 },
      deathChance: 0.0
    }
  },
  // ... 更多旁白事件
];

const choiceEvents = [
  {
    id: "choice_teen_001",
    type: "choice",
    title: "校园表白",
    description: "你暗恋的人就在面前...",
    ageGroup: "teen",
    attractiveness: "high",
    category: "love",
    weight: 10,
    // ... 完整结构见前文
  },
  // ... 更多选择事件
];
```

---

## 🎯 下一步实施计划

### 阶段1：基础框架实现
- [ ] 更新 config.js（属性范围、旁白概率、反转概率）
- [ ] 实现事件触发主流程（triggerRandomEvent）
- [ ] 实现旁白事件处理（triggerNarrativeEvent）
- [ ] 实现选择事件处理（triggerChoiceEvent）
- [ ] 实现反转事件处理（triggerReversal）

### 阶段2：示例事件创建
- [ ] 创建5-10个旁白事件（各年龄段）
- [ ] 创建10-15个选择事件（重点：teen/young）
- [ ] 测试事件触发和流程

### 阶段3：内容扩展
- [ ] 根据测试反馈调整概率
- [ ] 增加更多事件（目标：50+选择事件，20+旁白事件）
- [ ] 优化事件文本（黑色幽默、戏剧性）

### 阶段4：优化和迭代
- [ ] 加权系统优化（确保高吸引力内容多出现）
- [ ] 死亡概率平衡（目标：平均20-30次选择死亡）
- [ ] 用户测试和反馈迭代

---

## 📊 关键设计数据总结

| 项目 | 数值 | 说明 |
|------|------|------|
| 属性初始范围 | 5-15 | 低初始值，体现公平性 |
| 属性变化范围 | ±10-20 | 高改变值，体现选择重要性 |
| 属性范围 | 0-100 | 0=死亡/极差，100=极佳 |
| 旁白触发概率 | 3-15% | 按年龄段，青年期最低（3%） |
| 反转触发概率 | 15% | 成功后15%触发反转 |
| 目标游戏时长 | 3-5分钟 | 16-22次选择 |
| 目标死亡率 | 适中 | 平均20-30次选择死亡 |

---

## 🔄 版本历史

- **v1.0** (2025-11-15) - 初始设计，完整事件系统框架
  - 定义三种事件类型（旁白/选择/反转）
  - 定义三个死亡点
  - 确定属性系统（5-15初始，±10-20变化）
  - 完整代码实现示例

---

## 📌 快速参考

### 关键概念
- **旁白事件**：无选择，体现随机性
- **选择事件**：有选择，玩家可影响
- **反转事件**：成功后反转，无绝对安全
- **低初始高改变**：属性系统核心

### 关键文件
- `docs/framework/event.md` - 本文件，事件系统框架
- `src/config.js` - 配置文件（需更新）
- `src/game.js` - 游戏引擎（需实现事件系统）
- `src/events.js` - 事件数据（待创建）

### 关键配置
- `GameConfig.narrativeChance` - 旁白触发概率
- `GameConfig.reversalChance` - 反转触发概率
- `GameConfig.characterStats` - 属性初始范围
