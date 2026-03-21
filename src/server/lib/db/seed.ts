import { db } from './index';
import { categories, challenges, challengeResources } from './schema';

const seedData = async () => {
  console.log('Seeding database...');

  await db.delete(challengeResources);
  await db.delete(challenges);
  await db.delete(categories);

  const categoryData = [
    { name: 'HTML', description: 'HTML 基础挑战 - 学习 HTML 标签、表单和布局', icon: 'html', displayOrder: 1 },
    { name: 'CSS', description: 'CSS 样式挑战 - 学习 CSS 样式、动画和响应式设计', icon: 'css', displayOrder: 2 },
    { name: 'JavaScript', description: 'JavaScript 挑战 - 学习 JS 基础和高级特性', icon: 'javascript', displayOrder: 3 },
    { name: 'React', description: 'React 组件挑战 - 学习 React 生态和 hooks', icon: 'react', displayOrder: 4 },
    { name: 'Vue', description: 'Vue 组件挑战 - 学习 Vue 3 和组合式 API', icon: 'vue', displayOrder: 5 },
    { name: 'TypeScript', description: 'TypeScript 挑战 - 学习类型系统和高级类型', icon: 'typescript', displayOrder: 6 },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  
  console.log(`Inserted ${insertedCategories.length} categories`);

  const categoryMap = new Map(
    insertedCategories.map((c) => [c.name, c.id])
  );

  const challengeData = [
    // HTML 分类
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-form-validation',
      name: 'HTML 表单验证',
      description: '创建一个带有客户端验证的注册表单，包括用户名、邮箱和密码字段，实现实时验证反馈',
      difficulty: 'EASY',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-form-validation',
      name: 'HTML Form Validation',
      description: 'Create a registration form with client-side validation, including username, email and password fields with real-time feedback',
      difficulty: 'EASY',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-login-page',
      name: 'HTML 登录页面',
      description: '构建一个美观的登录页面，包含记住我功能、密码找回链接和社交登录按钮',
      difficulty: 'EASY',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('HTML')!,
      slug: 'html-login-page',
      name: 'HTML Login Page',
      description: 'Build a beautiful login page with remember me, password recovery and social login buttons',
      difficulty: 'EASY',
      language: 'en',
    },
    // CSS 分类
    {
      categoryId: categoryMap.get('CSS')!,
      slug: 'css-animated-button',
      name: 'CSS 动画按钮',
      description: '使用纯 CSS 创建各种动画效果的按钮，包括悬停、点击和加载状态',
      difficulty: 'EASY',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('CSS')!,
      slug: 'css-animated-button',
      name: 'CSS Animated Buttons',
      description: 'Create various animated buttons using pure CSS including hover, click and loading states',
      difficulty: 'EASY',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('CSS')!,
      slug: 'css-responsive-grid',
      name: 'CSS 响应式网格布局',
      description: '使用 CSS Grid 和 Flexbox 创建完全响应式的图片画廊布局',
      difficulty: 'MEDIUM',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('CSS')!,
      slug: 'css-responsive-grid',
      name: 'CSS Responsive Grid',
      description: 'Create a fully responsive image gallery using CSS Grid and Flexbox',
      difficulty: 'MEDIUM',
      language: 'en',
    },
    // JavaScript 分类
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'js-calculator',
      name: 'JavaScript 计算器',
      description: '使用原生 JavaScript 实现一个功能完整的计算器，支持基本运算和键盘输入',
      difficulty: 'EASY',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'js-calculator',
      name: 'JavaScript Calculator',
      description: 'Implement a fully functional calculator with native JavaScript, supporting basic operations and keyboard input',
      difficulty: 'EASY',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'js-weather-app',
      name: 'JavaScript 天气应用',
      description: '调用天气 API 实现一个天气查询应用，显示当前天气和未来预报',
      difficulty: 'MEDIUM',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('JavaScript')!,
      slug: 'js-weather-app',
      name: 'JavaScript Weather App',
      description: 'Implement a weather query application by calling weather API, showing current weather and forecast',
      difficulty: 'MEDIUM',
      language: 'en',
    },
    // React 分类
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-todo-list',
      name: 'React 待办事项列表',
      description: '构建一个功能完整的待办事项应用，支持添加、删除、标记完成和筛选，使用 React Hooks',
      difficulty: 'MEDIUM',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-todo-list',
      name: 'React Todo List',
      description: 'Build a fully functional todo application with add, delete, complete and filter features using React Hooks',
      difficulty: 'MEDIUM',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-crud-table',
      name: 'React 数据表格',
      description: '创建一个支持增删改查的数据表格组件，包含排序、搜索和分页功能',
      difficulty: 'HARD',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('React')!,
      slug: 'react-crud-table',
      name: 'React CRUD Table',
      description: 'Create a data table component supporting CRUD operations with sorting, searching and pagination',
      difficulty: 'HARD',
      language: 'en',
    },
    // Vue 分类
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-shopping-cart',
      name: 'Vue 购物车',
      description: '实现一个购物车功能，包括商品列表、数量增减、总价计算和结账流程',
      difficulty: 'MEDIUM',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-shopping-cart',
      name: 'Vue Shopping Cart',
      description: 'Implement a shopping cart with product list, quantity adjustment, total calculation and checkout flow',
      difficulty: 'MEDIUM',
      language: 'en',
    },
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-task-board',
      name: 'Vue 任务看板',
      description: '使用 Vue 3 组合式 API 构建一个 Kanban 任务看板，支持拖拽操作',
      difficulty: 'HARD',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('Vue')!,
      slug: 'vue-task-board',
      name: 'Vue Task Board',
      description: 'Build a Kanban task board using Vue 3 Composition API with drag and drop support',
      difficulty: 'HARD',
      language: 'en',
    },
    // TypeScript 分类
    {
      categoryId: categoryMap.get('TypeScript')!,
      slug: 'ts-type-exercises',
      name: 'TypeScript 类型练习',
      description: '通过练习掌握 TypeScript 的基础类型、接口、类型别名和泛型',
      difficulty: 'EASY',
      language: 'zh',
    },
    {
      categoryId: categoryMap.get('TypeScript')!,
      slug: 'ts-type-exercises',
      name: 'TypeScript Type Exercises',
      description: 'Master TypeScript basic types, interfaces, type aliases and generics through exercises',
      difficulty: 'EASY',
      language: 'en',
    },
  ];

  const insertedChallenges = await db
    .insert(challenges)
    .values(challengeData)
    .returning();

  console.log(`Inserted ${insertedChallenges.length} challenges`);

  const challengeMap = new Map(
    insertedChallenges.map((c) => [`${c.slug}-${c.language}`, c.id])
  );

  const resourceData: {
    challengeId: string;
    type: string;
    name: string;
    importSource: string;
    initCode: { filename: string; language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'vue'; content: string }[];
    codeSource: { filename: string; language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'vue'; content: string }[];
    displayOrder: number;
  }[] = [
    // HTML Form Validation (zh)
    {
      challengeId: challengeMap.get('html-form-validation-zh')!,
      type: 'html',
      name: 'HTML Form',
      importSource: '',
      initCode: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>注册表单</title>
</head>
<body>
  <!-- 在此创建你的表单 -->
</body>
</html>`
        }
      ],
      codeSource: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>注册表单</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 40px; width: 100%; max-width: 400px; }
    h1 { text-align: center; color: #333; margin-bottom: 30px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; }
    input { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; }
    input:focus { outline: none; border-color: #667eea; }
    input.error { border-color: #ff4444; animation: shake 0.5s; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .error-message { color: #ff4444; font-size: 12px; margin-top: 5px; display: none; }
    .error-message.show { display: block; }
    button { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    button:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); }
    .success-message { display: none; text-align: center; color: #00C851; font-size: 18px; font-weight: 600; }
    .success-message.show { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 用户注册</h1>
    <form id="registerForm">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" name="username" placeholder="请输入用户名（至少3个字符）">
        <div class="error-message" id="usernameError">用户名至少需要3个字符</div>
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" name="email" placeholder="请输入邮箱地址">
        <div class="error-message" id="emailError">请输入有效的邮箱地址</div>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" name="password" placeholder="请输入密码（至少6个字符）">
        <div class="error-message" id="passwordError">密码至少需要6个字符</div>
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="请再次输入密码">
        <div class="error-message" id="confirmError">两次密码输入不一致</div>
      </div>
      <button type="submit">立即注册</button>
    </form>
    <div class="success-message" id="successMessage">🎉 注册成功！</div>
  </div>

  <script>
    const form = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
      
      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      
      if (username.value.length < 3) {
        username.classList.add('error');
        document.getElementById('usernameError').classList.add('show');
        isValid = false;
      } else {
        username.classList.remove('error');
        document.getElementById('usernameError').classList.remove('show');
      }
      
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email.value)) {
        email.classList.add('error');
        document.getElementById('emailError').classList.add('show');
        isValid = false;
      } else {
        email.classList.remove('error');
        document.getElementById('emailError').classList.remove('show');
      }
      
      if (password.value.length < 6) {
        password.classList.add('error');
        document.getElementById('passwordError').classList.add('show');
        isValid = false;
      } else {
        password.classList.remove('error');
        document.getElementById('passwordError').classList.remove('show');
      }
      
      if (password.value !== confirmPassword.value || !confirmPassword.value) {
        confirmPassword.classList.add('error');
        document.getElementById('confirmError').classList.add('show');
        isValid = false;
      } else {
        confirmPassword.classList.remove('error');
        document.getElementById('confirmError').classList.remove('show');
      }
      
      if (isValid) {
        form.style.display = 'none';
        successMessage.classList.add('show');
      }
    });
  </script>
</body>
</html>`
        }
      ],
      displayOrder: 1,
    },
    // HTML Form Validation (en)
    {
      challengeId: challengeMap.get('html-form-validation-en')!,
      type: 'html',
      name: 'HTML Form',
      importSource: '',
      initCode: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Registration Form</title>
</head>
<body>
  <!-- Create your form here -->
</body>
</html>`
        }
      ],
      codeSource: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Registration Form</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 40px; width: 100%; max-width: 400px; }
    h1 { text-align: center; color: #333; margin-bottom: 30px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; }
    input { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; }
    input:focus { outline: none; border-color: #667eea; }
    input.error { border-color: #ff4444; animation: shake 0.5s; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .error-message { color: #ff4444; font-size: 12px; margin-top: 5px; display: none; }
    .error-message.show { display: block; }
    button { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    button:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); }
    .success-message { display: none; text-align: center; color: #00C851; font-size: 18px; font-weight: 600; }
    .success-message.show { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 User Registration</h1>
    <form id="registerForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter username (min 3 characters)">
        <div class="error-message" id="usernameError">Username must be at least 3 characters</div>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter email address">
        <div class="error-message" id="emailError">Please enter a valid email address</div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password (min 6 characters)">
        <div class="error-message" id="passwordError">Password must be at least 6 characters</div>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password">
        <div class="error-message" id="confirmError">Passwords do not match</div>
      </div>
      <button type="submit">Register Now</button>
    </form>
    <div class="success-message" id="successMessage">🎉 Registration Successful!</div>
  </div>

  <script>
    const form = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
      
      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      
      if (username.value.length < 3) {
        username.classList.add('error');
        document.getElementById('usernameError').classList.add('show');
        isValid = false;
      } else {
        username.classList.remove('error');
        document.getElementById('usernameError').classList.remove('show');
      }
      
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email.value)) {
        email.classList.add('error');
        document.getElementById('emailError').classList.add('show');
        isValid = false;
      } else {
        email.classList.remove('error');
        document.getElementById('emailError').classList.remove('show');
      }
      
      if (password.value.length < 6) {
        password.classList.add('error');
        document.getElementById('passwordError').classList.add('show');
        isValid = false;
      } else {
        password.classList.remove('error');
        document.getElementById('passwordError').classList.remove('show');
      }
      
      if (password.value !== confirmPassword.value || !confirmPassword.value) {
        confirmPassword.classList.add('error');
        document.getElementById('confirmError').classList.add('show');
        isValid = false;
      } else {
        confirmPassword.classList.remove('error');
        document.getElementById('confirmError').classList.remove('show');
      }
      
      if (isValid) {
        form.style.display = 'none';
        successMessage.classList.add('show');
      }
    });
  </script>
</body>
</html>`
        }
      ],
      displayOrder: 1,
    },
    // React Todo List (zh)
    {
      challengeId: challengeMap.get('react-todo-list-zh')!,
      type: 'react',
      name: 'React Todo',
      importSource: `import React from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";`,
      initCode: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `function App() {
  // 在此实现你的待办事项应用
  return (
    <div>
      <h1>待办事项</h1>
    </div>
  );
}`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `import React, { useState } from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '完成项目', completed: true },
    { id: 3, text: '提交代码', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue, completed: false }
    ]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    React.createElement('div', { style: { maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' } },
      React.createElement('h1', { style: { textAlign: 'center', color: '#333' } }, '✅ 待办事项列表'),
      
      React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
        React.createElement('input', {
          type: 'text',
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' && addTodo(),
          placeholder: '添加新任务...',
          style: { flex: 1, padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd' }
        }),
        React.createElement('button', {
          onClick: addTodo,
          style: { padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
        }, '添加')
      ),

      React.createElement('div', { style: { marginBottom: '20px', display: 'flex', gap: '10px' } },
        React.createElement('button', {
          onClick: () => setFilter('all'),
          style: { padding: '8px 16px', background: filter === 'all' ? '#2196F3' : '#e0e0e0', color: filter === 'all' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, '全部'),
        React.createElement('button', {
          onClick: () => setFilter('active'),
          style: { padding: '8px 16px', background: filter === 'active' ? '#2196F3' : '#e0e0e0', color: filter === 'active' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, '进行中'),
        React.createElement('button', {
          onClick: () => setFilter('completed'),
          style: { padding: '8px 16px', background: filter === 'completed' ? '#2196F3' : '#e0e0e0', color: filter === 'completed' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, '已完成')
      ),

      React.createElement('ul', { style: { listStyle: 'none', padding: 0 } },
        filteredTodos.map(todo =>
          React.createElement('li', {
            key: todo.id,
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', background: todo.completed ? '#f9f9f9' : 'white' }
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' },
              onClick: () => toggleTodo(todo.id),
              style: { display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' },
              children: [
                React.createElement('input', {
                  type: 'checkbox',
                  checked: todo.completed,
                  onChange: () => toggleTodo(todo.id),
                  style: { marginRight: '15px', width: '20px', height: '20px', cursor: 'pointer' }
                }),
                React.createElement('span', {
                  style: { textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#333', fontSize: '16px' }
                }, todo.text)
              ]
            },
            React.createElement('button', {
              onClick: () => deleteTodo(todo.id),
              style: { padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
            }, '删除')
          )
        )
      ),

      React.createElement('p', { style: { color: '#666', marginTop: '20px', textAlign: 'center' } },
        '剩余 ', todos.filter(t => !t.completed).length, ' 项任务'
      )
    );
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
      displayOrder: 1,
    },
    // React Todo List (en)
    {
      challengeId: challengeMap.get('react-todo-list-en')!,
      type: 'react',
      name: 'React Todo',
      importSource: `import React from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";`,
      initCode: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `function App() {
  // Implement your todo app here
  return (
    <div>
      <h1>Todo List</h1>
    </div>
  );
}`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.jsx',
          language: 'javascript',
          content: `import React, { useState } from "https://esm.sh/react@19";
import ReactDOM from "https://esm.sh/react-dom@19/client";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Complete project', completed: true },
    { id: 3, text: 'Submit code', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue, completed: false }
    ]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    React.createElement('div', { style: { maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' } },
      React.createElement('h1', { style: { textAlign: 'center', color: '#333' } }, '✅ Todo List'),
      
      React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
        React.createElement('input', {
          type: 'text',
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' && addTodo(),
          placeholder: 'Add new task...',
          style: { flex: 1, padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd' }
        }),
        React.createElement('button', {
          onClick: addTodo,
          style: { padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
        }, 'Add')
      ),

      React.createElement('div', { style: { marginBottom: '20px', display: 'flex', gap: '10px' } },
        React.createElement('button', {
          onClick: () => setFilter('all'),
          style: { padding: '8px 16px', background: filter === 'all' ? '#2196F3' : '#e0e0e0', color: filter === 'all' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, 'All'),
        React.createElement('button', {
          onClick: () => setFilter('active'),
          style: { padding: '8px 16px', background: filter === 'active' ? '#2196F3' : '#e0e0e0', color: filter === 'active' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, 'Active'),
        React.createElement('button', {
          onClick: () => setFilter('completed'),
          style: { padding: '8px 16px', background: filter === 'completed' ? '#2196F3' : '#e0e0e0', color: filter === 'completed' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, 'Completed')
      ),

      React.createElement('ul', { style: { listStyle: 'none', padding: 0 } },
        filteredTodos.map(todo =>
          React.createElement('li', {
            key: todo.id,
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', background: todo.completed ? '#f9f9f9' : 'white' }
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' },
              onClick: () => toggleTodo(todo.id),
              children: [
                React.createElement('input', {
                  type: 'checkbox',
                  checked: todo.completed,
                  onChange: () => toggleTodo(todo.id),
                  style: { marginRight: '15px', width: '20px', height: '20px', cursor: 'pointer' }
                }),
                React.createElement('span', {
                  style: { textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#333', fontSize: '16px' }
                }, todo.text)
              ]
            },
            React.createElement('button', {
              onClick: () => deleteTodo(todo.id),
              style: { padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
            }, 'Delete')
          )
        )
      ),

      React.createElement('p', { style: { color: '#666', marginTop: '20px', textAlign: 'center' } },
        todos.filter(t => !t.completed).length, ' tasks remaining'
      )
    );
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="root"></div>`
        }
      ],
      displayOrder: 1,
    },
    // Vue Shopping Cart (zh)
    {
      challengeId: challengeMap.get('vue-shopping-cart-zh')!,
      type: 'vue',
      name: 'Vue Cart',
      importSource: `import { createApp } from "https://esm.sh/vue@3";`,
      initCode: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div id="app">
    <h1>购物车</h1>
  </div>
</template>

<script>
export default {
  // 在此实现你的购物车应用
};
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="app"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div style="max-width: 900px; margin: 50px auto; padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="text-align: center; color: #333;">🛒 购物车</h1>
    
    <div v-if="cart.length === 0" style="text-align: center; padding: 60px; color: #999; background: #f9f9f9; border-radius: 10px;">
      <div style="font-size: 60px;">🛒</div>
      <p style="font-size: 18px; margin-top: 20px;">购物车是空的，快去添加商品吧！</p>
    </div>
    
    <div v-else>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="text-align: left; padding: 15px;">商品</th>
            <th style="text-align: center; padding: 15px; width: 120px;">单价</th>
            <th style="text-align: center; padding: 15px; width: 150px;">数量</th>
            <th style="text-align: right; padding: 15px;">小计</th>
            <th style="width: 60px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id" style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">
              <div style="font-weight: bold; font-size: 16px;">{{ item.name }}</div>
              <div style="font-size: 12px; color: #666;">{{ item.description }}</div>
            </td>
            <td style="text-align: center; padding: 15px; font-weight: bold; color: #f44336;">¥{{ item.price }}</td>
            <td style="text-align: center; padding: 15px;">
              <button @click="decreaseQuantity(item.id)" style="width: 30px; height: 30px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;">-</button>
              <span style="display: inline-block; width: 50px;">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)" style="width: 30px; height: 30px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;">+</button>
            </td>
            <td style="text-align: right; padding: 15px; font-weight: bold; font-size: 16px;">¥{{ (item.price * item.quantity).toFixed(2) }}</td>
            <td style="text-align: center; padding: 15px;">
              <button @click="removeFromCart(item.id)" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">×</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; color: white;">
        <div style="margin-bottom: 10px; font-size: 16px;">
          <span>商品总数：</span>
          <strong>{{ totalQuantity }}</strong>
        </div>
        <div style="font-size: 28px; margin-bottom: 15px;">
          <span>总计：</span>
          <span style="font-weight: bold;">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="checkout" style="background: white; color: #667eea; border: none; padding: 14px 40px; font-size: 18px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: transform 0.2s;">
          🛍️ 结账
        </button>
      </div>
    </div>
    
    <div style="margin-top: 50px;">
      <h2 style="color: #333;">🔥 推荐商品</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
        <div v-for="product in availableProducts" :key="product.id" style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; transition: transform 0.2s; cursor: pointer;" @click="addToCart(product)">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">{{ product.name }}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 12px;">{{ product.description }}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #f44336; font-weight: bold; font-size: 18px;">¥{{ product.price }}</span>
            <button style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { createApp, ref, computed } = Vue;

const App = {
  setup() {
    const availableProducts = ref([
      { id: 1, name: '📱 iPhone 15', description: '最新款苹果手机', price: 6999, quantity: 1 },
      { id: 2, name: '💻 MacBook Pro', description: '专业级笔记本', price: 12999, quantity: 1 },
      { id: 3, name: '🎧 AirPods Pro', description: '主动降噪耳机', price: 1999, quantity: 1 },
      { id: 4, name: '📱 iPad Air', description: '轻薄平板电脑', price: 4599, quantity: 1 },
      { id: 5, name: '⌚ Apple Watch', description: '智能手表', price: 2999, quantity: 1 },
      { id: 6, name: '📷 GoPro', description: '运动相机', price: 2599, quantity: 1 },
    ]);
    
    const cart = ref([]);
    
    const addToCart = (product) => {
      const existing = cart.value.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.value.push({ ...product });
      }
    };
    
    const removeFromCart = (id) => {
      cart.value = cart.value.filter(item => item.id !== id);
    };
    
    const increaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item) item.quantity++;
    };
    
    const decreaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    };
    
    const totalQuantity = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    const totalPrice = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    const checkout = () => {
      if (cart.value.length === 0) {
        alert('购物车是空的！');
        return;
      }
      alert('订单确认！总金额：¥' + totalPrice.value.toFixed(2));
      cart.value = [];
    };
    
    return {
      cart,
      availableProducts,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      totalQuantity,
      totalPrice,
      checkout
    };
  }
};

createApp(App).mount('#app');
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<script src="https://esm.sh/vue@3"></script>
<div id="app"></div>`
        }
      ],
      displayOrder: 1,
    },
    // Vue Shopping Cart (en)
    {
      challengeId: challengeMap.get('vue-shopping-cart-en')!,
      type: 'vue',
      name: 'Vue Cart',
      importSource: `import { createApp } from "https://esm.sh/vue@3";`,
      initCode: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div id="app">
    <h1>Shopping Cart</h1>
  </div>
</template>

<script>
export default {
  // Implement your shopping cart here
};
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<div id="app"></div>`
        }
      ],
      codeSource: [
        {
          filename: 'App.vue',
          language: 'vue',
          content: `<template>
  <div style="max-width: 900px; margin: 50px auto; padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="text-align: center; color: #333;">🛒 Shopping Cart</h1>
    
    <div v-if="cart.length === 0" style="text-align: center; padding: 60px; color: #999; background: #f9f9f9; border-radius: 10px;">
      <div style="font-size: 60px;">🛒</div>
      <p style="font-size: 18px; margin-top: 20px;">Your cart is empty. Add some products!</p>
    </div>
    
    <div v-else>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="text-align: left; padding: 15px;">Product</th>
            <th style="text-align: center; padding: 15px; width: 120px;">Price</th>
            <th style="text-align: center; padding: 15px; width: 150px;">Quantity</th>
            <th style="text-align: right; padding: 15px;">Subtotal</th>
            <th style="width: 60px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id" style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">
              <div style={'font-weight: bold; font-size: 16px;'}>{'{{ item.name }}'}</div>
              <div style={'font-size: 12px; color: #666;'}>{'{{ item.description }}'}</div>
            </td>
            <td style={'text-align: center; padding: 15px; font-weight: bold; color: #f44336;'}>{'$' + '{' + '{ item.price }}'}</td>
            <td style={'text-align: center; padding: 15px;'}>
              <button @click="decreaseQuantity(item.id)" style={'width: 30px; height: 30px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;'}>-</button>
              <span style={'display: inline-block; width: 50px;'}>{'{{ item.quantity }}'}</span>
              <button @click="increaseQuantity(item.id)" style={'width: 30px; height: 30px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;'}>+</button>
            </td>
            <td style={'text-align: right; padding: 15px; font-weight: bold; font-size: 16px;'}>{'$' + '{' + '{ (item.price * item.quantity).toFixed(2) }}'}</td>
            <td style={'text-align: center; padding: 15px;'}>
              <button @click="removeFromCart(item.id)" style={'background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;'}>×</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; color: white;">
        <div style="margin-bottom: 10px; font-size: 16px;">
          <span>Total Items: </span>
          <strong>{{ totalQuantity }}</strong>
        </div>
        <div style="font-size: 28px; margin-bottom: 15px;">
          <span>Total: </span>
          <span style="font-weight: bold;">{'$'}{'{ totalPrice.toFixed(2) }'}</span>
        </div>
        <button @click="checkout" style="background: white; color: #667eea; border: none; padding: 14px 40px; font-size: 18px; font-weight: bold; border-radius: 6px; cursor: pointer;">
          🛍️ Checkout
        </button>
      </div>
    </div>
    
    <div style="margin-top: 50px;">
      <h2 style="color: #333;">🔥 Featured Products</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
        <div v-for="product in availableProducts" :key="product.id" style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; cursor: pointer;" @click="addToCart(product)">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">{'{' + '{ product.name }}'}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 12px;">{'{' + '{ product.description }}'}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #f44336; font-weight: bold; font-size: 18px;">{'$'}{'{ product.price }'}</span>
            <button style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { createApp, ref, computed } = Vue;

const App = {
  setup() {
    const availableProducts = ref([
      { id: 1, name: '📱 iPhone 15', description: 'Latest Apple smartphone', price: 999, quantity: 1 },
      { id: 2, name: '💻 MacBook Pro', description: 'Professional laptop', price: 1999, quantity: 1 },
      { id: 3, name: '🎧 AirPods Pro', description: 'Noise cancelling earphones', price: 249, quantity: 1 },
      { id: 4, name: '📱 iPad Air', description: 'Lightweight tablet', price: 599, quantity: 1 },
    ]);
    
    const cart = ref([]);
    
    const addToCart = (product) => {
      const existing = cart.value.find(item => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.value.push({ ...product });
      }
    };
    
    const removeFromCart = (id) => {
      cart.value = cart.value.filter(item => item.id !== id);
    };
    
    const increaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item) item.quantity++;
    };
    
    const decreaseQuantity = (id) => {
      const item = cart.value.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    };
    
    const totalQuantity = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    const totalPrice = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    const checkout = () => {
      if (cart.value.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      alert('Order confirmed! Total: $' + totalPrice.value.toFixed(2));
      cart.value = [];
    };
    
    return {
      cart,
      availableProducts,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      totalQuantity,
      totalPrice,
      checkout
    };
  }
};

createApp(App).mount('#app');
</script>`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<script src="https://esm.sh/vue@3"></script>
<div id="app"></div>`
        }
      ],
      displayOrder: 1,
    },
    // JavaScript Calculator (zh)
    {
      challengeId: challengeMap.get('js-calculator-zh')!,
      type: 'javascript',
      name: 'JS Calculator',
      importSource: '',
      initCode: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html>
<head>
  <title>计算器</title>
</head>
<body>
  <!-- 在此创建你的计算器 -->
</body>
</html>`
        }
      ],
      codeSource: [
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>计算器</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .calculator { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 30px; width: 350px; }
    .display { background: #1e1e1e; color: white; font-size: 32px; text-align: right; padding: 20px; border-radius: 10px; margin-bottom: 20px; min-height: 70px; overflow: hidden; }
    .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    button { padding: 20px; font-size: 20px; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.1s, background 0.2s; }
    button:active { transform: scale(0.95); }
    .btn-number { background: #f0f0f0; color: #333; }
    .btn-number:hover { background: #e0e0e0; }
    .btn-operator { background: #ff9500; color: white; }
    .btn-operator:hover { background: #e08600; }
    .btn-equals { background: #34c759; color: white; grid-column: span 2; }
    .btn-equals:hover { background: #2db351; }
    .btn-clear { background: #ff3b30; color: white; }
    .btn-clear:hover { background: #e0352b; }
  </style>
</head>
<body>
  <div class="calculator">
    <div class="display" id="display">0</div>
    <div class="buttons">
      <button class="btn-clear" onclick="clearDisplay()">C</button>
      <button class="btn-operator" onclick="deleteChar()">⌫</button>
      <button class="btn-operator" onclick="appendOperator('%')">%</button>
      <button class="btn-operator" onclick="appendOperator('/')">÷</button>
      <button class="btn-number" onclick="appendNumber('7')">7</button>
      <button class="btn-number" onclick="appendNumber('8')">8</button>
      <button class="btn-number" onclick="appendNumber('9')">9</button>
      <button class="btn-operator" onclick="appendOperator('*')">×</button>
      <button class="btn-number" onclick="appendNumber('4')">4</button>
      <button class="btn-number" onclick="appendNumber('5')">5</button>
      <button class="btn-number" onclick="appendNumber('6')">6</button>
      <button class="btn-operator" onclick="appendOperator('-')">-</button>
      <button class="btn-number" onclick="appendNumber('1')">1</button>
      <button class="btn-number" onclick="appendNumber('2')">2</button>
      <button class="btn-number" onclick="appendNumber('3')">3</button>
      <button class="btn-operator" onclick="appendOperator('+')">+</button>
      <button class="btn-number" onclick="appendNumber('0')" style="grid-column: span 2;">0</button>
      <button class="btn-number" onclick="appendNumber('.')">.</button>
      <button class="btn-equals" onclick="calculate()">=</button>
    </div>
  </div>

  <script>
    let display = document.getElementById('display');
    let expression = '0';
    
    function updateDisplay() {
      display.textContent = expression.length > 12 ? expression.slice(-12) : expression;
    }
    
    function appendNumber(num) {
      if (expression === '0' || expression === 'Error') {
        expression = num;
      } else {
        expression += num;
      }
      updateDisplay();
    }
    
    function appendOperator(op) {
      if (expression === 'Error') expression = '0';
      const lastChar = expression.slice(-1);
      if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
      } else {
        expression += op;
      }
      updateDisplay();
    }
    
    function calculate() {
      try {
        if (expression.includes('/0')) {
          expression = 'Error';
        } else {
          expression = eval(expression).toString();
        }
      } catch {
        expression = 'Error';
      }
      updateDisplay();
    }
    
    function clearDisplay() {
      expression = '0';
      updateDisplay();
    }
    
    function deleteChar() {
      if (expression.length === 1 || expression === 'Error') {
        expression = '0';
      } else {
        expression = expression.slice(0, -1);
      }
      updateDisplay();
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
      if (e.key === '.') appendNumber('.');
      if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendOperator(e.key);
      if (e.key === '%') appendOperator('%');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Escape') clearDisplay();
      if (e.key === 'Backspace') deleteChar();
    });
  </script>
</body>
</html>`
        }
      ],
      displayOrder: 1,
    },
    // CSS Animated Button (zh)
    {
      challengeId: challengeMap.get('css-animated-button-zh')!,
      type: 'css',
      name: 'CSS Button',
      importSource: '',
      initCode: [
        {
          filename: 'styles.css',
          language: 'css',
          content: `/* 创建你的动画按钮样式 */
.button {
  padding: 15px 30px;
  border: none;
  cursor: pointer;
}
`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <button class="button">Hover Me</button>
</body>
</html>`
        }
      ],
      codeSource: [
        {
          filename: 'styles.css',
          language: 'css',
          content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height: 100vh; display: flex; flex-wrap: wrap; gap: 30px; align-items: center; justify-content: center; padding: 50px; background: #1a1a2e; font-family: Arial, sans-serif; }

/* Button 1: Gradient Glow */
.btn-glow {
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #ff00cc, #333399);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(255, 0, 204, 0.4);
}
.btn-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 0, 204, 0.6);
}

/* Button 2: Slide Fill */
.btn-slide {
  position: relative;
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  background: white;
  border: 2px solid #333;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
}
.btn-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #333;
  transition: left 0.3s;
  z-index: -1;
}
.btn-slide:hover {
  color: white;
}
.btn-slide:hover::before {
  left: 0;
}

/* Button 3: Pulse */
.btn-pulse {
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #00d2ff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(0, 210, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0); }
}

/* Button 4: Ripple */
.btn-ripple {
  position: relative;
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #ff4757;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
}
.btn-ripple span {
  position: absolute;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
}
@keyframes ripple {
  to { transform: scale(4); opacity: 0; }
}

/* Button 5: Loading Spinner */
.btn-loading {
  position: relative;
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #2ed573;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
}
.btn-loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin: -10px 0 0 -45px;
  border: 3px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  opacity: 0;
  transition: opacity 0.3s;
}
.btn-loading:hover::after {
  opacity: 1;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Button 6: 3D Press */
.btn-3d {
  padding: 15px 35px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #ffa502;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 0 #cc8400;
  transition: all 0.1s;
}
.btn-3d:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #cc8400;
}
`
        },
        {
          filename: 'index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CSS 动画按钮</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <button class="btn-glow">渐变发光</button>
  <button class="btn-slide">滑入填充</button>
  <button class="btn-pulse">脉冲效果</button>
  <button class="btn-ripple"><span></span>波纹效果</button>
  <button class="btn-loading">加载动画</button>
  <button class="btn-3d">3D 按压</button>
  
  <script>
    // 波纹效果 JavaScript
    document.querySelectorAll('.btn-ripple').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const span = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        this.appendChild(span);
        setTimeout(() => span.remove(), 600);
      });
    });
  </script>
</body>
</html>`
        }
      ],
      displayOrder: 1,
    },
  ];
  const insertedResources = await db
    .insert(challengeResources)
    .values(resourceData)
    .returning();

  console.log(`Inserted ${insertedResources.length} challenge resources`);
  console.log('Seeding completed!');
};

seedData()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

export { seedData };
