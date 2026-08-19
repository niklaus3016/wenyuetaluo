import { SpreadConfig } from '../types';

export const TAROT_SPREADS: SpreadConfig[] = [
  {
    id: 'single',
    name: '单牌速占',
    tag: '快速·直觉',
    cardCount: 1,
    description: '抽出一张牌，快速捕捉当下宇宙指引与核心能量。',
    suitableFor: '适用于日常是非疑惑、每日随心指引、突发灵感或简短答疑。',
    iconName: 'Sparkles',
    positions: [
      {
        name: '核心启示',
        meaning: '当下最需要关注的能量焦点、答案核心与直觉指引。'
      }
    ]
  },
  {
    id: 'three_time',
    name: '三牌经典阵',
    tag: '经典·时空',
    cardCount: 3,
    description: '溯源过往脉络，洞悉当下处境，指引未来可能的发展走向。',
    suitableFor: '通用万能牌阵，适用于绝大多数事件的全周期梳理与趋势分析。',
    iconName: 'Compass',
    positions: [
      {
        name: '过去根基',
        meaning: '导致当前局面的起因、过往经历与潜意识中积累的因果能量。'
      },
      {
        name: '当下现状',
        meaning: '目前所处的核心状态、正在发生的现实与面临的心态挑战。'
      },
      {
        name: '未来趋势',
        meaning: '若保持当前节奏与心念，未来最可能迎来的走向与阶段性结局。'
      }
    ]
  },
  {
    id: 'love_triangle',
    name: '感情专项阵',
    tag: '情感·心灵',
    cardCount: 3,
    description: '透视彼此真实心声与情感互动，剖析关系的深层联结与发展方向。',
    suitableFor: '适用于单身脱单、暧昧暗恋、情侣相处、挽回修复及关系走势探索。',
    iconName: 'HeartHandshake',
    positions: [
      {
        name: '你的内心',
        meaning: '你对这段关系的真实期待、情感投射与潜意识需求。'
      },
      {
        name: '对方心意',
        meaning: '对方目前的真实感受、态度想法与对你的情感认知。'
      },
      {
        name: '发展走向',
        meaning: '二人关系的未来互动模式、潜在共鸣点与指引建议。'
      }
    ]
  },
  {
    id: 'career_growth',
    name: '事业学业阵',
    tag: '职场·成长',
    cardCount: 4,
    description: '全方位审视职场态势与学业瓶颈，发掘自身潜能，突破阻碍。',
    suitableFor: '适用于工作求职、升职加薪、考研考公、创业拓展及转型抉择。',
    iconName: 'Briefcase',
    positions: [
      {
        name: '当前现状',
        meaning: '目前所处的职场/学业环境、工作进度与核心处境。'
      },
      {
        name: '潜能优势',
        meaning: '你尚未充分发挥的才华、内在资源与外部支持助力。'
      },
      {
        name: '阻碍挑战',
        meaning: '需要警惕的潜在阻力、自身盲区或外部环境考验。'
      },
      {
        name: '最终成果',
        meaning: '经过努力调整后，最可能达成的成果、回报与发展高度。'
      }
    ]
  },
  {
    id: 'decision_choice',
    name: '两难抉择阵',
    tag: '决策·剖析',
    cardCount: 5,
    description: '理清迷茫中的AB分岔路，深度权衡两条路径的利弊与最终归宿。',
    suitableFor: '适用于跳槽VS留下、去留抉择、两种投资方案或重要人生交叉口。',
    iconName: 'GitFork',
    positions: [
      {
        name: '当下核心',
        meaning: '促使你陷入纠结的本质问题与目前所站立的基点。'
      },
      {
        name: '选择A发展',
        meaning: '如果选择路径A，中期推进过程中会经历的过程与体验。'
      },
      {
        name: '选择A结局',
        meaning: '选择路径A最终带来的结果、收获与可能付出的代价。'
      },
      {
        name: '选择B发展',
        meaning: '如果选择路径B，中期推进过程中会经历的过程与体验。'
      },
      {
        name: '选择B结局',
        meaning: '选择路径B最终带来的结果、收获与可能付出的代价。'
      }
    ]
  },
  {
    id: 'overall_energy',
    name: '综合运势阵',
    tag: '全局·能量',
    cardCount: 4,
    description: '从全局视角扫描身心能量场，把握机遇风口，规避隐蔽风险。',
    suitableFor: '适用于月度运势展望、本周能量复盘、近期转运指引及身心状态调频。',
    iconName: 'Sun',
    positions: [
      {
        name: '整体能量',
        meaning: '近期环绕在你身边的宏观气场、主要运势基调与生命节律。'
      },
      {
        name: '心态情绪',
        meaning: '你的内在精神状态、心理承载力与深层潜意识渴望。'
      },
      {
        name: '潜在机遇',
        meaning: '即将出现的贵人、转机、灵感火花或意外利好。'
      },
      {
        name: '隐患提醒',
        meaning: '需要防范的疏漏、过度情绪化或潜在的消耗陷阱。'
      }
    ]
  }
];

export function getSpreadById(id: string): SpreadConfig {
  return TAROT_SPREADS.find(s => s.id === id) || TAROT_SPREADS[0];
}
