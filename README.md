# 智慧工地系统（Smart Construction Site）

可运行的前端原型，覆盖功能清单 V1 中的 11 个一级模块。

## 技术栈

- Vue 3.5 + `<script setup>` Composition API
- Vite 5 + Pinia + Vue Router 4
- Element Plus 2.8（按需自动导入）
- ECharts 5
- Mock.js（无需后端，浏览器内拦截请求）

## 启动

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

- 登录页：任意账号密码即可进入（演示）
- 后台：`/#/admin/dashboard`
- 大屏驾驶舱：`/#/screen`

## 目录结构

```
src/
├── api/            # 各模块 API（按模块拆分）
├── components/     # 通用组件：PageContainer / SearchBar / DataTable / StatusTag / EChart
├── layouts/        # AdminLayout（后台）/ ScreenLayout（大屏）
├── mock/           # Mock.js 接口模拟
├── router/         # 路由 + menu.js（侧边栏菜单数据集中管理）
├── stores/         # Pinia：user / tabs
├── styles/         # 全局 SCSS + 变量
├── utils/          # request.js
└── views/
    ├── login/      # 登录页
    ├── admin/      # 后台业务页面（按模块分目录）
    └── screen/     # 大屏驾驶舱
```

## 交付节奏

| 批次 | 范围 | 状态 |
| --- | --- | --- |
| 第一批 | 工程初始化 + 登录 + 后台骨架 + 通用组件 + 工作台首页 | ✅ |
| 第二批 | 工程信息 / 人员管理 / 融合监督 / 文明施工 | ⏳ |
| 第三批 | 视频监管 / 设备集成 / 重大危险源 / 混凝土 / 质量 / BIM / 星级 | ⏳ |
| 第四批 | 大屏可视化驾驶舱 | ⏳ |

未完成的模块路由会进入占位页（菜单可点、不报错）。

## 交互范式（"简洁方便"）

- 列表页统一骨架：折叠式搜索 + DataTable + 右下分页
- 新建/编辑统一用 **Drawer 抽屉**（避免弹窗截断长表单）
- 详情页统一三段式：基本信息 + 业务 Tabs + 操作记录时间轴
- 状态标签语义统一：`StatusTag` 组件，颜色一致
- 顶部多标签页 + 面包屑，导航直达
