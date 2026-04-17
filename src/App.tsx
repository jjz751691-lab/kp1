import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Microscope, Monitor, Printer, Server, Cpu, Database, Laptop, CloudRain, Wind, Zap,
  CloudSnow, Snowflake, LineChart, ArrowRight, Droplets, Droplet, BarChart, 
  CircleDot, Target, CloudLightning, TrendingDown, CloudFog, Sun, Activity,
  Thermometer, Settings, Radar, Camera, FileText, Users, Layers, ChevronRight, ArrowLeft
} from 'lucide-react';
// @ts-ignore
import logoImg from './logo.png';

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
};

const getArcLine = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

const getWigglyCircle = (cx: number, cy: number, baseR: number, waves1: number, amp1: number, waves2: number, amp2: number, phase: number = 0) => {
  const points = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = baseR + Math.sin(angle * waves1 + phase) * amp1 + Math.cos(angle * waves2 + phase * 0.7) * amp2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  points.push('Z');
  return points.join(' ');
};

const getArcPath = (cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
};

const sectors = [
  { year: "01", date: "发展历程", products: ["发展历程"], icon: Wind, r3Text: "", outerEvent: "历史沿革", subItems: ["1958", "1980", "1987", "2026"] },
  { year: "02", date: "人影机理", products: ["人影机理"], icon: CloudRain, r3Text: "", outerEvent: "核心理论突破", subItems: ["冷云催化", "暖云催化", "人工防雹", "人工消减雨", "人工消雾"] },
  { year: "03", date: "作业装备", products: ["作业装备"], icon: Server, r3Text: "", outerEvent: "装备升级", subItems: ["高炮", "火箭", "烟炉", "飞机", "无人机"] },
  { year: "04", date: "工作体系", products: ["工作体系"], icon: Database, r3Text: "", outerEvent: "体系建设", subItems: ["法规条例", "协调会议", "七段业务"] },
  { year: "05", date: "人影六周年", products: ["人影六周年"], icon: Activity, r3Text: "", outerEvent: "周年纪念" },
];

const historyEvents = [
  { year: "01", date: "发展历程", event: "回顾我国人工影响天气事业从无到有、从小到大的辉煌发展历程。" },
  { year: "02", date: "人影机理", event: "介绍人工影响天气的科学原理，包括催化剂播撒、热力影响等多种技术手段。" },
  { year: "03", date: "作业装备", event: "介绍现代化的人工影响天气作业飞机、火箭、高炮及地面烟炉等装备。" },
  { year: "04", date: "工作体系", event: "构建国家、省、市、县四级联动的人工影响天气指挥与作业体系。" },
  { year: "05", date: "业务现状", event: "总结当前业务运行规模、技术水平及在防灾减灾中发挥的重要作用。" },
  { year: "06", date: "人影六周年", event: "庆祝人工影响天气事业六十周年，回顾辉煌成就，展望未来发展。" },
];

const developmentHistory = [
  {
    year: "1958",
    items: [
      "中国气象局决定开展人工影响局部天气试验研究，开启事业篇章",
      "吉林开展第一次飞机人工增雨",
      "福建古田随机催化试验"
    ],
    imageAlt: "吉林第一次飞机增雨作业",
    imageSrc: "https://images.unsplash.com/photo-1559087867-ce4c9124cb9d?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "1980",
    items: [
      "全面加强科学试验，推动新型作业装备的引进与自主研发进程",
      "加强科学试验",
      "新型作业装备引进和研发"
    ],
    imageAlt: "气象科学试验",
    imageSrc: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "1987",
    items: [
      "社会需求大大提升，科学试验增强带动探测与作业装备技术飞跃",
      "需求大大提升",
      "科学试验增强，探测、作业装备技术提升",
      "云降水数值模式应用",
      "作业指挥体系优化改进"
    ],
    imageAlt: "人影火箭",
    imageSrc: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2026",
    items: [
      "立足新要求高标准，全面推动人工影响天气事业高质量转型发展",
      "新要求、高标准",
      "转型发展，人影高质量发展"
    ],
    imageAlt: "高性能人影飞机",
    imageSrc: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=600"
  }
];

const principles = [
  {
    title: "冷云催化",
    conditions: "如果云中过冷云滴多，而自然冰晶太少，贝吉龙过程不充分。",
    methods: "向云中播入冰核（如碘化银）或致冷剂（如干冰、液氮），产生大量的冰晶，加快冰水转化的贝吉龙过程，形成大量冰晶，加快降水过程，提高降水效率。",
    mechanism: "温度为0～-30°C的云中，往往存在过冷却水滴，若在这种云中播撒碘化银或固体二氧化碳（干冰）等成冰催化剂，可以生成大量的人工冰晶。这类催化剂的成冰效率很高，1克催化剂就可生成数量级为1万亿个的冰晶。在某些云中，人工冰晶通过伯杰龙过程可形成降水，从而达到人工降水的目的。在强对流云中，人工冰晶能长大成冰雹胚胎，同自然冰雹争夺水分，使各个冰雹都不能长成危害严重的大雹块，达到防雹目的。在过冷云（雾）中，人工冰晶使云（雾）滴蒸发而自身长大下落，又可达到消云（雾）的目的。在冷云催化过程中释放的巨大潜热会改变云的热力、动力过程，着力于这种动力效应的催化称为动力催化。",
    support: "依赖雷达监测云层结构、卫星云图分析天气系统，以及数值模式预测催化时机。",
    icons: [
      { icon: CloudSnow },
      { icon: Snowflake },
      { icon: LineChart }
    ],
    types: [
      { name: "静力催化", desc: "在因缺乏冰晶而不降水的过冷层状云中人工引入浓度为10~100/L的冰晶，可发动或加速贝吉龙过程", tag: "我国北方大多数层状云增雨作业" },
      { name: "动力催化", desc: "引入过量催化剂，使云全部冰晶化，潜热加热空气，浮力增加，导致云体增强，最终产生更多降水。从影响云的微观结构得到影响云的动力场的结果。", tag: "适用于水汽丰沛的积状云" }
    ]
  },
  {
    title: "暖云催化",
    conditions: "云滴大小均匀，碰并过程微弱，难以形成降水。",
    methods: "向云中播撒吸湿性核（如盐粉）或大水滴，改变云滴谱分布，促进碰并过程，使云滴迅速长大成雨滴落下。",
    mechanism: "向温度高于0℃的暖云中播撒吸湿性核（如盐粉），促进云滴碰并增长，形成大雨滴降落。",
    support: "需要高分辨率气象雷达实时监测云中含水量和上升气流分布。",
    icons: [
      { icon: Droplets },
      { icon: Droplet },
      { icon: BarChart }
    ],
    types: [
      { name: "吸湿性催化", desc: "利用盐粉等吸湿性物质在云中吸收水汽凝结增长，形成大云滴，启动碰并过程。", tag: "常见于南方暖云增雨" }
    ]
  },
  {
    title: "人工防雹",
    conditions: "强对流云中存在丰富的过冷水和强烈的上升气流，冰雹胚胎迅速生长。",
    methods: "向冰雹云中播撒大量人工冰核（如碘化银），产生大量冰晶，与自然雹胚竞争过冷水（“争水”机制），使雹胚不能长成大冰雹，而是以小冰雹或雨滴形式降落。",
    mechanism: "通过向冰雹云中播撒大量人工冰核，产生大量冰晶，这些冰晶与自然雹胚竞争过冷水，使得雹胚无法获得足够的水分长成大冰雹，从而以小冰雹或雨滴的形式降落，减轻冰雹灾害。",
    support: "利用双偏振雷达识别冰雹云，结合闪电定位系统和三维风场数据，精准锁定作业区域。",
    icons: [
      { icon: CloudLightning },
      { icon: CircleDot },
      { icon: Target }
    ],
    types: [
      { name: "竞争繁生", desc: "大量人工冰核形成众多小冰晶，消耗云中过冷水，抑制大冰雹生长。", tag: "主要防雹机制" }
    ]
  },
  {
    title: "人工消减雨",
    conditions: "在重大活动或特定区域需要避免降水时。",
    methods: "在目标区上风方进行超量播撒，使云中产生过量冰晶，水汽竞争导致冰晶无法长到能降落的大小，或者提前在目标区外促使云层降水（“截留”）。",
    mechanism: "通过在目标区上风方进行超量播撒，使云中产生过量冰晶，导致水汽竞争，冰晶无法长到能降落的大小，从而在目标区内实现消减雨雪的效果。或者提前在目标区外促使云层降水，达到“截留”的目的。",
    support: "结合高精度数值天气预报模型，实时监控上游天气系统的移动路径和强度变化。",
    icons: [
      { icon: CloudRain },
      { icon: Wind },
      { icon: TrendingDown }
    ],
    types: [
      { name: "超量催化", desc: "播撒过量催化剂，使云滴/冰晶数量过多，体积过小无法降落。", tag: "云体悬浮" },
      { name: "提前降水", desc: "在目标区上风方提前催化，使降水落在目标区外。", tag: "上风方拦截" }
    ]
  },
  {
    title: "人工消雾",
    conditions: "机场、高速公路等区域出现严重影响交通的雾。",
    methods: "对于冷雾，播撒致冷剂（液氮、干冰）或人工冰核产生冰晶，通过冰水转化消耗水汽使雾滴蒸发；对于暖雾，播撒吸湿性物质吸收水汽，或使用加热法蒸发雾滴。",
    mechanism: "对于冷雾，播撒致冷剂或人工冰核产生冰晶，通过冰水转化消耗水汽使雾滴蒸发；对于暖雾，播撒吸湿性物质吸收水汽，或使用加热法蒸发雾滴，从而提高能见度。",
    support: "依赖地面能见度仪网络、低空风切变探测系统以及微波辐射计等设备进行实时监测。",
    icons: [
      { icon: CloudSnow },
      { icon: Droplets },
      { icon: Wind }
    ],
    types: [
      { name: "冷雾消除", desc: "播撒液氮或干冰，促使雾滴转化为冰晶降落。", tag: "成本较低，效果好" },
      { name: "暖雾消除", desc: "播撒盐粉等吸湿剂，或直接加热空气使雾滴蒸发。", tag: "成本较高" }
    ]
  }
];

const equipmentSubItems = [
  { id: 0, title: "高炮", icon: Target, desc: "主要用于防雹和局部增雨，通过发射含有催化剂的炮弹至目标云层，实现精准催化。" },
  { id: 1, title: "火箭", icon: Zap, desc: "机动性强，射程远，适用于大范围、高强度的增雨防雹作业，是目前应用最广泛的装备之一。" },
  { id: 2, title: "烟炉", icon: Thermometer, desc: "部署在山区迎风坡等固定地点，通过燃烧产生催化剂烟气，随上升气流进入云层，成本低且可远程控制。" },
  { id: 3, title: "飞机", icon: Wind, desc: "覆盖范围广，可直接进入云层内部进行大面积、精准的催化剂播撒，是大型作业的主力装备。" },
  { id: 4, title: "无人机", icon: Radar, desc: "新型作业手段，具备高危环境作业能力，长航时、低成本，正逐步成为人工影响天气的重要补充力量。" }
];

const workSystemSubItems = [
  { id: 0, title: "法规条例", icon: FileText, desc: "完善的人工影响天气相关法律法规与标准体系，为规范作业提供坚实法治保障。" },
  { id: 1, title: "协调会议制度", icon: Users, desc: "跨部门、跨区域的统筹协调与联合指挥机制，确保各方力量高效协同。" },
  { id: 2, title: "七段业务体系", icon: Layers, desc: "从条件监测、计划制定、方案设计到作业实施、效果评估的完整闭环流程。" }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activePrincipleIndex, setActivePrincipleIndex] = useState(0);
  const [expandedPrincipleIndex, setExpandedPrincipleIndex] = useState<number | null>(0);
  const [scale, setScale] = useState(1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 16:9 Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 2816;
      const targetHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      
      // Use the smaller scale to ensure the content fits within the screen
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectorClick = (index: number, year: string) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      setActiveSubIndex(null);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* 16:9 Scaled Container */}
      <div 
        style={{ 
          width: '2816px', 
          height: '1080px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="flex flex-col shrink-0 bg-[#061121] font-sans text-[#e0f2fe] relative overflow-hidden"
      >
      
      {/* Global Tech Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.15)_0%,transparent_70%)] z-0 pointer-events-none"></div>

      {/* Global Header */}
      <div className="w-full h-24 border-b border-[#00c3ff30] flex items-center justify-between px-16 z-50 bg-[#061121]/90 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-[#00c3ff20] rounded-full flex items-center justify-center border border-[#00c3ff40] shadow-[0_0_15px_rgba(0,195,255,0.2)]">
            <CloudRain className="text-[#00c3ff]" size={28} />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#60e3ff] via-[#00c3ff] to-[#60e3ff] tracking-[0.2em] drop-shadow-[0_0_20px_rgba(0,195,255,0.5)] uppercase">
            人工影响天气科普
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col">
            <span className="text-white font-mono text-sm tracking-widest">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg border border-[#00c3ff40] flex items-center justify-center bg-[#00c3ff10]">
            <Monitor size={20} className="text-[#00c3ff]" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Vertical Divider - Enhanced with design elements */}
        <div className="absolute left-[864px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00c3ff40] to-transparent z-20">
          <div className="absolute inset-0 bg-[#00c3ff10] blur-xl -left-4 -right-4"></div>
          <div className="absolute top-1/4 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
          <div className="absolute top-1/2 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
          <div className="absolute top-3/4 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
        </div>

        {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      
      {/* Top Light Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-[#00c3ff15] to-transparent blur-3xl pointer-events-none"></div>
      
      {/* Starry Background Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%">
          {[...Array(100)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5}
              fill="white"
              opacity={Math.random()}
            >
              <animate
                attributeName="opacity"
                values={`${Math.random()};${Math.random()};${Math.random()}`}
                dur={`${2 + Math.random() * 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>
      
      {/* Left Side: Radial Diagram */}
      <div className="w-[1100px] shrink-0 h-full relative flex items-center">
        
        <svg viewBox="0 0 1200 1000" className="w-full h-full overflow-visible" preserveAspectRatio="xMinYMid meet">
          <defs>
            <radialGradient id="glassVolume" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#60e3ff" stopOpacity="0.15" />
              <stop offset="15%" stopColor="#60e3ff" stopOpacity="0.05" />
              <stop offset="50%" stopColor="transparent" stopOpacity="0" />
              <stop offset="85%" stopColor="#0c375f" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#061121" stopOpacity="0.8" />
            </radialGradient>
            <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60e3ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60e3ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="100%" stopColor="#00c3ff" stopOpacity="0.4" />
            </radialGradient>
            <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="1" fill="#00c3ff" opacity="0.3" />
            </pattern>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="flare" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1 0" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="logoClip">
              <circle cx="150" cy="500" r="158" />
            </clipPath>
            <clipPath id="sphereClip">
              <circle cx="150" cy="500" r="160" />
            </clipPath>
            <mask id="silkMask">
                <path d={getArcLine(150, 500, 550, -90, 90)} fill="none" stroke="white" strokeWidth="300" strokeLinecap="round" />
              </mask>
            </defs>

            {/* Adjusted Center: cx=150, cy=500 (Centered vertically and moved slightly right for visibility) */}
            
            {/* Atmospheric Glow behind globe */}
            <circle cx="150" cy="500" r="180" fill="#00c3ff" opacity="0.1" filter="url(#strongGlow)" />
            <circle cx="150" cy="500" r="165" fill="none" stroke="#00c3ff" strokeWidth="1" opacity="0.3" filter="url(#glow)" />

            {/* Background faint arcs */}
            <circle cx="150" cy="500" r="550" fill="none" stroke="#0c375f" strokeWidth="0.5" opacity="0.15" />
            <circle cx="150" cy="500" r="650" fill="none" stroke="#0c375f" strokeWidth="0.5" opacity="0.1" />

            {/* Globe Base */}
            <circle cx="150" cy="500" r="160" fill="#061121" opacity="0.6" />
            
            {/* Embedded Logo with Holographic Effect */}
            <g clipPath="url(#logoClip)">
              <image 
                href={logoImg} 
                x="0" 
                y="350" 
                width="300" 
                height="300" 
                preserveAspectRatio="xMidYMid slice" 
                style={{ filter: 'drop-shadow(0 0 15px rgba(0,195,255,0.3))' }}
              >
                {/* Dynamic Opacity Pulsing */}
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite" />
              </image>
              {/* Holographic Scanlines Overlay */}
              <rect x="-10" y="340" width="320" height="320" fill="url(#scanlines)" opacity="0.3" pointerEvents="none" />
            </g>
            
            {/* Flowing Cloud/Energy Patterns */}
            <g clipPath="url(#sphereClip)" opacity="0.5">
              <motion.g
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '150px 500px' }}
              >
                <path d="M -100,500 Q 50,300 150,500 T 400,500 T 150,700 T -100,500" fill="none" stroke="#00c3ff" strokeWidth="30" opacity="0.1" filter="url(#strongGlow)" />
              </motion.g>
            </g>

            {/* 3D Glass Volume Overlay */}
            <circle cx="150" cy="500" r="160" fill="url(#glassVolume)" />
            <circle cx="150" cy="500" r="160" fill="url(#innerShadow)" />
            
            {/* Top Specular Highlight for Glass Effect */}
            <ellipse cx="150" cy="380" rx="100" ry="45" fill="url(#glassHighlight)" />
            
            {/* Rim Light */}
            <circle cx="150" cy="500" r="160" fill="none" stroke="#60e3ff" strokeWidth="1" opacity="0.3" />
            
            {/* Techy inner dashed rings */}
            <circle cx="150" cy="500" r="166" fill="none" stroke="#60e3ff" strokeWidth="0.5" strokeDasharray="1 12" opacity="0.3" />

          {sectors.map((sector, i) => {
            const totalAngle = 140;
            const angleStep = totalAngle / sectors.length;
            const startAngle = -(totalAngle / 2) + i * angleStep + 1;
            const endAngle = -(totalAngle / 2) + (i + 1) * angleStep - 1;
            const midAngle = (startAngle + endAngle) / 2;
            
            // Ring 1: Years
            const r1Inner = 160;
            const r1Outer = 240;
            const r1Mid = (r1Inner + r1Outer) / 2;
            const r1Pos = polarToCartesian(150, 500, r1Mid, midAngle);
            
            // Ring 2: Products
            const r2Inner = 240;
            const r2Outer = 400;
            const r2Mid = (r2Inner + r2Outer) / 2;
            const r2Pos = polarToCartesian(150, 500, r2Mid, midAngle);

            // Ring 3: Outer
            const r3Inner = 400;
            const r3Outer = 580;
            const r3Mid = (r3Inner + r3Outer) / 2;
            
            // Merged Ring (R2 + R3)
            const mergedMid = (r2Inner + r3Outer) / 2;
            const mergedPos = polarToCartesian(150, 500, mergedMid, midAngle);
            
            const isActive = activeIndex === i;
            const isHovered = hoverIndex === i;
            
            const r1Fill = isActive ? "#73c7ed" : (isHovered ? "#1a528a" : "#0c375f");
            const r2Fill = isActive ? "rgba(115, 199, 237, 0.4)" : (isHovered ? "rgba(12, 55, 95, 0.7)" : "rgba(12, 55, 95, 0.35)");
            const r3Fill = isActive ? "rgba(115, 199, 237, 0.2)" : (isHovered ? "rgba(12, 55, 95, 0.3)" : "rgba(12, 55, 95, 0.1)");
            
            return (
              <motion.g 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeIndex === null ? 1 : (isActive ? 1 : 0.4)
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: '150px 500px', cursor: 'pointer' }}
                onClick={() => handleSectorClick(i, sector.year)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <radialGradient id={`mergedGrad-${i}`} cx="150" cy="500" r={r3Outer} gradientUnits="userSpaceOnUse">
                    <stop offset={`${(r2Inner / r3Outer) * 100}%`} stopColor={r2Fill} style={{ transition: 'stop-color 0.3s' }} />
                    <stop offset="100%" stopColor={r3Fill} style={{ transition: 'stop-color 0.3s' }} />
                  </radialGradient>
                </defs>
                
                {sector.subItems ? (
                  <>
                    {/* R2 (Inner part of the split sector) */}
                    <path d={getArcPath(150, 500, r2Inner, r3Inner, startAngle, endAngle)} fill={r2Fill} stroke="rgba(0, 195, 255, 0.25)" strokeWidth="1" className="transition-colors duration-300" />
                    
                    {/* R2 Text */}
                    <foreignObject 
                      x={r2Pos.x - 75} 
                      y={r2Pos.y - 75} 
                      width="150" 
                      height="150"
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full" style={{ transform: `rotate(${midAngle}deg)` }}>
                        {sector.products.map((p, idx) => (
                          <span key={idx} className={`text-[30px] font-bold leading-tight text-center transition-colors duration-300 px-4 whitespace-nowrap w-full ${isActive ? 'text-[#ffffff] drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' : 'text-[#73c7ed]'}`}>{p}</span>
                        ))}
                      </div>
                    </foreignObject>

                    {/* R3 Sub-items (Outer part split into pieces) */}
                    {sector.subItems.map((subItem, subIdx) => {
                      const subAngleStep = (endAngle - startAngle) / sector.subItems.length;
                      const subStart = startAngle + subIdx * subAngleStep;
                      const subEnd = subStart + subAngleStep;
                      const subMid = (subStart + subEnd) / 2;
                      const subPos = polarToCartesian(150, 500, r3Mid, subMid);
                      const isSubActive = isActive && activeSubIndex === subIdx;
                      const subFill = isSubActive ? "rgba(115, 199, 237, 0.5)" : r3Fill;
                      
                      return (
                        <g 
                          key={subIdx} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (!isActive) setActiveIndex(i);
                            setActiveSubIndex(subIdx); 
                          }}
                          className="group"
                        >
                          <path d={getArcPath(150, 500, r3Inner, r3Outer, subStart, subEnd)} fill={subFill} stroke="rgba(0, 195, 255, 0.2)" strokeWidth="1" className="transition-colors duration-300 group-hover:fill-[#73c7ed]/30" />
                          
                          {/* Tech Decorative Line at the outer edge */}
                          <path d={getArcLine(150, 500, r3Outer - 5, subStart + 2, subEnd - 2)} fill="none" stroke={isSubActive ? "#ffffff" : "#00c3ff"} strokeWidth="1" opacity={isSubActive ? 0.8 : 0.3} />

                          <foreignObject 
                            x={subPos.x - 100} 
                            y={subPos.y - 45} 
                            width="200" 
                            height="90"
                          >
                            <div className="flex items-center justify-center w-full h-full" style={{ transform: `rotate(${subMid}deg)` }}>
                              <span className={`text-[24px] font-bold leading-tight text-center transition-colors duration-300 whitespace-nowrap ${isSubActive ? 'text-[#ffffff] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-[#73c7ed]'}`}>{subItem}</span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {/* Merged R2 and R3 */}
                    <path d={getArcPath(150, 500, r2Inner, r3Outer, startAngle, endAngle)} fill={`url(#mergedGrad-${i})`} stroke="rgba(0, 195, 255, 0.25)" strokeWidth="1" className="transition-colors duration-300" />
                    
                    {/* Product Text (Merged R2 & R3) */}
                    <foreignObject 
                      x={mergedPos.x - 110} 
                      y={mergedPos.y - 80} 
                      width="220" 
                      height="160"
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full" style={{ transform: `rotate(${midAngle}deg)` }}>
                        {sector.products.map((p, idx) => (
                          <span key={idx} className={`text-[34px] font-bold leading-tight text-center transition-colors duration-300 px-4 whitespace-nowrap w-full ${isActive ? 'text-[#ffffff] drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' : 'text-[#73c7ed]'}`}>{p}</span>
                        ))}
                      </div>
                    </foreignObject>
                  </>
                )}

                {/* R1 */}
                <path d={getArcPath(150, 500, r1Inner, r1Outer, startAngle, endAngle)} fill={r1Fill} stroke="rgba(0, 195, 255, 0.35)" strokeWidth="1" className="transition-colors duration-300" />

                {/* Active Border Glow */}
                {isActive && (
                  <motion.path 
                    d={getArcPath(150, 500, r1Inner, r3Outer, startAngle, endAngle)} 
                    fill="none" 
                    stroke="#00ffff" 
                    strokeWidth="3" 
                    filter="url(#glow)" 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none"
                  />
                )}

                {/* Tech Markers at sector boundaries */}
                <circle cx={polarToCartesian(150, 500, r3Outer, startAngle).x} cy={polarToCartesian(150, 500, r3Outer, startAngle).y} r="4" fill="#00c3ff" opacity="0.6" />
                <circle cx={polarToCartesian(150, 500, r2Inner, startAngle).x} cy={polarToCartesian(150, 500, r2Inner, startAngle).y} r="3" fill="#00c3ff" opacity="0.4" />

                {/* R1 Content Group: Number */}
                <motion.g transform={`rotate(${midAngle}, ${r1Pos.x}, ${r1Pos.y})`}>
                  {/* Step Number */}
                  <text
                    x={r1Pos.x}
                    y={r1Pos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isActive ? "#030b14" : "#60e3ff"}
                    fontSize="34"
                    fontWeight="900"
                    className="font-mono tracking-widest transition-colors duration-300"
                    style={{ filter: isActive ? 'none' : 'url(#glow)' }}
                  >
                    {`0${i + 1}`}
                  </text>
                </motion.g>
              </motion.g>
            );
          })}

            {/* Global Flowing Arc Animation (Cinematic Data Arcs) */}
            <g mask="url(#silkMask)">
              {[
                { r: 540, start: -40, end: 40, dur: 4 },
                { r: 580, start: -70, end: 10, dur: 6 },
                { r: 500, start: -10, end: 80, dur: 5 },
                { r: 640, start: -85, end: -20, dur: 7 },
                { r: 560, start: 30, end: 85, dur: 5.5 },
              ].map((arc, i) => {
                const startPos = polarToCartesian(200, 520, arc.r, arc.start);
                const endPos = polarToCartesian(200, 520, arc.r, arc.end);
                return (
                  <g key={i}>
                    {/* Static Arc Path */}
                    <path
                      d={getArcLine(200, 520, arc.r, arc.start, arc.end)}
                      fill="none"
                      stroke="#00c3ff"
                      strokeWidth="0.5"
                      opacity="0.2"
                    />
                    {/* Pulsing Light on Arc */}
                    <motion.path
                      d={getArcLine(200, 520, arc.r, arc.start, arc.end)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="20 400"
                      animate={{ strokeDashoffset: [420, 0] }}
                      transition={{ duration: arc.dur, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                      filter="url(#glow)"
                    />
                    {/* Nodes / Flares at ends */}
                    <circle cx={startPos.x} cy={startPos.y} r="2" fill="#ffffff" filter="url(#flare)" />
                    <circle cx={endPos.x} cy={endPos.y} r="2" fill="#ffffff" filter="url(#flare)" />
                  </g>
                );
              })}
            </g>

            {/* Animated Data Streams bridging the left and right */}
            <g opacity="0.8">
              {/* Top Stream */}
              <path d="M 350 300 L 950 300" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="300" r="2.5" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [350, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Middle Stream */}
              <path d="M 450 520 L 950 520" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="520" r="3" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [450, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.rect
                y="519" height="2" fill="#00c3ff" filter="url(#glow)"
                animate={{ x: [450, 950], width: [0, 80, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Bottom Stream */}
              <path d="M 350 740 L 950 740" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="740" r="2.5" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [350, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </g>
        </svg>
      </div>
      
      {/* Right Side: Content Area */}
      <div className="flex-1 h-full overflow-hidden relative z-10">
        {/* Decorative Corner Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00c3ff40] pointer-events-none z-20"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00c3ff40] pointer-events-none z-20"></div>
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00c3ff40] pointer-events-none z-20"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00c3ff40] pointer-events-none z-20"></div>

        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex ?? 'home'}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="absolute inset-0 py-12 pr-16 pl-8 overflow-y-auto hide-scrollbar"
          >
            {activeIndex === 1 ? (
          <div className="flex flex-col w-full h-full overflow-hidden relative rounded-3xl bg-[#08162b]/80 backdrop-blur-sm text-white font-sans p-8 border border-[#00c3ff10]">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,195,255,0.1)_0%,transparent_100%)] z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header / Breadcrumbs */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-4xl font-bold text-white tracking-wider flex items-center gap-3">
                  人影机理
                  {activeSubIndex !== null && (
                    <>
                      <ChevronRight className="text-[#00c3ff] opacity-50" />
                      <span className="text-[#60e3ff]">{principles[activeSubIndex].title}</span>
                    </>
                  )}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-4"></div>
              </div>

              {activeSubIndex === null ? (
                /* OVERVIEW MODE */
                <div className="flex-1 flex flex-col">
                  <p className="text-[#a8b2d0] text-2xl mb-10 leading-relaxed max-w-6xl">
                    人工影响天气是通过人为干预，改变局部大气物理过程，从而实现增雨、防雹、消雾等目的。以下是五种核心的人影机理，请选择查看详情：
                  </p>
                  <div className="grid grid-cols-5 gap-8">
                    {principles.map((item, idx) => {
                      const IconComp = item.icons[0].icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -10, scale: 1.03 }}
                          onClick={() => setActiveSubIndex(idx)}
                          className="bg-[#0a192f]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 cursor-pointer group hover:border-[#00c3ff]/60 hover:bg-[#00c3ff]/10 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_50px_rgba(0,195,255,0.2)] flex flex-col relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#00c3ff08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="w-24 h-24 rounded-3xl bg-[#00c3ff15] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#00c3ff25] transition-all duration-500 border border-white/5">
                              <IconComp size={48} className="text-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-6 group-hover:text-[#60e3ff] transition-colors tracking-tight">{item.title}</h3>
                            <p className="text-[#a8b2d0] text-xl leading-relaxed flex-1 line-clamp-4 group-hover:text-[#e0f2fe] transition-colors">{item.mechanism}</p>
                            <div className="mt-10 flex items-center text-[#00c3ff] text-2xl font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-20px] group-hover:translate-x-0 duration-500">
                              探索详情 <ChevronRight size={28} className="ml-2" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* DETAIL MODE */
                <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveSubIndex(null)}
                      className="flex items-center gap-2 text-[#a8b2d0] hover:text-white transition-colors group w-fit px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回概览
                    </button>
                  </div>
                  
                  {/* Detail Content Area */}
                  <div className="flex-1 bg-[#0a192f]/30 rounded-2xl border border-[#00c3ff15] p-10 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSubIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 h-24 rounded-2xl bg-[#00c3ff10] flex items-center justify-center mb-6">
                          {React.createElement(principles[activeSubIndex].icons[0].icon, { size: 48, className: "text-[#00ffff]" })}
                        </div>
                        <h3 className="text-5xl font-bold text-[#60e3ff] mb-6">{principles[activeSubIndex].title}</h3>
                        
                        <div className="space-y-8">
                          <div>
                            <h4 className="text-3xl font-bold text-white mb-3 flex items-center gap-2">
                              <Microscope className="text-[#00c3ff]" size={32} /> 核心机理
                            </h4>
                            <p className="text-[#e0f2fe] text-2xl leading-relaxed opacity-90 bg-white/5 p-5 rounded-xl border border-white/10">
                              {principles[activeSubIndex].mechanism}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                <CloudFog className="text-[#00c3ff]" size={28} /> 适用条件
                              </h4>
                              <p className="text-[#a8b2d0] text-xl leading-relaxed">
                                {principles[activeSubIndex].conditions}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                <Zap className="text-[#00c3ff]" size={28} /> 作业方法
                              </h4>
                              <p className="text-[#a8b2d0] text-xl leading-relaxed">
                                {principles[activeSubIndex].methods}
                              </p>
                            </div>
                          </div>

                          {principles[activeSubIndex].types && principles[activeSubIndex].types.length > 0 && (
                            <div>
                              <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Layers className="text-[#00c3ff]" size={28} /> 主要类型
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                {principles[activeSubIndex].types.map((type, tIdx) => (
                                  <div key={tIdx} className="bg-[#00c3ff05] border border-[#00c3ff20] rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-bold text-xl text-[#00ffff]">{type.name}</span>
                                      <span className="text-sm px-2 py-1 rounded bg-[#00c3ff20] text-[#00c3ff]">{type.tag}</span>
                                    </div>
                                    <p className="text-[#a8b2d0] text-lg">{type.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeIndex === 0 ? (
          <div className="flex flex-col w-full h-full overflow-hidden relative rounded-3xl bg-[#08162b]/80 backdrop-blur-sm text-white font-sans p-8 border border-[#00c3ff10]">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,195,255,0.1)_0%,transparent_100%)] z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header / Breadcrumbs */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-4xl font-bold text-white tracking-wider flex items-center gap-4">
                  发展历程
                  {activeSubIndex !== null && (
                    <>
                      <ChevronRight className="text-[#00c3ff] opacity-50" size={32} />
                      <span className="text-[#60e3ff]">{sectors[0].subItems?.[activeSubIndex]}</span>
                    </>
                  )}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-6"></div>
              </div>

              {activeSubIndex === null ? (
                /* OVERVIEW MODE */
                <div className="flex-1 flex flex-col">
                  <p className="text-[#a8b2d0] text-2xl mb-6 leading-relaxed max-w-8xl">
                    回顾我国人工影响天气事业从无到有、从小到大的辉煌发展历程。请选择以下历史阶段查看详情：
                  </p>
                  
                  {/* Horizontal Timeline (Dynamic Flex Style) */}
                  <div className="flex-1 relative w-full mt-6 flex flex-col items-center justify-center min-h-0">
                    {/* Wavy Horizontal Line - Background Layer */}
                    <div className="absolute left-0 right-0 h-[300px] top-1/2 -translate-y-1/2 z-0 opacity-30 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 1400 300" preserveAspectRatio="none">
                        <path d="M 0 150 C 200 50, 400 250, 600 150 C 800 50, 1000 250, 1200 150 C 1400 50" fill="none" stroke="rgba(0,195,255,0.2)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        <motion.path 
                          d="M 0 150 C 200 50, 400 250, 600 150 C 800 50, 1000 250, 1200 150 C 1400 50" 
                          fill="none" stroke="#00c3ff" strokeWidth="4" vectorEffect="non-scaling-stroke"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                          style={{ filter: 'drop-shadow(0 0 20px #00c3ff)' }}
                        />
                      </svg>
                    </div>

                    <div className="relative w-full h-full flex justify-around items-stretch px-8 z-10 min-h-0">
                      {sectors[0].subItems?.map((item, idx) => {
                        const year = item; // Simplified to just year
                        const isYearTop = idx % 2 === 0;
                        const historyData = developmentHistory[idx];

                        return (
                          <div key={idx} className="flex flex-col items-center w-[460px] group" onClick={() => setActiveSubIndex(idx)}>
                            
                            {/* TOP SECTION (Flexible height) */}
                            <div className="flex-1 w-full flex flex-col justify-end pb-6">
                              {isYearTop ? (
                                // Year Badge (Top)
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="self-center px-10 py-3 rounded-full border-2 border-[#00c3ff]/50 bg-[#00c3ff]/10 text-[#00c3ff] text-4xl font-black italic tracking-widest shadow-[0_0_20px_rgba(0,195,255,0.3)] group-hover:bg-[#00c3ff]/30 group-hover:scale-110 transition-all duration-500 cursor-pointer"
                                >
                                  {year}
                                </motion.div>
                              ) : (
                                // Content Card (Top)
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="w-full bg-[#0a192f]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 hover:border-[#00c3ff]/80 transition-all duration-700 hover:shadow-[0_0_50px_rgba(0,195,255,0.25)] cursor-pointer overflow-hidden relative group/card"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#00c3ff05] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                                  <div className="relative z-10 space-y-4">
                                    {historyData?.imageSrc && (
                                      <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                        <img src={historyData.imageSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out" alt={year} referrerPolicy="no-referrer" />
                                      </div>
                                    )}
                                    <div>
                                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-[#60e3ff] transition-colors line-clamp-1">{historyData?.items[0]}</h3>
                                      <div className="space-y-2">
                                        {historyData?.items.slice(1, 4).map((bullet, bIdx) => (
                                          <div key={bIdx} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#00c3ff] mt-2 shrink-0 shadow-[0_0_6px_#00c3ff]"></div>
                                            <span className="text-[#a8b2d0] text-lg leading-relaxed line-clamp-2">{bullet}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {/* MIDDLE SECTION (Fixed height node) */}
                            <div className="h-20 flex items-center justify-center relative shrink-0">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-10 h-10 rounded-full bg-[#00ffff] shadow-[0_0_40px_#00ffff] cursor-pointer group-hover:scale-125 transition-transform duration-500 z-20 border-4 border-white/20" 
                              />
                              <div className="absolute inset-0 w-10 h-10 rounded-full bg-[#00ffff] animate-ping opacity-30" />
                            </div>

                            {/* BOTTOM SECTION (Flexible height) */}
                            <div className="flex-1 w-full flex flex-col justify-start pt-6">
                              {isYearTop ? (
                                // Content Card (Bottom)
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="w-full bg-[#0a192f]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 hover:border-[#00c3ff]/80 transition-all duration-700 hover:shadow-[0_0_50px_rgba(0,195,255,0.25)] cursor-pointer overflow-hidden relative group/card"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#00c3ff05] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                                  <div className="relative z-10 space-y-4">
                                    {historyData?.imageSrc && (
                                      <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                        <img src={historyData.imageSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out" alt={year} referrerPolicy="no-referrer" />
                                      </div>
                                    )}
                                    <div>
                                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-[#60e3ff] transition-colors line-clamp-1">{historyData?.items[0]}</h3>
                                      <div className="space-y-2">
                                        {historyData?.items.slice(1, 4).map((bullet, bIdx) => (
                                          <div key={bIdx} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#00c3ff] mt-2 shrink-0 shadow-[0_0_6px_#00c3ff]"></div>
                                            <span className="text-[#a8b2d0] text-lg leading-relaxed line-clamp-2">{bullet}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : (
                                // Year Badge (Bottom)
                                <motion.div 
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="self-center px-10 py-3 rounded-full border-2 border-[#00c3ff]/50 bg-[#00c3ff]/10 text-[#00c3ff] text-4xl font-black italic tracking-widest shadow-[0_0_20px_rgba(0,195,255,0.3)] group-hover:bg-[#00c3ff]/30 group-hover:scale-110 transition-all duration-500 cursor-pointer"
                                >
                                  {year}
                                </motion.div>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* DETAIL MODE */
                <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveSubIndex(null)}
                      className="flex items-center gap-2 text-[#a8b2d0] hover:text-white transition-colors group w-fit px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回概览
                    </button>
                  </div>
                  
                  {/* Detail Content Area */}
                  <div className="flex-1 bg-[#0a192f]/30 rounded-2xl border border-[#00c3ff15] p-10 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSubIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-24 h-24 rounded-2xl bg-[#00c3ff10] flex items-center justify-center">
                            <Wind size={48} className="text-[#00ffff]" />
                          </div>
                          <div>
                            <h3 className="text-5xl font-bold text-[#60e3ff] mb-2">{sectors[0].subItems?.[activeSubIndex]}</h3>
                            <p className="text-[#a8b2d0] text-2xl">{developmentHistory[activeSubIndex]?.items[0]}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h4 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                              <Activity className="text-[#00c3ff]" size={32} /> 关键事件
                            </h4>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                              <ul className="space-y-4">
                                {developmentHistory[activeSubIndex]?.items.slice(1).map((sub, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-3 text-[#e0f2fe] text-2xl leading-relaxed">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00c3ff] mt-2.5 shrink-0 shadow-[0_0_8px_#00c3ff]"></div>
                                    <span>{sub}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {developmentHistory[activeSubIndex]?.imageSrc && (
                            <div className="space-y-6">
                              <h4 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                                <Camera className="text-[#00c3ff]" size={32} /> 历史影像
                              </h4>
                              <div className="rounded-2xl overflow-hidden border border-[#00c3ff20] relative group">
                                <div className="absolute inset-0 bg-[#00c3ff] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
                                <img 
                                  src={developmentHistory[activeSubIndex].imageSrc} 
                                  alt={developmentHistory[activeSubIndex].imageAlt}
                                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                                  <p className="text-white text-xl font-medium">{developmentHistory[activeSubIndex].imageAlt}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeIndex === 2 ? (
          <div className="flex flex-col w-full h-full overflow-hidden relative rounded-3xl bg-[#08162b]/80 backdrop-blur-sm text-white font-sans p-8 border border-[#00c3ff10]">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,195,255,0.1)_0%,transparent_100%)] z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header / Breadcrumbs */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-4xl font-bold text-white tracking-wider flex items-center gap-4">
                  作业装备
                  {activeSubIndex !== null && (
                    <>
                      <ChevronRight className="text-[#00c3ff] opacity-50" size={32} />
                      <span className="text-[#60e3ff]">{equipmentSubItems[activeSubIndex].title}</span>
                    </>
                  )}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-6"></div>
              </div>

              {activeSubIndex === null ? (
                /* OVERVIEW MODE */
                <div className="flex-1 flex flex-col">
                  <p className="text-[#a8b2d0] text-2xl mb-10 leading-relaxed max-w-8xl">
                    现代化的人工影响天气作业离不开先进的装备支持。我国已构建起涵盖空基、地基的立体化作业装备体系，能够针对不同天气条件和地形环境实施精准催化。请选择以下装备查看详情：
                  </p>
                  <div className="grid grid-cols-5 gap-8">
                    {equipmentSubItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => setActiveSubIndex(idx)}
                        className="bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-3xl p-12 cursor-pointer group hover:border-[#00c3ff60] hover:bg-[#00c3ff10] transition-all duration-300 shadow-[0_0_20px_rgba(0,195,255,0.05)] hover:shadow-[0_0_40px_rgba(0,195,255,0.15)] flex flex-col"
                      >
                        <div className="w-24 h-24 rounded-2xl bg-[#00c3ff10] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                          <item.icon size={48} className="text-[#00ffff]" />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-6 group-hover:text-[#60e3ff] transition-colors">{item.title}</h3>
                        <p className="text-[#a8b2d0] text-xl leading-relaxed flex-1">{item.desc}</p>
                        <div className="mt-10 flex items-center text-[#00c3ff] text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          查看详情 <ChevronRight size={32} className="ml-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* DETAIL MODE */
                <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveSubIndex(null)}
                      className="flex items-center gap-2 text-[#a8b2d0] hover:text-white transition-colors group w-fit px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回概览
                    </button>
                  </div>
                  
                  {/* Detail Content Area */}
                  <div className="flex-1 bg-[#0a192f]/30 rounded-2xl border border-[#00c3ff15] p-10 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSubIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-[#00c3ff10] flex items-center justify-center mb-6">
                          {React.createElement(equipmentSubItems[activeSubIndex].icon, { size: 32, className: "text-[#00ffff]" })}
                        </div>
                        <h3 className="text-3xl font-bold text-[#60e3ff] mb-6">{equipmentSubItems[activeSubIndex].title}</h3>
                        <p className="text-[#e0f2fe] text-lg leading-relaxed mb-10 opacity-90">
                          {equipmentSubItems[activeSubIndex].desc}
                        </p>
                        
                        {/* Placeholder for actual rich content */}
                        <div className="space-y-6">
                          <div className="h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/20 font-mono">
                            [具体内容区域 - {equipmentSubItems[activeSubIndex].title}]
                          </div>
                          <div className="h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/20 font-mono">
                            [图表或详细数据展示区]
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeIndex === 3 ? (
          <div className="flex flex-col w-full h-full overflow-hidden relative rounded-3xl bg-[#08162b]/80 backdrop-blur-sm text-white font-sans p-8 border border-[#00c3ff10]">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,195,255,0.1)_0%,transparent_100%)] z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header / Breadcrumbs */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-4xl font-bold text-white tracking-wider flex items-center gap-4">
                  工作体系
                  {activeSubIndex !== null && (
                    <>
                      <ChevronRight className="text-[#00c3ff] opacity-50" size={32} />
                      <span className="text-[#60e3ff]">{workSystemSubItems[activeSubIndex].title}</span>
                    </>
                  )}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-6"></div>
              </div>

              {activeSubIndex === null ? (
                /* OVERVIEW MODE */
                <div className="flex-1 flex flex-col">
                  <p className="text-[#a8b2d0] text-3xl mb-10 leading-relaxed max-w-8xl">
                    构建科学、规范、高效的人工影响天气工作体系，是确保作业安全与效益的核心。我们的工作体系涵盖了从顶层法规设计到基层业务执行的各个环节。请选择以下模块查看详情：
                  </p>
                  <div className="grid grid-cols-3 gap-10">
                    {workSystemSubItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => setActiveSubIndex(idx)}
                        className="bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-3xl p-12 cursor-pointer group hover:border-[#00c3ff60] hover:bg-[#00c3ff10] transition-all duration-300 shadow-[0_0_20px_rgba(0,195,255,0.05)] hover:shadow-[0_0_40px_rgba(0,195,255,0.15)] flex flex-col"
                      >
                        <div className="w-24 h-24 rounded-2xl bg-[#00c3ff10] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                          <item.icon size={48} className="text-[#00ffff]" />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-6 group-hover:text-[#60e3ff] transition-colors">{item.title}</h3>
                        <p className="text-[#a8b2d0] text-xl leading-relaxed flex-1">{item.desc}</p>
                        <div className="mt-10 flex items-center text-[#00c3ff] text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          查看详情 <ChevronRight size={32} className="ml-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* DETAIL MODE */
                <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveSubIndex(null)}
                      className="flex items-center gap-2 text-[#a8b2d0] hover:text-white transition-colors group w-fit px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回概览
                    </button>
                  </div>
                  
                  {/* Detail Content Area */}
                  <div className="flex-1 bg-[#0a192f]/30 rounded-2xl border border-[#00c3ff15] p-10 overflow-y-auto hide-scrollbar relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSubIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 h-24 rounded-2xl bg-[#00c3ff10] flex items-center justify-center mb-6">
                          {React.createElement(workSystemSubItems[activeSubIndex].icon, { size: 48, className: "text-[#00ffff]" })}
                        </div>
                        <h3 className="text-5xl font-bold text-[#60e3ff] mb-6">{workSystemSubItems[activeSubIndex].title}</h3>
                        <p className="text-[#e0f2fe] text-2xl leading-relaxed mb-10 opacity-90">
                          {workSystemSubItems[activeSubIndex].desc}
                        </p>
                        
                        {/* Placeholder for actual rich content */}
                        <div className="space-y-6">
                          <div className="h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/20 font-mono">
                            [具体内容区域 - {workSystemSubItems[activeSubIndex].title}]
                          </div>
                          <div className="h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/20 font-mono">
                            [图表或详细数据展示区]
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full px-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-2 h-10 bg-[#00c3ff] rounded-full shadow-[0_0_15px_#00c3ff]"></div>
              <h2 className="text-5xl font-bold text-white tracking-wider">历史沿革与业务体系</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-8"></div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {historyEvents.map((item, index) => {
                const isEventActive = activeIndex !== null && 
                  item.year >= sectors[activeIndex].year && 
                  (activeIndex === sectors.length - 1 || item.year < sectors[activeIndex + 1].year);

                return (
                  <motion.div 
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    animate={{ 
                      opacity: activeIndex === null || isEventActive ? 1 : 0.3,
                      backgroundColor: isEventActive ? 'rgba(0, 195, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center py-8 px-12 rounded-3xl transition-all duration-500 border backdrop-blur-md ${
                      isEventActive 
                        ? 'border-[#00c3ff60] shadow-[0_0_40px_rgba(0,195,255,0.15)]' 
                        : 'border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col w-40 shrink-0 relative">
                      {isEventActive && (
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-2 h-12 bg-[#00c3ff] rounded-full shadow-[0_0_15px_#00c3ff]"></div>
                      )}
                      <span className={`font-bold text-5xl leading-none tracking-tighter transition-colors duration-300 ${isEventActive ? 'text-[#60e3ff]' : 'text-[#73c7ed] opacity-60'}`}>{item.year}</span>
                      <span className="text-[#73c7ed] text-lg mt-3 uppercase tracking-widest opacity-50 font-bold">{item.date}</span>
                    </div>
                    <div className={`flex-1 text-3xl font-medium pl-12 border-l border-white/10 leading-relaxed transition-colors duration-300 ${isEventActive ? 'text-white' : 'text-[#e0f2fe] opacity-70'}`}>
                      {item.event}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</div>
);
}
