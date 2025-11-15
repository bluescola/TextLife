// ============================================
// 文字人生 - 事件数据库
// ============================================
// 基于 framework/event.md 和 distribution.md 设计

const GameEvents = {
    // ============================================
    // 旁白事件（Narrative Events）
    // ============================================
    // 特点：无选择，纯文本，体现"命运的不可控"
    // 风格：诙谐有趣、黑色幽默、生活化但夸张

    narrativeEvents: [
        // ========== 婴儿期（0-6岁）==========
        {
            id: 'baby_n1',
            type: 'narrative',
            ageGroup: 'baby',
            attractiveness: 'medium',
            category: 'family',

            text: '你出生了！医生说你是他见过最丑的婴儿。你妈听了很生气，但看了你一眼后选择了沉默。',
            result: '你获得了"诚实"这个特质，虽然没人在乎。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 5, max: 8 },
            attributes: {
                charm: -5,
                health: +10
            }
        },
        {
            id: 'baby_n2',
            type: 'narrative',
            ageGroup: 'baby',
            attractiveness: 'high',
            category: 'family',

            text: '你第一次说话。所有人都很激动地围过来。然后你说："爸爸是个秃子。"',
            result: '全家陷入了沉默。你爸默默走向了卫生间。',

            death: {
                chance: 0.08,
                reason: '你爸气得心脏病发作，顺便把你也带走了。'
            },

            ageJump: { min: 5, max: 8 },
            attributes: {
                intelligence: +5,
                charm: -10
            }
        },

        // ========== 儿童期（7-12岁）==========
        {
            id: 'child_n1',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'medium',
            category: 'school',

            text: '老师让大家说说理想。同学们说想当科学家、医生、警察。',
            result: '你说想当"有钱人"。老师说你没有理想，但你觉得这是最实际的理想。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                intelligence: +5,
                luck: +5
            }
        },
        {
            id: 'child_n2',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'low',
            category: 'daily',

            text: '你捡到一张皱巴巴的5块钱。你犹豫了30秒要不要交给老师。',
            result: '最后你选择了买辣条。这是你人生中做出的最正确的决定之一。',

            death: {
                chance: 0.06,
                reason: '辣条太辣，你被辣死了。死前你觉得值了。'
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                health: -5,
                luck: +10
            }
        },

        // ========== 青少年期（13-18岁）==========
        {
            id: 'teen_n1',
            type: 'narrative',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'love',

            text: '你暗恋的人路过你身边时，你假装若无其事地看向窗外，结果一头撞在了门框上。',
            result: '全班爆笑。你的暗恋对象笑得最大声。这段暗恋到此结束。',

            death: {
                chance: 0.10,
                reason: '撞击力度过大，脑震荡致死。死前你听到了ta的笑声。'
            },

            ageJump: { min: 1, max: 2 },
            attributes: {
                charm: -15,
                health: -10
            }
        },
        {
            id: 'teen_n2',
            type: 'narrative',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'school',

            text: '考试前一天，你发誓这次一定要好好复习。然后你打开了手机，准备先放松5分钟。',
            result: '5分钟变成了5小时。你悟出了一个道理：自制力是个伪概念。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 2 },
            attributes: {
                intelligence: -10,
                luck: -5
            }
        },

        // ========== 青年期（19-35岁）==========
        {
            id: 'young_n1',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'career',

            text: '加班到凌晨2点，老板在群里发消息："大家辛苦了！"你想回复点什么。',
            result: '最后你只发了个"👍"。这就是成年人的世界：所有的不满都浓缩在一个emoji里。',

            death: {
                chance: 0.12,
                reason: '过度劳累猝死。老板在你的追悼会上说："这孩子真是太拼了。"'
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                health: -15,
                intelligence: +10
            }
        },
        {
            id: 'young_n2',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'medium',
            category: 'love',

            text: '相亲对象问你有房吗？你说没有。问你有车吗？你说没有。问你有存款吗？你说...',
            result: '对方的手机突然响了。她说"不好意思我妈找我有急事"，然后消失在了茫茫人海中。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                charm: -10,
                luck: -10
            }
        },
        {
            id: 'young_n3',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'money',

            text: '你在路边捡到一张彩票。回家一查，中了5000元！你激动地整夜失眠。',
            result: '第二天早上醒来发现彩票不见了。你怀疑是被风吹走了，但更怀疑自己根本没捡到过。',

            death: {
                chance: 0.09,
                reason: '悲伤到心脏病突发。死前你还在找那张彩票。'
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                luck: -20,
                health: -10
            }
        },

        // ========== 中年期（36-50岁）==========
        {
            id: 'middle_n1',
            type: 'narrative',
            ageGroup: 'middle',
            attractiveness: 'medium',
            category: 'family',

            text: '你儿子问："爸，什么是梦想？"你想起自己年轻时也有过梦想。',
            result: '但现在你只想着房贷车贷和下个月的绩效。你说："梦想就是...好好学习。"',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                intelligence: +5,
                charm: -5
            }
        },
        {
            id: 'middle_n2',
            type: 'narrative',
            ageGroup: 'middle',
            attractiveness: 'low',
            category: 'daily',

            text: '体检报告出来了。医生指着一堆箭头说："你这个高，那个低，这个也不太好..."',
            result: '你点点头表示知道了。出门后直奔烧烤摊，点了一堆啤酒和烤串。',

            death: {
                chance: 0.13,
                reason: '各种慢性病叠加致死。医生说早就提醒过你了。'
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                health: -20,
                luck: +5
            }
        },

        // ========== 老年期（51-100岁）==========
        {
            id: 'elder_n1',
            type: 'narrative',
            ageGroup: 'elder',
            attractiveness: 'low',
            category: 'daily',

            text: '你在公园下棋。一群老头围观，纷纷指点："这步不对！""应该走那边！"',
            result: '你说："那你来下！"他们都说："我不会下，但我看得出你下错了。"',

            death: {
                chance: 0.11,
                reason: '被气得中风。死前你想说："我*&%#@..."'
            },

            ageJump: { min: 5, max: 10 },
            attributes: {
                health: -10,
                intelligence: +5
            }
        },
        {
            id: 'elder_n2',
            type: 'narrative',
            ageGroup: 'elder',
            attractiveness: 'medium',
            category: 'family',

            text: '孙子问你年轻时候的故事。你想了想，决定给他讲一个"美化版"的人生。',
            result: '讲到激动处，你都快相信自己真的那么厉害了。孙子听得津津有味。',

            death: {
                chance: 0.15,
                reason: '说到激动处，心脏病发作。但你死得很满足，因为孙子相信了你的故事。'
            },

            ageJump: { min: 5, max: 10 },
            attributes: {
                charm: +10,
                intelligence: -5
            }
        },

        // ========== 新增事件 - 婴儿期 ==========
        {
            id: 'baby_n3',
            type: 'narrative',
            ageGroup: 'baby',
            attractiveness: 'high',
            category: 'family',

            text: '你学会走路了,但刚走两步就摔了个屁股蹲。你爸拿出手机狂拍,笑得前仰后合。',
            result: '十年后,你发现这段视频被你爸发到了家族群,并被设为群头像。',

            death: {
                chance: 0.05,
                reason: '摔倒时头部着地,当场去世。你爸还在拍视频。'
            },

            ageJump: { min: 4, max: 7 },
            attributes: {
                health: -5,
                charm: -10
            }
        },
        {
            id: 'baby_n4',
            type: 'narrative',
            ageGroup: 'baby',
            attractiveness: 'high',
            category: 'daily',

            text: '你在幼儿园尿裤子了。老师叫你去换裤子,你死活不去。',
            result: '最后老师当众把你扒了换裤子。从此你有了童年阴影。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 4, max: 7 },
            attributes: {
                charm: -15,
                health: -5
            }
        },
        {
            id: 'baby_n5',
            type: 'narrative',
            ageGroup: 'baby',
            attractiveness: 'medium',
            category: 'family',

            text: '你第一次自己吃饭。你把饭菜往嘴里塞,结果一半进嘴里,一半糊脸上。',
            result: '你妈给你拍了照,十五年后这张照片成了她朋友圈的表情包。配文:"当年的你,现在的我。"',

            death: {
                chance: 0.02,
                reason: '被食物噎死。你妈还在拍照。'
            },

            ageJump: { min: 4, max: 7 },
            attributes: {
                health: -3,
                charm: -8
            }
        },

        // ========== 新增事件 - 儿童期 ==========
        {
            id: 'child_n3',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'high',
            category: 'school',

            text: '你在课堂上打瞌睡,老师叫你起来回答问题。你迷迷糊糊地站起来喊了声"到!"',
            result: '全班哄堂大笑。老师让你站了一节课。你成了班级名人。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 2, max: 4 },
            attributes: {
                intelligence: -10,
                charm: -5,
                luck: +5
            }
        },
        {
            id: 'child_n4',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'medium',
            category: 'daily',

            text: '妈妈说要带你去游乐园。你兴奋了一整天,结果到了才发现是去打疫苗。',
            result: '从此你再也不相信妈妈的话了。你悟出了一个道理:成年人会骗人。',

            death: {
                chance: 0.03,
                reason: '疫苗过敏,抢救无效。'
            },

            ageJump: { min: 2, max: 4 },
            attributes: {
                intelligence: +10,
                luck: -5
            }
        },
        {
            id: 'child_n5',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'high',
            category: 'family',

            text: '你偷拿了家里的钱去买玩具。回家后妈妈问你钱是不是你拿的。',
            result: '你说："不是我拿的,是我借的。"妈妈被你的逻辑气笑了,然后揍了你一顿。',

            death: {
                chance: 0.08,
                reason: '被打得太狠,不治身亡。'
            },

            ageJump: { min: 2, max: 4 },
            attributes: {
                intelligence: +5,
                health: -10,
                charm: -5
            }
        },
        {
            id: 'child_n6',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'high',
            category: 'school',

            text: '班上转来一个新同学。老师让他自我介绍。他说："我叫王富贵,我家很有钱。"',
            result: '从那以后,全班同学都围着他转。你悟出了一个道理:有钱真好。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 2, max: 4 },
            attributes: {
                intelligence: +8,
                luck: -5
            }
        },
        {
            id: 'child_n7',
            type: 'narrative',
            ageGroup: 'child',
            attractiveness: 'medium',
            category: 'daily',

            text: '你和邻居小孩打架,被他妈看到了。她冲过来要打你。',
            result: '你妈赶到,两个大人吵了起来。最后你们两家从此不再来往。你和那个小孩成了塑料敌人。',

            death: {
                chance: 0.05,
                reason: '被打成重伤,抢救无效。'
            },

            ageJump: { min: 2, max: 4 },
            attributes: {
                health: -8,
                charm: -10,
                luck: -3
            }
        },

        // ========== 新增事件 - 青少年期 ==========
        {
            id: 'teen_n3',
            type: 'narrative',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'school',

            text: '你在QQ空间发了一条很中二的说说："这个世界,我终将征服。"配图是夕阳。',
            result: '三年后你想删,发现已经有87条评论。全是同学在笑你。你默默设为仅自己可见。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 2 },
            attributes: {
                charm: -12,
                intelligence: +5
            }
        },
        {
            id: 'teen_n4',
            type: 'narrative',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'love',

            text: '你给暗恋的人写了一封情书,托同学转交。结果那个同学当众念了出来。',
            result: '全班都知道了。你的暗恋对象只是尴尬地笑了笑。你从此不敢抬头看人。',

            death: {
                chance: 0.07,
                reason: '羞愧难当,跳楼自杀。'
            },

            ageJump: { min: 1, max: 2 },
            attributes: {
                charm: -20,
                health: -10,
                luck: -8
            }
        },
        {
            id: 'teen_n5',
            type: 'narrative',
            ageGroup: 'teen',
            attractiveness: 'medium',
            category: 'daily',

            text: '你上课偷偷玩手机,突然手机响了。是你妈打来的。全班都看着你。',
            result: '老师让你当众接电话。你妈在电话里问："吃晚饭了吗？"全班爆笑。手机被没收一个月。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 2 },
            attributes: {
                charm: -15,
                intelligence: -8,
                luck: -10
            }
        },

        // ========== 新增事件 - 青年期 ==========
        {
            id: 'young_n4',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'career',

            text: '你在会议上提了一个建议。老板说："这个想法不错,但不适合我们。"',
            result: '三个月后,公司推行了你的建议,但归功于另一个同事。你什么都没说,继续工作。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                intelligence: +8,
                charm: -10,
                luck: -12
            }
        },
        {
            id: 'young_n5',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'money',

            text: '你网购了一件衣服,模特图超好看。收到货后你打开包装...',
            result: '买家秀和卖家秀的差距让你怀疑人生。但是退货运费要20块,你想了想还是穿吧。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                charm: -8,
                luck: -5
            }
        },
        {
            id: 'young_n6',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'medium',
            category: 'daily',

            text: '你在地铁上看到一个座位,刚想坐,发现座位上有一滩不明液体。',
            result: '你站了一路。到站时发现那是洒的奶茶。你觉得自己很蠢。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                health: -5,
                luck: -8
            }
        },
        {
            id: 'young_n7',
            type: 'narrative',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'love',

            text: '你的朋友们都结婚了。他们问你："什么时候轮到你？"',
            result: '你笑着说："快了快了。"然后回家打开外卖APP,点了一份单人餐。',

            death: {
                chance: 0.06,
                reason: '孤独死。一周后才被发现。'
            },

            ageJump: { min: 1, max: 3 },
            attributes: {
                charm: -10,
                health: -8,
                luck: -10
            }
        },

        // ========== 新增事件 - 中年期 ==========
        {
            id: 'middle_n3',
            type: 'narrative',
            ageGroup: 'middle',
            attractiveness: 'high',
            category: 'daily',

            text: '你去参加同学聚会。大家都在吹嘘自己多成功。轮到你时,你不知道说什么。',
            result: '你说："我挺好的,工作稳定,家庭和睦。"然后一片沉默。你知道,这在他们眼里就是"混得不好"的委婉说法。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                charm: -12,
                intelligence: +5
            }
        },
        {
            id: 'middle_n4',
            type: 'narrative',
            ageGroup: 'middle',
            attractiveness: 'medium',
            category: 'family',

            text: '你老婆问你："我们当初为什么结婚？"你想了很久,想不起来了。',
            result: '你说："因为爱情吧。"她笑了笑,没再说话。你们都知道,那已经是很久以前的事了。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                charm: -8,
                health: -5
            }
        },
        {
            id: 'middle_n5',
            type: 'narrative',
            ageGroup: 'middle',
            attractiveness: 'low',
            category: 'career',

            text: '公司来了一批95后。他们聊的梗你一个都不懂。你试着加入话题。',
            result: '他们礼貌地笑了笑,然后继续聊天,就像你不存在一样。你意识到,你老了。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 3, max: 5 },
            attributes: {
                charm: -10,
                intelligence: -5,
                health: -3
            }
        },

        // ========== 新增事件 - 老年期 ==========
        {
            id: 'elder_n3',
            type: 'narrative',
            ageGroup: 'elder',
            attractiveness: 'medium',
            category: 'daily',

            text: '你在公园遛弯,看到一群年轻人在跳广场舞。你觉得很吵。',
            result: '你走过去想说几句,但想起自己年轻时也觉得老人多管闲事。你转身离开了。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 5, max: 10 },
            attributes: {
                intelligence: +8,
                health: -5
            }
        },
        {
            id: 'elder_n4',
            type: 'narrative',
            ageGroup: 'elder',
            attractiveness: 'low',
            category: 'family',

            text: '孙子教你用智能手机。你学了半天还是不会。他有点不耐烦了。',
            result: '你说："算了算了,你去玩吧。"孙子如释重负地跑了。你看着手机,不知道按哪里。',

            death: {
                chance: 0,
                reason: ''
            },

            ageJump: { min: 5, max: 10 },
            attributes: {
                intelligence: -8,
                charm: -10,
                health: -5
            }
        },
        {
            id: 'elder_n5',
            type: 'narrative',
            ageGroup: 'elder',
            attractiveness: 'high',
            category: 'daily',

            text: '你在整理旧物时,翻出了年轻时的照片。那时的你意气风发,充满梦想。',
            result: '你看着镜子里的自己,白发苍苍,满脸皱纹。你想:这都是谁啊？然后笑了笑,把照片收好。',

            death: {
                chance: 0.10,
                reason: '感慨万千,心脏病突发。'
            },

            ageJump: { min: 5, max: 10 },
            attributes: {
                intelligence: +10,
                charm: -5,
                health: -8
            }
        }
    ],

    // ============================================
    // 选择事件（Choice Events）
    // ============================================
    // 特点：提供2-3个选择，有明确的成功/失败结果
    // 设计：高吸引力事件为主（60-70%）

    choiceEvents: [
        // ========== 婴儿期（0-6岁）==========
        {
            id: 'baby_c1',
            type: 'choice',
            ageGroup: 'baby',
            attractiveness: 'medium',
            category: 'family',

            event: '幼儿园老师说要选一个小朋友当"小班长"。你妈让你举手。',

            choices: [
                {
                    text: '乖乖举手',
                    successRate: 0.5,
                    success: {
                        result: '老师选了你！虽然你根本不知道班长是干嘛的。',
                        attributes: { charm: +10, intelligence: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '第二天，因为你上课尿裤子，老师把你的班长职位撤了。',
                            attributes: { charm: -15, health: -5 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '老师没选你。你回家哭了一晚上。',
                        attributes: { charm: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '躲在桌子底下',
                    successRate: 0.3,
                    success: {
                        result: '老师没注意到你。你逃过一劫，开心地吃手指。',
                        attributes: { luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但是你卡在桌子下面出不来了。全班笑了一节课。',
                            attributes: { charm: -20, luck: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '老师把你揪出来，当众批评了你。',
                        attributes: { charm: -10, health: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                }
            ],

            ageJump: { min: 5, max: 8 }
        },

        // ========== 儿童期（7-12岁）==========
        {
            id: 'child_c1',
            type: 'choice',
            ageGroup: 'child',
            attractiveness: 'high',
            category: 'school',

            event: '期末考试，你前面的同学转过头来用口型问你答案。监考老师正好在看手机。',

            choices: [
                {
                    text: '告诉他答案',
                    successRate: 0.6,
                    success: {
                        result: '他考了98分，请你喝了一瓶汽水。你收获了一个好朋友。',
                        attributes: { charm: +15, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '结果老师发现你俩答案一模一样，连错的都一样。你们都被叫家长了。',
                            attributes: { intelligence: -15, charm: -10 },
                            death: {
                                chance: 0.15,
                                reason: '你爸知道后气得动手了。失手把你打死了。'
                            }
                        }
                    },
                    failure: {
                        result: '老师抬头了，你们被当场抓住。两个人都得了0分。',
                        attributes: { intelligence: -20, charm: -15 },
                        death: {
                            chance: 0.18,
                            reason: '回家后被混合双打，不治身亡。'
                        }
                    }
                },
                {
                    text: '摇头拒绝',
                    successRate: 0.8,
                    success: {
                        result: '他虽然不高兴，但老师夸了你诚实。你感到内心很平静。',
                        attributes: { intelligence: +10, charm: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '下课后他带了一群人堵你。你被打了一顿。',
                            attributes: { health: -15, charm: -10 },
                            death: {
                                chance: 0.12,
                                reason: '被打成重伤，抢救无效。'
                            }
                        }
                    },
                    failure: {
                        result: '他很生气，放学后把你的作业本撕了。',
                        attributes: { charm: -10 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '告诉他错误答案',
                    successRate: 0.5,
                    success: {
                        result: '他考砸了，但没怀疑你。你暗自窃喜，成绩排名上升了一位。',
                        attributes: { intelligence: +15, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但是你自己也写错了。你告诉他的"错误答案"其实是对的。你考得比他还差。',
                            attributes: { intelligence: -20, luck: -15 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '他发现你故意骗他，当众揭穿了你。你成了全班公敌。',
                        attributes: { charm: -20, health: -10 },
                        death: {
                            chance: 0.20,
                            reason: '被全班孤立，抑郁自杀。'
                        }
                    }
                }
            ],

            ageJump: { min: 3, max: 5 }
        },

        // ========== 青少年期（13-18岁）==========
        {
            id: 'teen_c1',
            type: 'choice',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'love',

            event: '你喜欢的人生日，你想送礼物。你攒了一个月的零花钱，有200块。',

            choices: [
                {
                    text: '买一束玫瑰花（150元）',
                    successRate: 0.4,
                    success: {
                        result: 'Ta很惊喜，收下了花，还给了你一个拥抱。你感觉整个世界都亮了。',
                        attributes: { charm: +20, luck: +15 },
                        reversal: {
                            chance: 0.15,
                            text: '晚上你兴奋得睡不着，刷朋友圈时看到Ta发了条动态："今天收到好朋友的花~谢谢~"配图是你送的花。你被发了好人卡。',
                            attributes: { charm: -25, health: -15 },
                            death: {
                                chance: 0.15,
                                reason: '心碎致死。真的，心脏停了。'
                            }
                        }
                    },
                    failure: {
                        result: 'Ta尴尬地说："我们还是做朋友吧。"你手里的花突然变得很重。',
                        attributes: { charm: -15, health: -10 },
                        death: {
                            chance: 0.12,
                            reason: '羞愧难当，跳楼自杀。'
                        }
                    }
                },
                {
                    text: '买一本精美的笔记本（50元）',
                    successRate: 0.7,
                    success: {
                        result: 'Ta觉得很实用，开心地收下了。你们的关系更近了一步。',
                        attributes: { charm: +15, intelligence: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但你后来发现Ta把本子转手送给了别人。你在走廊听到Ta说："我有很多本子了，送人正好。"',
                            attributes: { charm: -10, luck: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: 'Ta说谢谢，但你能看出Ta并不喜欢。气氛很尴尬。',
                        attributes: { charm: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '什么都不买，省下钱',
                    successRate: 0.3,
                    success: {
                        result: '你只是发了条祝福短信。意外的是，Ta回复说："你是唯一记得我生日的人。"',
                        attributes: { luck: +20, charm: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但第二天Ta在朋友圈晒了收到的一堆礼物，配文："生日快乐自己~"完全没提你的短信。你的祝福被淹没了。',
                            attributes: { luck: -15, charm: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: 'Ta很失望，觉得你不重视Ta。你们的关系冷淡了下来。',
                        attributes: { charm: -20, luck: -10 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                }
            ],

            ageJump: { min: 1, max: 2 }
        },
        {
            id: 'teen_c2',
            type: 'choice',
            ageGroup: 'teen',
            attractiveness: 'high',
            category: 'school',

            event: '班主任要选课代表。你成绩中等，但你知道课代表能经常和老师接触，说不定能提分。',

            choices: [
                {
                    text: '积极举手竞选',
                    successRate: 0.5,
                    success: {
                        result: '老师选了你！虽然很累，但你的成绩确实提高了。',
                        attributes: { intelligence: +20, charm: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但每天收发作业太累了，反而影响了自己的学习。期末考试你退步了10名。',
                            attributes: { intelligence: -15, health: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '老师选了成绩更好的同学。你有点失落。',
                        attributes: { charm: -10 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '保持低调',
                    successRate: 0.8,
                    success: {
                        result: '你继续默默学习。虽然没当上课代表，但成绩稳步提升。',
                        attributes: { intelligence: +15, health: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但老师觉得你不积极，故意在课堂上为难你。你的信心受挫。',
                            attributes: { intelligence: -10, charm: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '你太低调了，老师甚至不记得你的名字。',
                        attributes: { charm: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                }
            ],

            ageJump: { min: 1, max: 2 }
        },

        // ========== 青年期（19-35岁）==========
        {
            id: 'young_c1',
            type: 'choice',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'career',

            event: '老板私下问你愿不愿意去新开的分公司当主管。工资翻倍，但要去外地，而且风险很大。',

            choices: [
                {
                    text: '接受挑战',
                    successRate: 0.4,
                    success: {
                        result: '分公司经营得很好！你升职加薪，成为了年轻的管理层。',
                        attributes: { intelligence: +20, charm: +15, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但一年后集团战略调整，分公司被关停。你被裁员，还被要求承担部分亏损，背上了沉重债务。',
                            attributes: { health: -20, luck: -20, intelligence: -10 },
                            death: {
                                chance: 0.18,
                                reason: '债务压力过大，跳楼自杀。'
                            }
                        }
                    },
                    failure: {
                        result: '分公司半年后就倒闭了。你失业了，还浪费了半年时间。',
                        attributes: { luck: -15, health: -10, intelligence: -5 },
                        death: {
                            chance: 0.15,
                            reason: '压力过大，猝死。'
                        }
                    }
                },
                {
                    text: '婉拒offer',
                    successRate: 0.7,
                    success: {
                        result: '你留在了本部，稳定发展。虽然升职慢，但至少安全。',
                        attributes: { health: +10, luck: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但老板觉得你不思进取，后来的晋升机会都不考虑你了。',
                            attributes: { intelligence: -15, charm: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '老板觉得你没野心，开始冷落你。你在公司的地位越来越尴尬。',
                        attributes: { charm: -10, intelligence: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                }
            ],

            ageJump: { min: 1, max: 3 }
        },
        {
            id: 'young_c2',
            type: 'choice',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'money',

            event: '你的大学同学找你合伙做生意，需要投资10万。他说稳赚，但你只有15万存款。',

            choices: [
                {
                    text: '投资10万',
                    successRate: 0.3,
                    success: {
                        result: '生意很成功！一年后你赚了50万，实现了财务自由的第一步。',
                        attributes: { luck: +25, intelligence: +15, charm: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但第二年你的同学卷款跑路了。公司账目一片混乱，债主找上门来。你不仅赔光了赚的钱，还倒欠一屁股债。',
                            attributes: { luck: -30, health: -20, intelligence: -10 },
                            death: {
                                chance: 0.20,
                                reason: '被债主逼死。'
                            }
                        }
                    },
                    failure: {
                        result: '生意失败，血本无归。你损失了10万，只剩下5万存款。',
                        attributes: { luck: -20, health: -15, intelligence: -5 },
                        death: {
                            chance: 0.18,
                            reason: '承受不了打击，自杀身亡。'
                        }
                    }
                },
                {
                    text: '只投5万',
                    successRate: 0.5,
                    success: {
                        result: '生意还不错，你赚了15万。虽然没同学赚得多,但风险小。',
                        attributes: { luck: +15, intelligence: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但第二年行业监管收紧，公司被查出违规经营。你被牵连，不仅吐出了赚的钱，还倒赔了5万。',
                            attributes: { luck: -10, health: -5 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '生意失败，你亏了5万。至少还剩10万。',
                        attributes: { luck: -10, health: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '拒绝投资',
                    successRate: 0.7,
                    success: {
                        result: '你保住了15万存款。后来发现那个生意是骗局，你逃过一劫。',
                        attributes: { intelligence: +20, luck: +15 },
                        reversal: {
                            chance: 0.15,
                            text: '但一年后你偶然得知，那个生意爆火了。你的同学已经赚了500万，在朋友圈晒豪车。你后悔不已。',
                            attributes: { luck: -15, intelligence: -10 },
                            death: {
                                chance: 0.12,
                                reason: '后悔到抑郁自杀。'
                            }
                        }
                    },
                    failure: {
                        result: '你的同学觉得你不信任他，从此不再联系你。',
                        attributes: { charm: -10 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                }
            ],

            ageJump: { min: 1, max: 3 }
        },
        {
            id: 'young_c3',
            type: 'choice',
            ageGroup: 'young',
            attractiveness: 'high',
            category: 'love',

            event: '你交往3年的对象突然说："我们结婚吧，不然就分手。"但你还没准备好。',

            choices: [
                {
                    text: '同意结婚',
                    successRate: 0.6,
                    success: {
                        result: '婚后生活虽然琐碎，但你们很幸福。你觉得这个决定是对的。',
                        attributes: { charm: +15, health: +10, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但两年后Ta开始频繁加班晚归。你发现蛛丝马迹，原来Ta早就出轨了。离婚时你人财两空。',
                            attributes: { health: -20, luck: -20, charm: -15 },
                            death: {
                                chance: 0.15,
                                reason: '离婚纠纷中被对方家人打死。'
                            }
                        }
                    },
                    failure: {
                        result: '仓促结婚导致矛盾重重。你们不到一年就离婚了。',
                        attributes: { health: -15, luck: -15, charm: -10 },
                        death: {
                            chance: 0.13,
                            reason: '离婚后抑郁自杀。'
                        }
                    }
                },
                {
                    text: '请求再等一年',
                    successRate: 0.5,
                    success: {
                        result: 'Ta同意了。这一年你们更加了解彼此，最终幸福地结婚了。',
                        attributes: { intelligence: +15, charm: +15, luck: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但半年后Ta告诉你，Ta遇到了更合适的人。这一年的等待成了笑话，Ta头也不回地离开了。',
                            attributes: { charm: -20, health: -15 },
                            death: {
                                chance: 0.15,
                                reason: '心碎致死。'
                            }
                        }
                    },
                    failure: {
                        result: 'Ta觉得你在拖延，直接跟你分手了。',
                        attributes: { charm: -15, health: -10 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '果断分手',
                    successRate: 0.7,
                    success: {
                        result: '你坚持了自己的想法。虽然痛苦,但你觉得这样对双方都好。',
                        attributes: { intelligence: +15, health: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但多年后你辗转听说，Ta后来过得很幸福。而你经历了无数次相亲，再也没找到这么好的人。你后悔了。',
                            attributes: { luck: -15, charm: -10 },
                            death: {
                                chance: 0,
                                reason: ''
                            }
                        }
                    },
                    failure: {
                        result: '分手后你才发现Ta有多好。但已经回不去了。',
                        attributes: { charm: -10, health: -10, luck: -5 },
                        death: {
                            chance: 0.10,
                            reason: '后悔莫及，抑郁自杀。'
                        }
                    }
                }
            ],

            ageJump: { min: 1, max: 3 }
        },

        // ========== 中年期（36-50岁）==========
        {
            id: 'middle_c1',
            type: 'choice',
            ageGroup: 'middle',
            attractiveness: 'high',
            category: 'family',

            event: '你儿子沉迷游戏，成绩一落千丈。老师建议你多陪陪孩子，但你工作很忙。',

            choices: [
                {
                    text: '辞职在家陪孩子',
                    successRate: 0.4,
                    success: {
                        result: '你的陪伴让孩子重拾学习兴趣。他考上了重点高中。你觉得值了。',
                        attributes: { charm: +20, health: +10, intelligence: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但失去工作后家庭经济陷入困境。孩子因为压力反而更叛逆了。',
                            attributes: { health: -20, luck: -15, charm: -10 },
                            death: {
                                chance: 0.14,
                                reason: '经济压力过大，心脏病突发。'
                            }
                        }
                    },
                    failure: {
                        result: '你的陪伴没有效果，孩子依然沉迷游戏。你还失去了工作。',
                        attributes: { luck: -15, health: -15, intelligence: -5 },
                        death: {
                            chance: 0.15,
                            reason: '双重打击下心脏病发作。'
                            }
                    }
                },
                {
                    text: '请私教辅导',
                    successRate: 0.6,
                    success: {
                        result: '私教很负责，孩子成绩慢慢提高了。虽然花了不少钱，但有效果。',
                        attributes: { intelligence: +15, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但私教跟你老婆跑了，还卷走了你的钱。',
                            attributes: { luck: -25, health: -20, charm: -15 },
                            death: {
                                chance: 0.20,
                                reason: '气急攻心，当场去世。'
                            }
                        }
                    },
                    failure: {
                        result: '私教没什么用，只是骗钱的。孩子成绩依然很差。',
                        attributes: { luck: -10, intelligence: -5 },
                        death: {
                            chance: 0,
                            reason: ''
                        }
                    }
                },
                {
                    text: '严格管教',
                    successRate: 0.5,
                    success: {
                        result: '你采取了强硬手段，没收手机，制定学习计划。孩子虽然抗拒但成绩确实提高了。',
                        attributes: { intelligence: +15, charm: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但孩子因此记恨你，成年后跟你断绝了关系。',
                            attributes: { charm: -20, health: -15 },
                            death: {
                                chance: 0.12,
                                reason: '晚年孤独抑郁而死。'
                            }
                        }
                    },
                    failure: {
                        result: '孩子反叛心更强了，离家出走。你后悔不已。',
                        attributes: { charm: -15, health: -15, luck: -10 },
                        death: {
                            chance: 0.17,
                            reason: '愧疚到心脏病发作。'
                        }
                    }
                }
            ],

            ageJump: { min: 3, max: 5 }
        },
        {
            id: 'middle_c2',
            type: 'choice',
            ageGroup: 'middle',
            attractiveness: 'high',
            category: 'career',

            event: '公司裁员，你和新来的年轻人二选一。领导暗示你如果主动辞职会有补偿。',

            choices: [
                {
                    text: '主动辞职拿补偿',
                    successRate: 0.6,
                    success: {
                        result: '你拿到了30万补偿金。休息几个月后找到了新工作，待遇还不错。',
                        attributes: { luck: +20, health: +10, intelligence: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但新工作只干了3个月就又被裁了。40多岁再找工作太难了。',
                            attributes: { luck: -20, health: -15, intelligence: -10 },
                            death: {
                                chance: 0.16,
                                reason: '失业抑郁，自杀身亡。'
                            }
                        }
                    },
                    failure: {
                        result: '拿到补偿后你一直找不到合适的工作。积蓄越来越少。',
                        attributes: { luck: -15, health: -10 },
                        death: {
                            chance: 0.14,
                            reason: '经济压力过大，猝死。'
                        }
                    }
                },
                {
                    text: '据理力争',
                    successRate: 0.4,
                    success: {
                        result: '公司裁了年轻人。你保住了工作，但领导对你印象很差。',
                        attributes: { intelligence: +15, charm: -10 },
                        reversal: {
                            chance: 0.15,
                            text: '但公司开始处处刁难你，想逼你主动离职。你每天都很煎熬。',
                            attributes: { health: -20, charm: -15 },
                            death: {
                                chance: 0.18,
                                reason: '压力过大，心脏病突发。'
                            }
                        }
                    },
                    failure: {
                        result: '公司还是裁了你，而且没有补偿。你很后悔。',
                        attributes: { luck: -20, health: -15, charm: -10 },
                        death: {
                            chance: 0.16,
                            reason: '气愤到脑溢血。'
                        }
                    }
                }
            ],

            ageJump: { min: 3, max: 5 }
        },

        // ========== 老年期（51-100岁）==========
        {
            id: 'elder_c1',
            type: 'choice',
            ageGroup: 'elder',
            attractiveness: 'medium',
            category: 'family',

            event: '你的积蓄够养老了。孩子们希望你资助他们买房，但这会花掉你一半的积蓄。',

            choices: [
                {
                    text: '资助孩子',
                    successRate: 0.5,
                    success: {
                        result: '孩子们很感激，经常来看你。你晚年很幸福。',
                        attributes: { charm: +20, health: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但孩子们买了房后,你的电话越打越少有人接。过年时你准备了一桌饭菜,等到晚上十点,他们发来消息:"今年在岳父家过,您自己保重。"你看着一桌冷掉的菜,关了灯。',
                            attributes: { charm: -20, health: -20, luck: -15 },
                            death: {
                                chance: 0.20,
                                reason: '晚年孤独悲伤而死。'
                            }
                        }
                    },
                    failure: {
                        result: '孩子们拿了钱就不管你了。你后悔莫及。',
                        attributes: { luck: -15, health: -15, charm: -10 },
                        death: {
                            chance: 0.20,
                            reason: '悲伤过度去世。'
                        }
                    }
                },
                {
                    text: '拒绝资助',
                    successRate: 0.6,
                    success: {
                        result: '孩子们虽然失望但理解你。你保住了养老钱，晚年无忧。',
                        attributes: { intelligence: +15, health: +15, luck: +10 },
                        reversal: {
                            chance: 0.15,
                            text: '但从那以后,孩子们的电话少了,节假日也不来看你了。你攒了一辈子的钱,却连个说话的人都没有。小区里的老人都在炫耀孙子,你只能默默走开。',
                            attributes: { charm: -15, health: -10 },
                            death: {
                                chance: 0.16,
                                reason: '孤独终老。'
                            }
                        }
                    },
                    failure: {
                        result: '孩子们很生气，跟你断绝了关系。',
                        attributes: { charm: -20, health: -15 },
                        death: {
                            chance: 0.20,
                            reason: '伤心过度去世。'
                        }
                    }
                }
            ],

            ageJump: { min: 5, max: 10 }
        },
        {
            id: 'elder_c2',
            type: 'choice',
            ageGroup: 'elder',
            attractiveness: 'low',
            category: 'daily',

            event: '医生建议你做一个手术，可能延长5年寿命，但风险很大，费用20万。',

            choices: [
                {
                    text: '做手术',
                    successRate: 0.5,
                    success: {
                        result: '手术成功！你多活了好几年，看到了孙子结婚。',
                        attributes: { health: +20, luck: +15 },
                        reversal: {
                            chance: 0.15,
                            text: '但术后半年,并发症开始出现。你每天要吃十几种药,身上插满管子。医生说这个情况很常见。你躺在病床上想:当初还不如不做这个手术,至少能站着走。',
                            attributes: { health: -15, luck: -10 },
                            death: {
                                chance: 0.20,
                                reason: '并发症致死。'
                            }
                        }
                    },
                    failure: {
                        result: '手术失败，你躺在病床上更加痛苦。',
                        attributes: { health: -20, luck: -15 },
                        death: {
                            chance: 0.35,
                            reason: '手术并发症致死。'
                        }
                    }
                },
                {
                    text: '放弃手术',
                    successRate: 0.7,
                    success: {
                        result: '你选择安详地度过余生。虽然寿命短了，但活得舒服。',
                        attributes: { health: +10, charm: +10, intelligence: +5 },
                        reversal: {
                            chance: 0.15,
                            text: '但你经常想"如果当时做了手术会怎样"。你很后悔。',
                            attributes: { health: -10, charm: -10 },
                            death: {
                                chance: 0.25,
                                reason: '带着遗憾离世。'
                            }
                        }
                    },
                    failure: {
                        result: '你的病情迅速恶化。你后悔没做手术。',
                        attributes: { health: -15, luck: -10 },
                        death: {
                            chance: 0.30,
                            reason: '病情恶化去世。'
                        }
                    }
                }
            ],

            ageJump: { min: 5, max: 10 }
        }
    ]
};

// 如果在浏览器环境中，暴露到全局
if (typeof window !== 'undefined') {
    window.GameEvents = GameEvents;
}

// 如果在 Node.js 环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEvents;
}
