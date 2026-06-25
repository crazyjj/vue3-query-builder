
### ⚠️ 项目初衷

本项目源自 [`vue-query-builder`](https://github.com/dabernathy89/vue3-query-builder) 项目

根据项目仓库信息，`vue3-query-builder` 已于 2022 年 1 月 19 日被作者正式标记为 **Abandoned (已弃用)**。

作者表示由于长时间没有精力维护，而原项目为Vue2版本，不能适用于Vue3版本项目的使用，因此。

---

### 🛠️ 项目功能亮点

`vue3-query-builder` 是一个专为 Vue.js 设计的 UI 组件，旨在帮助开发者构建复杂的嵌套条件查询。它的核心价值在于将复杂的逻辑查询可视化，降低用户的使用门槛。

#### 核心功能
*   **可视化查询构建**：提供直观的图形界面，让用户无需编写代码即可生成复杂的查询逻辑。
*   **无限层级嵌套**：支持“组”与“规则”的无限嵌套。用户可以在一个组中包含多个规则，或者包含其他子组，从而构建出 `(A AND B) OR (C AND (D OR E))` 这样的复杂逻辑。
*   **灵活的逻辑组合**：支持 `All` (AND) 和 `Any` (OR) 两种匹配模式，用户可以随时切换组内的逻辑关系。
*   **动态规则配置**：允许开发者自定义字段类型（如文本框、下拉框、单选框等）和运算符（如等于、包含、大于等）。
*   **JSON 数据输出**：组件能够将用户在前端配置的查询条件实时转换为结构化的 JSON 对象，方便后端直接解析和处理。

#### 适用场景
*   **高级筛选**：电商后台、CRM 系统中的多条件组合筛选。
*   **报表生成器**：允许用户自定义数据提取规则。
*   **自动化工作流**：配置触发条件（例如：当“订单金额 > 1000”且“地区 = 北京”时触发...）。

---

### 🚀 使用指南

#### 1. 安装
该项目通常通过 npm 或 yarn 进行安装（注意版本兼容性，该项目主要基于 Vue 2 开发）：

```bash
npm install vue3-query-builder
# 或
yarn add vue3-query-builder
```

#### 2. 基础代码示例
在你的 Vue 组件中引入并注册该组件，通过 `v-model` 绑定查询数据，通过 `rules` 属性定义可选字段。

```html
<template>
  <div id="app">
    <query-builder v-model="query" :rules="rules"></query-builder>
    
    <!-- 实时查看生成的 JSON -->
    <pre>{{ query }}</pre>
  </div>
</template>

<script>
import QueryBuilder from 'vue3-query-builder'

export default {
  components: {
    QueryBuilder
  },
  data() {
    return {
      // 绑定的查询对象
      query: {
        logicalOperator: 'all',
        children: []
      },
      // 定义的规则配置
      rules: [
        {
          type: 'text',
          field: 'first_name',
          label: 'First Name',
          operators: ['equals', 'not_equal', 'contains']
        },
        {
          type: 'select',
          field: 'plan_type',
          label: 'Plan Type',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Premium', value: 'premium' }
          ]
        }
      ]
    }
  }
}
</script>
```

#### 3. 数据结构说明
组件输出的 JSON 结构通常如下所示，清晰地描述了嵌套逻辑：

```json
{
  "logicalOperator": "all",
  "children": [
    {
      "type": "rule",
      "field": "first_name",
      "operator": "equals",
      "value": "John"
    },
    {
      "logicalOperator": "any",
      "children": [
        {
          "type": "rule",
          "field": "plan_type",
          "operator": "equals",
          "value": "premium"
        }
      ]
    }
  ]
}
```

---

### 💡 未来计划

鉴于该项目已不再维护，如果你在寻找类似的解决方案，建议考虑以下方向：

1.  **支持sql等查询豫剧的生成**：探索如何安全的生成相关查询语句。
2.  **AI**：支持接入大模型，生成相关查询。



[Demo and documentation](https://dabernathy89.github.io/vue3-query-builder/)

![Demo Screenshot](https://raw.githubusercontent.com/dabernathy89/vue3-query-builder/master/public/demo-screenshot.png "Demo screenshot")
