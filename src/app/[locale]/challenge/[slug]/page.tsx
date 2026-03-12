import Link from "next/link";
import { use } from "react";

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer?: string;
  code?: string;
}

interface Challenge {
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  category: string;
  questions: Question[];
  content?: {
    intro: string;
    objectives: string[];
    hints: string[];
  };
}

const challenges: Record<string, Challenge> = {
  "event-loop": {
    slug: "event-loop",
    title: "JavaScript Event Loop",
    description: "深入理解 JavaScript 事件循环机制",
    difficulty: "MEDIUM",
    category: "FRONTEND PRINCIPLES",
    questions: [
      {
        id: 1,
        question: "以下代码的输出顺序是什么?",
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: ["1 2 3 4", "1 4 3 2", "1 4 2 3", "2 1 3 4"],
        answer: "1 4 3 2"
      },
      {
        id: 2,
        question: "Microtask Queue 包含哪些内容?",
        options: ["setTimeout", "Promise.then", "MutationObserver", "setImmediate"],
        answer: "Promise.then"
      },
      {
        id: 3,
        question: "以下代码的输出顺序是?",
        code: `async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
async function async2() {
  console.log('3');
}
console.log('4');
async1();
console.log('5');`,
        options: ["4 1 3 5 2", "1 3 4 5 2", "4 5 1 3 2", "4 1 5 3 2"],
        answer: "4 1 3 5 2"
      }
    ]
  },
  "prompt-engineering": {
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    description: "掌握 AI 提示词编写技巧",
    difficulty: "EASY",
    category: "AI CHALLENGES",
    questions: [
      {
        id: 1,
        question: "以下哪个是更好的 Prompt 结构?",
        options: [
          "写一个函数",
          "写一个 JavaScript 函数,函数名为 calculateSum,接收两个数字参数 a 和 b,返回它们的和,使用 TypeScript,添加 JSDoc 注释",
          "写个求和函数",
          "写函数"
        ],
        answer: "写一个 JavaScript 函数,函数名为 calculateSum,接收两个数字参数 a 和 b,返回它们的和,使用 TypeScript,添加 JSDoc 注释"
      },
      {
        id: 2,
        question: "Few-shot Prompting 是什么?",
        options: [
          "给 AI 很长的提示",
          "在提示中包含少量示例",
          "多次调用 AI",
          "使用角色提示"
        ],
        answer: "在提示中包含少量示例"
      }
    ]
  },
  "html-basics": {
    slug: "html-basics",
    title: "HTML 基础训练",
    description: "学习 HTML 基础标签和结构",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "HTML（超文本标记语言）是构建网页的基础。本挑战将帮助你掌握 HTML 的核心概念和常用标签。",
      objectives: [
        "理解 HTML 文档结构",
        "掌握常用 HTML 标签（div, h1-h6, p, button, input 等）",
        "学习 HTML 元素嵌套和属性",
        "理解 DOM 事件基础"
      ],
      hints: [
        "HTML 标签通常成对出现，如 <div></div>",
        "id 属性用于唯一标识元素",
        "class 属性用于为一类元素添加样式"
      ]
    }
  },
  "css-flexbox": {
    slug: "css-flexbox",
    title: "Flexbox 布局训练",
    description: "学习 CSS Flexbox 布局",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "Flexbox（弹性盒布局）是一种现代的 CSS 布局模式，可以轻松实现复杂的响应式布局。",
      objectives: [
        "理解 Flexbox 的核心概念（主轴、交叉轴）",
        "掌握 justify-content 和 align-items",
        "学习 flex-direction 和 flex-wrap",
        "理解 flex-grow、flex-shrink 和 flex-basis"
      ],
      hints: [
        "display: flex 开启 Flexbox 布局",
        "justify-content 控制主轴对齐",
        "align-items 控制交叉轴对齐"
      ]
    }
  },
  "css-grid": {
    slug: "css-grid",
    title: "Grid 布局训练",
    description: "学习 CSS Grid 布局",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "CSS Grid 是一个二维布局系统，特别适合构建复杂的网页布局。",
      objectives: [
        "理解 Grid 布局的基本概念",
        "掌握 grid-template-columns 和 grid-template-rows",
        "学习 grid-template-areas 实现复杂布局",
        "理解 grid-gap 和 justify/align-items"
      ],
      hints: [
        "display: grid 开启 Grid 布局",
        "repeat() 函数可以简化重复的轨道定义",
        "fr 单位表示可用空间的分数"
      ]
    }
  },
  "animation-css": {
    slug: "animation-css",
    title: "CSS 动画",
    description: "学习 CSS 过渡和动画",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "CSS 动画可以让网页元素动起来，创造更好的用户体验。",
      objectives: [
        "掌握 transition 实现过渡效果",
        "学习 @keyframes 定义关键帧动画",
        "理解 animation 属性及其子属性",
        "学习常见的动画效果实现"
      ],
      hints: [
        "transition: all 0.3s ease 实现平滑过渡",
        "@keyframes 定义动画的每个关键状态",
        "animation-iteration-count: infinite 实现循环动画"
      ]
    }
  },
  "dom-manipulation": {
    slug: "dom-manipulation",
    title: "DOM 操作练习",
    description: "学习 DOM 创建、插入、删除",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "DOM（文档对象模型）是 JavaScript 操作网页的核心接口。",
      objectives: [
        "掌握 document.getElementById 和 querySelector",
        "学习 createElement 创建新元素",
        "掌握 appendChild 和 remove 方法",
        "理解事件监听器 addEventListener"
      ],
      hints: [
        "document.getElementById 获取单个元素",
        "document.querySelector 可以使用 CSS 选择器",
        "element.addEventListener('click', fn) 绑定事件"
      ]
    }
  },
  "react-basics": {
    slug: "react-basics",
    title: "React 计数器",
    description: "学习 React 基础状态管理",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "React 是一个用于构建用户界面的 JavaScript 库，组件化和状态管理是其核心概念。",
      objectives: [
        "理解 React 组件化思想",
        "掌握 useState Hook 的使用",
        "学习 JSX 语法基础",
        "理解状态更新和重新渲染"
      ],
      hints: [
        "useState 返回状态值和更新函数",
        "状态更新是异步的",
        "JSX 中使用 {} 嵌入 JavaScript 表达式"
      ]
    }
  },
  "react-todo": {
    slug: "react-todo",
    title: "React Todo List",
    description: "构建一个简单的 Todo 列表应用",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "Todo List 是一个经典的练手项目，帮助你综合运用 React 基础知识。",
      objectives: [
        "掌握数组状态的管理",
        "学习 map 渲染列表",
        "理解条件渲染",
        "学习表单处理和事件绑定"
      ],
      hints: [
        "使用 filter 删除数组元素",
        "使用 map 渲染 JSX 列表",
        "列表渲染需要唯一的 key"
      ]
    }
  },
  "canvas-animation": {
    slug: "canvas-animation",
    title: "Canvas 动画",
    description: "创建动态 Canvas 动画",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "HTML5 Canvas 是一个强大的绘图 API，可以用来创建游戏、数据可视化等。",
      objectives: [
        "掌握 Canvas 基本绘图方法",
        "学习 requestAnimationFrame 实现动画",
        "理解坐标系统和颜色",
        "学习碰撞检测基础"
      ],
      hints: [
        "getContext('2d') 获取 2D 绘图上下文",
        "requestAnimationFrame 实现流畅动画",
        "clearRect 用于清除画布"
      ]
    }
  },
  "fetch-api": {
    slug: "fetch-api",
    title: "Fetch API 数据获取",
    description: "学习使用 Fetch API 获取数据",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "Fetch API 是现代浏览器提供的网络请求接口，是前后端数据交互的基础。",
      objectives: [
        "掌握 fetch 的基本用法",
        "学习 async/await 异步编程",
        "理解 Promise 和响应处理",
        "学习错误处理和 JSON 解析"
      ],
      hints: [
        "fetch 返回 Promise 对象",
        "response.json() 解析 JSON 数据",
        "try/catch 用于错误处理"
      ]
    }
  },
  "canvas-demo": {
    slug: "canvas-demo",
    title: "Canvas 绘图训练",
    description: "学习 HTML5 Canvas 基础绘图",
    difficulty: "EASY",
    category: "PLAYGROUND",
    questions: [],
    content: {
      intro: "Canvas 是 HTML5 提供的强大绘图功能，本挑战带你入门 Canvas 基础绘图。",
      objectives: [
        "掌握 Canvas 基本设置",
        "学习绘制矩形和圆形",
        "理解路径和描边/填充",
        "学习文本绘制"
      ],
      hints: [
        "canvas.width 和 canvas.height 设置画布大小",
        "fillRect 绘制填充矩形",
        "stroke 描边，fill 填充"
      ]
    }
  }
};

const playgroundChallenges = [
  'html-basics', 'css-flexbox', 'css-grid', 'animation-css',
  'dom-manipulation', 'react-basics', 'react-todo',
  'canvas-animation', 'canvas-demo', 'fetch-api'
];

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const challenge = challenges[slug];
  const isPlayground = playgroundChallenges.includes(slug);

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="card-terminal">
          <div className="card-terminal-header">
            +-- ERROR --+
          </div>
          <div className="p-8 text-center">
            <p className="text-lg mb-4">Challenge not found</p>
            <Link href="/en/challenge" className="btn-terminal inline-block">
              [BACK TO CHALLENGES]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs opacity-60 mb-2">
          <Link href="/en/challenge" className="hover:text-primary transition-colors">
            Challenges
          </Link>
          <span>/</span>
          <span>{challenge.slug}</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">
          {challenge.title}
        </h1>
        <p className="text-sm opacity-60 mb-4">{challenge.description}</p>
        
        <div className="flex flex-wrap gap-4 text-xs">
          <span 
            className="px-2 py-1 font-bold"
            style={{ 
              color: difficultyColors[challenge.difficulty],
              border: `1px solid ${difficultyColors[challenge.difficulty]}`
            }}
          >
            {challenge.difficulty}
          </span>
          <span className="opacity-60 py-1">{challenge.category}</span>
        </div>
      </div>

      {isPlayground && challenge.content && (
        <div className="card-terminal mb-8">
          <div className="card-terminal-header">
            +-- 挑战介绍 --+
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-primary mb-2">概述</h3>
              <p className="text-sm opacity-80">{challenge.content.intro}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-primary mb-2">学习目标</h3>
              <ul className="space-y-1">
                {challenge.content.objectives.map((obj, i) => (
                  <li key={i} className="text-sm opacity-80 flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-primary mb-2">提示</h3>
              <ul className="space-y-1">
                {challenge.content.hints.map((hint, i) => (
                  <li key={i} className="text-sm opacity-60 flex items-start gap-2">
                    <span className="text-warning">💡</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {isPlayground ? (
        <div className="card-terminal">
          <div className="card-terminal-header">
            +-- 练习模式 --+
          </div>
          <div className="p-6 text-center">
            <p className="text-sm opacity-60 mb-6">
              在 Playground 中实践本挑战的内容
            </p>
            <Link 
              href={`/en/challenge/${slug}/playground`}
              className="btn-terminal text-lg px-8 py-3"
            >
              [打开 Playground]
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {challenge.questions.map((q, index) => (
            <div key={q.id} className="card-terminal">
              <div className="card-terminal-header">
                +-- QUESTION {index + 1} --+
              </div>
              <div className="p-4">
                <p className="text-sm mb-4 font-bold">
                  {q.id}. {q.question}
                </p>
                
                {q.code && (
                  <pre className="bg-background border border-border p-4 mb-4 text-xs md:text-sm overflow-x-auto">
                    <code>{q.code}</code>
                  </pre>
                )}

                {q.options && (
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label 
                        key={optIndex}
                        className="flex items-start gap-3 p-3 border border-border hover:bg-muted hover:text-foreground cursor-pointer transition-all"
                      >
                        <input 
                          type="radio" 
                          name={`question-${q.id}`}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button className="btn-terminal text-lg px-8 py-3">
              [SUBMIT ANSWERS]
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link 
          href="/en/challenge"
          className="btn-terminal text-sm px-4 py-2"
        >
          [← 返回列表]
        </Link>
        {isPlayground && (
          <Link 
            href={`/en/challenge/${slug}/playground`}
            className="btn-terminal text-sm px-4 py-2"
          >
            [打开 Playground →]
          </Link>
        )}
      </div>

      <div className="mt-8 text-center text-xs opacity-40">
        &gt; root@ai-era:~/challenge/{challenge.slug}# _
        <span className="animate-blink">█</span>
      </div>
    </div>
  );
}
