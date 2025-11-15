// ===========================
// 文字人生 - 游戏配置文件
// ===========================
// 用于快速调整游戏参数，支持 A/B 测试和快速迭代

const GameConfig = {
    // 配置版本（用于 A/B 测试）
    version: 'v1.0',

    // ========== 年龄跳跃规则 ==========
    // 根据抖音用户画像（18-24岁占45%）优化年龄段体验
    ageJumpRules: {
        // 0-6岁（婴幼儿）- 低优先级，快速跳过
        baby: {
            minJump: 5,
            maxJump: 8,
            targetQuestions: 1  // 目标问题数
        },
        // 7-12岁（儿童）- 中等优先级
        child: {
            minJump: 3,
            maxJump: 5,
            targetQuestions: 2
        },
        // 13-18岁（青少年）- 高优先级 ⭐⭐⭐
        teen: {
            minJump: 1,
            maxJump: 2,
            targetQuestions: 5  // 4-5个问题
        },
        // 19-35岁（青年）- 最高优先级 ⭐⭐⭐
        // 抖音核心用户群，情感/职场内容重点
        young: {
            minJump: 1,
            maxJump: 3,
            targetQuestions: 7  // 6-8个问题
        },
        // 36-50岁（中年）- 中等优先级
        middle: {
            minJump: 3,
            maxJump: 5,
            targetQuestions: 4  // 3-4个问题
        },
        // 51-100岁（老年）- 低优先级
        elder: {
            minJump: 5,
            maxJump: 10,
            targetQuestions: 2  // 1-2个问题
        }
    },

    // ========== 年龄段定义 ==========
    ageGroups: {
        baby: { min: 0, max: 6 },
        child: { min: 7, max: 12 },
        teen: { min: 13, max: 18 },
        young: { min: 19, max: 35 },
        middle: { min: 36, max: 50 },
        elder: { min: 51, max: 100 }
    },

    // ========== 游戏节奏控制 ==========
    gameFlow: {
        // 目标游戏时长：3-5 分钟
        targetTotalQuestions: 19,  // 总计 16-22 个问题

        // 叙事事件触发概率（旁白事件）
        narrativeChance: {
            base: 0.08,      // 基础概率 8%
            ageModifier: {   // 年龄修正
                baby: 0.15,  // 婴儿期更多叙事（快速跳过）
                teen: 0.05,  // 青少年期减少叙事（更多选择）
                young: 0.03, // 青年期最少叙事（核心体验）
                middle: 0.08,
                elder: 0.12  // 老年期增加叙事
            }
        }
    },

    // ========== 角色初始属性 ==========
    characterStats: {
        health: { min: 30, max: 50 },
        intelligence: { min: 30, max: 50 },
        luck: { min: 30, max: 50 },
        charm: { min: 30, max: 50 }
    },

    // ========== 随机系统参数 ==========
    randomSystem: {
        // 属性反转概率（基础）
        reversalChance: 0.15,  // 15%

        // 世界混乱度范围
        worldChaos: {
            min: 0.2,
            max: 0.8,
            step: 0.05  // 每次随机游走的步长
        },

        // 连胜/连败阈值
        streakThreshold: {
            winning: 3,  // 连续3次好结果后增加反转概率
            losing: 2    // 连续2次坏结果后保护玩家
        },

        // 极端事件概率
        extremeEventChance: 0.05  // 5%
    },

    // ========== 死亡概率调整 ==========
    deathProbability: {
        // 突发死亡基础概率（受运气影响）
        suddenDeathBase: 0.01,  // 1%

        // 年龄段死亡修正
        ageModifier: {
            baby: 0.3,    // 婴儿脆弱
            child: 0.5,
            teen: 0.8,    // 青少年抗风险
            young: 1.0,
            middle: 1.2,
            elder: 2.0    // 老年高风险
        },

        // 健康值影响死亡概率
        healthModifier: {
            threshold: 30,  // 低于此值增加死亡风险
            multiplier: 1.5 // 低健康时死亡概率倍数
        }
    },

    // ========== 事件去重设置 ==========
    deduplication: {
        recentEventsCount: 5,      // 记录最近5个选择事件
        recentNarrativesCount: 7   // 记录最近7个旁白事件
    },

    // ========== A/B 测试配置 ==========
    // 如需测试不同参数，复制整个配置并修改 version
    abTest: {
        enabled: false,  // 是否启用 A/B 测试
        variants: {
            // 示例：激进版（更快节奏）
            aggressive: {
                version: 'v1.1-aggressive',
                ageJumpRules: {
                    young: { minJump: 2, maxJump: 5 }  // 青年期跳跃更快
                }
            },
            // 示例：保守版（更慢节奏）
            conservative: {
                version: 'v1.1-conservative',
                ageJumpRules: {
                    young: { minJump: 1, maxJump: 2 }  // 青年期跳跃更慢
                }
            }
        }
    }
};

// ===========================
// 辅助函数
// ===========================

// 根据年龄获取对应的年龄段
GameConfig.getAgeGroup = function(age) {
    for (const [groupName, range] of Object.entries(this.ageGroups)) {
        if (age >= range.min && age <= range.max) {
            return groupName;
        }
    }
    return 'elder';  // 默认返回老年
};

// 根据年龄获取跳跃范围
GameConfig.getAgeJump = function(age) {
    const ageGroup = this.getAgeGroup(age);
    const jumpRule = this.ageJumpRules[ageGroup];

    // 返回随机跳跃年数
    const min = jumpRule.minJump;
    const max = jumpRule.maxJump;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 获取叙事事件触发概率
GameConfig.getNarrativeChance = function(age) {
    const ageGroup = this.getAgeGroup(age);
    const baseChance = this.gameFlow.narrativeChance.base;
    const modifier = this.gameFlow.narrativeChance.ageModifier[ageGroup] || baseChance;
    return modifier;
};

// 获取死亡概率修正
GameConfig.getDeathModifier = function(age, health) {
    const ageGroup = this.getAgeGroup(age);
    let modifier = this.deathProbability.ageModifier[ageGroup] || 1.0;

    // 健康值修正
    if (health < this.deathProbability.healthModifier.threshold) {
        modifier *= this.deathProbability.healthModifier.multiplier;
    }

    return modifier;
};

// 如果在浏览器环境中，暴露到全局
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
}

// 如果在 Node.js 环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
