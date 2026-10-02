const categories = [
  {
    name: '电机设计', description: '从电机结构、参数到谐波和转矩品质',
    children: [
      { name: '轴向磁通电机', description: '轴向磁路、盘式结构与AFM设计' },
      { name: 'PMSM', description: '永磁同步电机的结构、磁链与基础参数' },
      { name: 'IPMSM', description: '内嵌式永磁同步电机、凸极与磁阻转矩' },
      { name: 'BLDC', description: '无刷直流电机、反电动势与换相' },
      { name: '电机类型对比', description: 'PMSM、IPMSM、BLDC等电机的区别' },
      { name: '通用电机基础', description: '磁链、极对数、电频率等共性概念' },
      { name: '电机电磁设计', description: '参数、绕组、反电势与损耗' },
      { name: '谐波与转矩脉动', description: '谐波来源、分析与抑制' }
    ]
  },
  {
    name: '控制算法', description: 'FOC、PI、SVPWM与自抗扰控制',
    children: [
      { name: 'FOC基础', description: '坐标变换、控制流程与核心概念' },
      { name: 'PI与双闭环', description: '电流环、速度环与参数整定' },
      { name: 'PWM / SVPWM / 逆变器', description: '调制、开关与直流母线' },
      { name: 'ADRC / LADRC', description: '自抗扰控制与状态观测器' },
      { name: '优化算法与代理模型', description: '参数优化、实验设计与代理模型' }
    ]
  },
  {
    name: 'AI部署', description: 'AI控制算法、模型压缩与落地思路',
    children: [
      { name: 'AI控制', description: '数据驱动控制与智能算法' },
      { name: 'AI应用与知识库', description: 'LLM、Agent、RAG与企业知识库应用' }
    ]
  },
  {
    name: '嵌入式', description: '控制器采样、实时执行与芯片部署',
    children: [
      { name: 'STM32控制部署', description: '采样、定时器、中断与工程实现' }
    ]
  },
  {
    name: '仿真与工具', description: 'MATLAB、Simulink与离散控制验证',
    children: [
      { name: 'MATLAB / Simulink', description: '仿真建模、离散控制与验证' }
    ]
  },
  {
    name: '项目实践', description: '结合简历项目的有限元仿真、模型验证与优化',
    children: [
      { name: '电机仿真与优化', description: 'JMAG、Maxwell、有限元与多目标优化' }
    ]
  },
  {
    name: '面试复习', description: '项目表达、基础题与个人易错点',
    children: [
      { name: '项目1：Tesla电机优化', description: 'Tesla Model 3、Double-V与有限元优化项目' },
      { name: '项目2：BLDC低脉动矢量控制', description: 'BLDC、HCI、LADRC与转矩脉动控制项目' },
      { name: '高频面试基础题', description: '电机与控制常见基础问答' },
      { name: '易错点 / 我曾经不会的', description: '容易混淆、需要反复复习的知识点' }
    ]
  }
]

if (typeof module !== 'undefined' && module.exports) {
  module.exports = categories
} else if (typeof window !== 'undefined') {
  window.FOC_CATEGORIES = categories
}
