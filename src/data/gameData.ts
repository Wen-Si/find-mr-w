
import { Case, Skill } from '../types';

export const skills: Skill[] = [
  {
    id: 'skill-1',
    name: '初级财务分析',
    description: '能够识别基本的财务异常',
    levelRequired: 1,
    icon: '📊'
  },
  {
    id: 'skill-2',
    name: '高级财务分析',
    description: '能够发现复杂的财务造假手法',
    levelRequired: 3,
    icon: '🔍'
  },
  {
    id: 'skill-3',
    name: '审计大师',
    description: '精通各类财务欺诈识别技术',
    levelRequired: 5,
    icon: '🏆'
  },
  {
    id: 'skill-4',
    name: '财务侦探',
    description: '顶级财务造假识别专家',
    levelRequired: 8,
    icon: '🕵️'
  }
];

export const initialCases: Case[] = [
  {
    id: 'case-1',
    title: '新星科技公司',
    description: '一家初创科技公司的财务报表存在疑点',
    difficulty: 1,
    story: '你刚刚成为一名初级财务分析师。某天，你收到了一份匿名举报，声称新星科技公司的财务报表可能存在造假。作为你的第一个案件，你需要仔细检查他们的财务报表，找出任何可疑之处。',
    experienceReward: 100,
    isUnlocked: true,
    isCompleted: false,
    wClue: 'W先生似乎对科技行业特别感兴趣...',
    scenes: [
      {
        id: 'scene-1',
        name: '办公室',
        description: '新星科技公司的财务办公室，桌面上散落着各种财务文件',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      },
      {
        id: 'scene-2',
        name: '会议室',
        description: '公司的会议室，墙上挂着业绩图表',
        image: 'https://images.unsplash.com/photo-1431538687348-97927788716b?w=800'
      }
    ],
    financialStatements: {
      balanceSheet: {
        title: '资产负债表',
        items: [
          { id: 'bs-1', name: '流动资产', value: '¥5,000,000' },
          { id: 'bs-2', name: '应收账款', value: '¥3,000,000', notes: '同比增长200%' },
          { id: 'bs-3', name: '存货', value: '¥1,500,000' },
          { id: 'bs-4', name: '固定资产', value: '¥8,000,000' },
          { id: 'bs-5', name: '总资产', value: '¥17,500,000' },
          { id: 'bs-6', name: '流动负债', value: '¥4,000,000' },
          { id: 'bs-7', name: '长期负债', value: '¥6,000,000' },
          { id: 'bs-8', name: '所有者权益', value: '¥7,500,000' }
        ]
      },
      incomeStatement: {
        title: '利润表',
        items: [
          { id: 'is-1', name: '营业收入', value: '¥12,000,000', notes: '同比增长300%' },
          { id: 'is-2', name: '营业成本', value: '¥5,000,000' },
          { id: 'is-3', name: '毛利润', value: '¥7,000,000' },
          { id: 'is-4', name: '销售费用', value: '¥500,000' },
          { id: 'is-5', name: '管理费用', value: '¥800,000' },
          { id: 'is-6', name: '净利润', value: '¥5,700,000' }
        ]
      },
      cashFlowStatement: {
        title: '现金流量表',
        items: [
          { id: 'cf-1', name: '经营活动现金流', value: '-¥2,000,000' },
          { id: 'cf-2', name: '投资活动现金流', value: '-¥3,000,000' },
          { id: 'cf-3', name: '筹资活动现金流', value: '¥6,000,000' },
          { id: 'cf-4', name: '现金净增加额', value: '¥1,000,000' }
        ]
      }
    },
    fakePoints: [
      {
        id: 'fp-1',
        statementType: 'incomeStatement',
        itemId: 'is-1',
        description: '营业收入同比增长300%，但缺乏合理的业务增长解释',
        hint: '营业收入的异常增长往往是财务造假的信号',
        requiredClues: ['clue-1']
      },
      {
        id: 'fp-2',
        statementType: 'balanceSheet',
        itemId: 'bs-2',
        description: '应收账款大幅增长，与营收增长不匹配',
        hint: '虚增收入通常伴随着应收账款的异常增加',
        requiredClues: ['clue-2']
      },
      {
        id: 'fp-3',
        statementType: 'cashFlowStatement',
        itemId: 'cf-1',
        description: '经营活动现金流为负，但净利润很高',
        hint: '净利润与现金流背离是重要的警示信号',
        requiredClues: ['clue-3']
      }
    ],
    clues: [
      {
        id: 'clue-1',
        title: '销售合同异常',
        content: '发现几份销售合同的客户名称相似，且注册地址相同',
        location: '办公室',
        sceneId: 'scene-1'
      },
      {
        id: 'clue-2',
        title: '应收账款明细',
        content: '大部分应收账款来自同几家关联公司',
        location: '档案室',
        sceneId: 'scene-1'
      },
      {
        id: 'clue-3',
        title: '现金流分析',
        content: '公司主要靠融资维持运营，主营业务并没有真正的现金流入',
        location: '会议室',
        sceneId: 'scene-2'
      }
    ]
  },
  {
    id: 'case-2',
    title: '大华贸易集团',
    description: '一家大型贸易公司的存货估值存在重大疑问',
    difficulty: 2,
    story: '你的第二个案件来了！大华贸易集团是一家知名的贸易公司，但最近有传言说他们的存货价值被严重高估。你需要深入调查他们的财务报表，找出真相。',
    experienceReward: 150,
    isUnlocked: false,
    isCompleted: false,
    wClue: 'W先生在贸易圈似乎有很多人脉...',
    scenes: [
      {
        id: 'scene-1',
        name: '仓库',
        description: '公司的主要仓库，存货堆积如山',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
      },
      {
        id: 'scene-2',
        name: '财务室',
        description: '财务部的办公室，到处都是账本',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800'
      }
    ],
    financialStatements: {
      balanceSheet: {
        title: '资产负债表',
        items: [
          { id: 'bs-1', name: '流动资产', value: '¥20,000,000' },
          { id: 'bs-2', name: '存货', value: '¥12,000,000', notes: '占流动资产60%' },
          { id: 'bs-3', name: '应收账款', value: '¥5,000,000' },
          { id: 'bs-4', name: '固定资产', value: '¥15,000,000' },
          { id: 'bs-5', name: '总资产', value: '¥42,000,000' },
          { id: 'bs-6', name: '流动负债', value: '¥10,000,000' },
          { id: 'bs-7', name: '长期负债', value: '¥12,000,000' },
          { id: 'bs-8', name: '所有者权益', value: '¥20,000,000' }
        ]
      },
      incomeStatement: {
        title: '利润表',
        items: [
          { id: 'is-1', name: '营业收入', value: '¥30,000,000' },
          { id: 'is-2', name: '营业成本', value: '¥18,000,000' },
          { id: 'is-3', name: '毛利润', value: '¥12,000,000' },
          { id: 'is-4', name: '资产减值损失', value: '¥0', notes: '无存货跌价准备' },
          { id: 'is-5', name: '管理费用', value: '¥3,000,000' },
          { id: 'is-6', name: '净利润', value: '¥8,000,000' }
        ]
      },
      cashFlowStatement: {
        title: '现金流量表',
        items: [
          { id: 'cf-1', name: '经营活动现金流', value: '¥1,000,000' },
          { id: 'cf-2', name: '投资活动现金流', value: '-¥2,000,000' },
          { id: 'cf-3', name: '筹资活动现金流', value: '¥3,000,000' },
          { id: 'cf-4', name: '现金净增加额', value: '¥2,000,000' }
        ]
      }
    },
    fakePoints: [
      {
        id: 'fp-1',
        statementType: 'balanceSheet',
        itemId: 'bs-2',
        description: '存货占流动资产比例过高，且从未计提跌价准备',
        hint: '存货积压且不计提减值是常见的造假手段',
        requiredClues: ['clue-1']
      },
      {
        id: 'fp-2',
        statementType: 'incomeStatement',
        itemId: 'is-4',
        description: '在市场环境不佳的情况下，没有任何资产减值损失',
        hint: '不计提减值准备会虚增利润',
        requiredClues: ['clue-2']
      }
    ],
    clues: [
      {
        id: 'clue-1',
        title: '仓库检查报告',
        content: '内部报告显示部分存货已过期或损坏，但账面上仍按原价记载',
        location: '仓库',
        sceneId: 'scene-1'
      },
      {
        id: 'clue-2',
        title: '市场价格数据',
        content: '同类商品的市场价格已下跌30%，但公司未做任何调整',
        location: '财务室',
        sceneId: 'scene-2'
      }
    ]
  },
  {
    id: 'case-3',
    title: 'W先生的秘密',
    description: '最终章：揭开W先生的真实面目',
    difficulty: 3,
    story: '经过前两个案件的调查，你收集到了关于W先生的线索。现在，你需要将所有线索拼凑起来，揭开这个神秘人物的真实身份！',
    experienceReward: 300,
    isUnlocked: false,
    isCompleted: false,
    scenes: [
      {
        id: 'scene-1',
        name: '秘密会议室',
        description: '一个隐蔽的会议室，墙上挂满了各种财务文件',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
      }
    ],
    financialStatements: {
      balanceSheet: {
        title: '综合分析表',
        items: [
          { id: 'bs-1', name: '关联公司网络', value: '12家' },
          { id: 'bs-2', name: '涉案金额', value: '¥50,000,000' },
          { id: 'bs-3', name: '涉及行业', value: '多个' }
        ]
      },
      incomeStatement: {
        title: '线索汇总',
        items: [
          { id: 'is-1', name: '科技行业线索', value: '已收集' },
          { id: 'is-2', name: '贸易行业线索', value: '已收集' },
          { id: 'is-3', name: '关键证据', value: '待确认' }
        ]
      },
      cashFlowStatement: {
        title: '最终结论',
        items: [
          { id: 'cf-1', name: 'W先生身份', value: '待揭露' }
        ]
      }
    },
    fakePoints: [],
    clues: []
  }
];
