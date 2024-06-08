# Libs Playground

## `Playground` 查看并开发组件

### 一、使用

在 `playground` 目录下直接运行 `pnpm dev`，会将 `app.example.tsx` 生成到 `src` 目录下

随后可以直接在 `src/App.tsx` 中修改你想要调试的组件代码

### 二、添加其他测试组件页面

在 `src` 目录下，添加新文件 `Test.tsx`，自动添加该组件到 `/test` 路由下

通过 `http://localhost:<port>/test` 路由可以访问到该组件

### 三、自动获取`components/**/demo`下的文件到`playground`

可以通过组件名直接访问并进行开发

`http://localhost:<port>/<component>/<demoName>`

**e.g.** `http://localhost:5173/calendar/usage`
