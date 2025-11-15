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
        // 目标：20次选择约4次旁白（平均20%）
        narrativeChance: {
            baby: 0.25,    // 25% - 婴儿期多用旁白快速跳过
            child: 0.15,   // 15%
            teen: 0.10,    // 10% - 青少年期减少旁白，增加选择
            young: 0.15,   // 15% - 核心年龄段也要有旁白丰富度
            middle: 0.20,  // 20%
            elder: 0.25    // 25% - 老年期多用旁白快速收尾
        }
    },

    // ========== 角色初始属性 ==========
    // 设计原则："低初始值，高改变值"
    // - 初始差异小（5-15）→ 公平性
    // - 变化幅度大（±10-20）→ 体现选择重要性
    characterStats: {
        health: { min: 5, max: 15 },
        intelligence: { min: 5, max: 15 },
        luck: { min: 5, max: 15 },
        charm: { min: 5, max: 15 }
    },

    // ========== 事件系统参数 ==========
    eventSystem: {
        // 反转事件触发概率
        // 在选择成功后，有15%概率触发反转事件
        // 目的：让玩家无法认定"安全选项"
        reversalChance: 0.15,  // 15%

        // 事件权重（影响出现频率）
        attractivenessWeight: {
            high: 10,      // 高吸引力事件（恋爱/职场/暴富）
            medium: 5,     // 中等吸引力事件
            low: 2         // 低吸引力事件
        },

        // 内容分类权重（按年龄段动态调整）
        categoryWeightByAge: {
            teen: {
                love: 2.0,      // 恋爱类事件权重 × 2
                school: 1.5,    // 校园类事件权重 × 1.5
                career: 0.3     // 职场类事件权重 × 0.3（几乎不出现）
            },
            young: {
                love: 1.3,
                career: 1.8,    // 职场类事件权重 × 1.8
                money: 1.5,     // 暴富类事件权重 × 1.5
                friendship: 1.0
            },
            middle: {
                family: 1.8,    // 家庭类事件权重 × 1.8
                career: 1.3,
                money: 1.2
            }
        },

        // 事件去重窗口大小
        deduplication: {
            choiceEvents: 15,      // 选择事件去重窗口(扩大到15,保证102岁游戏不重复)
            narrativeEvents: 20    // 旁白事件去重窗口(扩大到20)
        },

        // 属性影响系统
        attributeInfluence: {
            enabled: true,        // 是否启用属性影响
            maxBonus: 0.30,       // 最大影响幅度 ±30%

            // 哪些属性影响哪些事件
            mapping: {
                love: 'charm',           // 恋爱事件受魅力影响
                career: 'intelligence',  // 职场事件受智力影响
                money: 'luck',           // 暴富事件受运气影响
                family: 'charm'          // 家庭事件受魅力影响
            }
        }
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
    return this.gameFlow.narrativeChance[ageGroup] || 0.15;  // 默认15%
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
