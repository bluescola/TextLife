# 游戏状态系统设计

## 设计目的

解决事件之间的逻辑连贯性问题，确保：
- 没有伴侣不会出现"另一半"相关事件
- 没有孩子不会出现"儿子/女儿"相关事件
- 孩子年龄与事件内容匹配
- 人生重大事件（恋爱、同居、生子等）有合理的前后关系

**设计原则**：
- ✅ 追踪"关系存在"而非"法律状态" - 支持未婚同居、领养等多样化情况
- ✅ 保持简单,避免过度复杂 - 只追踪核心状态,不追踪细节
- ✅ 保留游戏趣味性 - 不因"逻辑严谨"限制创意和荒诞性

---

## 核心状态变量(简化版v2.0)

### 1. 伴侣关系状态
```javascript
partner: {
    hasPartner: false,          // 是否有伴侣(结婚/同居/长期恋爱都算)
    partnerSince: null          // 有伴侣的起始年龄
}
```

**说明**：
- ✅ 不区分结婚/同居/恋爱 - 只要有稳定伴侣即可
- ✅ 支持未婚同居、未婚生子等情况
- ✅ 分手/离婚后可以重新有伴侣(设置hasPartner=false后可再次true)

**状态转换**：
- 无伴侣 → 有伴侣（触发条件：恋爱/结婚/同居事件成功）
- 有伴侣 → 无伴侣（触发条件：分手/离婚事件）

---

### 2. 子女关系状态
```javascript
children: {
    hasChild: false,            // 是否有孩子(亲生/领养/继子女都算)
    childJoinAge: null,         // 孩子加入家庭时玩家年龄(亲生=出生年龄,领养=领养年龄)
    childLeftHome: false        // 孩子是否离家/独立
}
```

**说明**：
- ✅ 不区分亲生/领养/继子女 - 只要有孩子即可
- ✅ `childJoinAge`更灵活 - 支持领养已有年龄的孩子
- ✅ 不追踪孩子数量/性别 - 简化处理,文本用中性称呼

**动态计算**：
```javascript
// 孩子当前年龄 = 玩家当前年龄 - 孩子加入家庭时玩家年龄
childAge = character.age - children.childJoinAge
```

**年龄段判断**：
- 0-6岁：婴幼儿
- 7-12岁：儿童（小学）
- 13-18岁：青少年（中学）
- 18+岁：成年（可能离家）

---

### 3. 职业状态(暂未实现)
```javascript
career: {
    hasJob: false,              // 是否有工作
    isUnemployed: false         // 是否失业
}
```

**说明**：暂不追踪职业状态,保持系统简单

---

### 4. 经济状态(暂未实现)
```javascript
finance: {
    isBankrupt: false,          // 是否破产
    hasDebt: false              // 是否负债
}
```

**说明**：暂不追踪经济状态,保持系统简单

---

## 事件前置条件设计(v2.0)

### 前置条件字段
每个事件可包含：
```javascript
{
    id: 'event_id',
    prerequisites: {
        hasPartner: true,                   // 有伴侣(不管结婚与否)
        hasChild: true,                     // 有孩子(不管亲生/领养)
        childAgeRange: [13, 18],           // 孩子年龄范围
        NOT_childLeftHome: true,            // 孩子未离家
        partnerYears: { min: 5 }           // 有伴侣至少5年
        // ... 其他条件
    },
    effects: {
        // 事件触发后的状态改变
        hasPartner: true,                   // 获得伴侣
        partnerSince: 'current',            // 记录开始时间
        hasChild: true,                     // 获得孩子
        childJoinAge: 'current'             // 记录加入家庭时间
    }
}
```

### 前置条件示例(v2.0)

#### middle_n1: "儿子问梦想"
```javascript
prerequisites: {
    hasChild: true,
    childAgeRange: [13, 18]  // 孩子13-18岁（青少年）才会问哲学问题
}
```

#### middle_c1: "儿子沉迷游戏"
```javascript
prerequisites: {
    hasChild: true,
    childAgeRange: [7, 18],    // 孩子7-18岁（有学业）
    NOT_childLeftHome: true    // 孩子未离家
}
// 注意: 不要求hasPartner,单亲家庭也可能有此问题
```

#### young_c3: "对象逼婚"
```javascript
prerequisites: {
    hasPartner: false  // 无伴侣(单身/离异/丧偶都算)
},
effects: {
    // 如果选择"同意结婚/同居"且成功
    hasPartner: true,
    partnerSince: 'current'
}
```

#### middle_n4: "另一半问你当初为什么在一起"
```javascript
prerequisites: {
    hasPartner: true,          // 有伴侣(结婚/同居都算)
    partnerYears: { min: 5 }   // 在一起至少5年
}
// 文本修改: "老婆问为什么结婚" → "另一半问为什么在一起"
```

#### elder_c1: "资助孩子买房"
```javascript
prerequisites: {
    hasChild: true,
    childAge: { min: 22 }  // 孩子至少22岁（成年,有买房需求）
}
```

---

## 关键事件与状态改变

### 结婚事件
**触发事件**：young_c3 选择"同意结婚"且成功

**状态改变**：
```javascript
maritalStatus: {
    isMarried: true,
    marriageAge: character.age
}
```

**解锁事件**：
- 所有"老婆/老公"相关事件
- 生孩子相关事件（概率触发）

---

### 生孩子事件
**触发方式**：
1. 结婚后，每次年龄跳跃有概率自动触发（通过旁白事件）
2. 或通过选择事件"是否要孩子"

**状态改变**：
```javascript
children: {
    hasChild: true,
    childBirthAge: character.age,
    childCount: 1
}
```

**解锁事件**：
- 所有"儿子/女儿/孩子"相关事件（根据孩子年龄筛选）

---

### 离婚事件
**状态改变**：
```javascript
maritalStatus: {
    isMarried: false,
    isDivorced: true,
    divorceAge: character.age
}
```

**影响**：
- 锁定"老婆/老公"相关事件
- 孩子相关事件受影响（可能触发抚养权相关事件）

---

### 孩子离家事件
**触发条件**：middle_c1 选择"严格管教"失败

**状态改变**：
```javascript
children: {
    childLeftHome: true,
    childLeftAge: character.age
}
```

**影响**：
- 锁定需要"孩子在家"的事件
- 解锁"孩子离家后"的事件（如孩子回来要钱等）

---

## 实现方案

### 方案1：最小化实现（MVP）
**只追踪核心状态**：
- `isMarried` (boolean)
- `hasChild` (boolean)
- `childBirthAge` (number | null)

**筛选机制**：
```javascript
function canTriggerEvent(event, gameState) {
    if (!event.prerequisites) return true;

    const { isMarried, hasChild, childBirthAge } = gameState;
    const { maritalStatus, hasChild: needChild, childAgeRange } = event.prerequisites;

    // 检查婚姻状态
    if (maritalStatus === 'married' && !isMarried) return false;
    if (maritalStatus === 'single' && isMarried) return false;

    // 检查是否有孩子
    if (needChild && !hasChild) return false;

    // 检查孩子年龄
    if (childAgeRange && hasChild) {
        const childAge = character.age - childBirthAge;
        const [minAge, maxAge] = childAgeRange;
        if (childAge < minAge || childAge > maxAge) return false;
    }

    return true;
}
```

---

### 方案2：完整实现
包含所有状态变量，支持复杂的事件链和状态转换。

---

## 事件数据结构扩展

### 旁白事件扩展
```javascript
{
    id: 'young_n_married',
    type: 'narrative',
    ageGroup: 'young',

    // 新增：前置条件
    prerequisites: {
        maritalStatus: 'single',
        age: { min: 25 }  // 至少25岁
    },

    // 新增：状态改变
    effects: {
        maritalStatus: 'married',
        marriageAge: 'current'
    },

    text: '你在朋友的婚礼上认识了一个人。一年后，你们结婚了。',
    result: '婚礼很简单，但你很幸福。',

    death: { chance: 0, reason: '' },
    ageJump: { min: 1, max: 3 },
    attributes: { charm: +15, health: +10, luck: +10 }
}
```

### 选择事件扩展
```javascript
{
    id: 'young_c_have_child',
    type: 'choice',
    ageGroup: 'young',

    prerequisites: {
        maritalStatus: 'married',
        hasChild: false  // 还没有孩子
    },

    event: '你和另一半讨论要不要孩子。',

    choices: [
        {
            text: '要孩子',
            successRate: 0.7,
            success: {
                result: '一年后，你有了一个健康的宝宝。虽然辛苦，但很幸福。',
                attributes: { health: -10, charm: +20, luck: +15 },
                // 新增：状态改变
                effects: {
                    hasChild: true,
                    childBirthAge: 'current'
                }
            },
            failure: {
                result: '你们尝试了很久，但一直没有成功。最后选择了接受。',
                attributes: { health: -10, charm: -10 }
            }
        },
        {
            text: '暂时不要',
            successRate: 0.8,
            success: {
                result: '你们决定再过几年丁克生活。工作和生活都很自由。',
                attributes: { health: +10, intelligence: +15, luck: +10 }
            }
        }
    ]
}
```

---

## 实施优先级

### 第一阶段：标注现有事件
1. 遍历45个现有事件
2. 标注每个事件的 `prerequisites`
3. 标注重大事件的 `effects`
4. 识别逻辑冲突的事件

### 第二阶段：实现MVP状态系统
1. 在 `game.js` 中添加 `gameState` 对象
2. 实现 `canTriggerEvent()` 筛选函数
3. 实现 `applyEventEffects()` 状态更新函数
4. 修改 `selectEvent()` 集成状态筛选

### 第三阶段：添加自动触发事件
1. 创建"结婚"旁白事件（自动触发）
2. 创建"生孩子"旁白事件（自动触发）
3. 确保状态转换自然流畅

### 第四阶段：优化和扩展
1. 优化现有45个事件的趣味性
2. 添加10-15个高质量新事件
3. 大幅扩展事件库

---

## 需要添加的核心事件

### 结婚事件（自动触发）
```javascript
{
    id: 'auto_marriage_1',
    type: 'narrative',
    ageGroup: 'young',
    prerequisites: { maritalStatus: 'single', age: { min: 23 } },
    effects: { maritalStatus: 'married', marriageAge: 'current' },
    text: '你和交往多年的对象结婚了。',
    result: '婚礼很简单，但你很满意。亲朋好友都来祝福你。',
    triggerProbability: 0.3  // 每次事件有30%概率触发
}
```

### 生孩子事件（自动触发）
```javascript
{
    id: 'auto_child_birth_1',
    type: 'narrative',
    ageGroup: 'young',
    prerequisites: {
        maritalStatus: 'married',
        hasChild: false,
        marriedYears: { min: 1 }  // 结婚至少1年
    },
    effects: { hasChild: true, childBirthAge: 'current' },
    text: '你的孩子出生了。护士把小小的ta抱给你看。',
    result: '虽然很累，但看着孩子的脸，你觉得一切都值了。',
    triggerProbability: 0.4
}
```

---

## 注意事项

### 1. 避免过度复杂
- 不要设计过多状态变量
- 优先支持核心逻辑（婚姻、子女）
- 其他状态（职业、财富）可以暂缓

### 2. 保持游戏趣味性
- 状态系统是为了避免逻辑漏洞，不是限制玩家
- 不要让状态条件过于严格
- 保留一定的随机性和荒诞性

### 3. 文本自然流畅
- 即使有状态系统，文本仍要自然
- 避免机械化的"你的妻子"、"你的儿子"
- 保持"诙谐有趣"的风格

---

## 版本历史

- **v2.0** (2025-11-15) - 简化重构
  - **重大变更**: 用`hasPartner`替换`maritalStatus` - 支持未婚同居、未婚生子等
  - **重大变更**: 用`childJoinAge`替换`childBirthAge` - 支持领养、继子女等
  - 删除职业/经济状态追踪 - 保持系统简单
  - 更新所有前置条件示例
  - 强调"追踪关系存在而非法律状态"的设计原则

- **v1.0** (2025-11-15) - 初始设计
  - 定义核心状态变量（婚姻、子女、职业、经济）
  - 设计前置条件和状态改变机制
  - 规划MVP实施方案
  - 提供事件数据结构扩展示例
  - **问题**: 过于死板,排除了未婚同居、领养等情况
