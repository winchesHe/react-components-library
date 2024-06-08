# Libs Docs

## Docs 查看组件的文档

### 一、使用

在 `docs` 目录下直接运行 `dev`

### 二、组件预览

通过下面在`mdx`中引入`code`组件即可实现组件预览

代码：
`<code src="src/compoents/Calendar/demo/index.tsx />`

`src` 相对根目录的路径

### 三、组件属性预览

通过下面在`mdx`中引入`Props`组件即可实现组件属性自动转换成 `markdown`

代码：
`<Props src="src/compoents/Calendar.tsx" />`

### Props 组件属性

1、`src` 指定要解析的组件文件地址，输入相对根目录的路径

2、`hideJumpButton` 隐藏跳转到源码按钮，默认`false`

3、`component` 默认选择第一个`export`的组件，若存在多个组件，则需要通过传`component`指定对应的组件，或者通过组件文件内定义`displayName`指定组件

```tsx
// Way 1
// component 指定，当存在多个 export 组件时
<Props src="src/compoents/Calendar.tsx" component="Calendar" />

//  Calendar.tsx
export const Calendar = memo(CalendarComponent)

// Way 2
//  Calendar.tsx
export const Calendar = memo(CalendarComponent)
// displayName 指定 Calendar 组件
Calendar.displayName = 'Calendar'
```

组件文档使用演示：

````md
## Calendar

<code src="src/compoents/Calendar/demo/index.tsx" />

## Calendar Props

<Props src="src/compoents/Calendar.tsx" />
````
