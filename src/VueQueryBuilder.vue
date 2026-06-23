<template>
  <div class="vue-query-builder">
    <slot v-bind="vqbProps">
      <query-builder-group
        v-bind="vqbProps"
        v-model:query="query"
      />
    </slot>
  </div>
</template>

<script>
import { provide, computed, watch, ref, onMounted, inject, getCurrentInstance } from 'vue'
import ElementPlusGroup from './layouts/ElementPlus/ElementPlusGroup.vue'
import deepClone from './utilities.js'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const getDefaultLocale = () => {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('zh')) {
      return 'zh-CN'
    }
  }
  return 'en-US'
}

// 硬编码的 fallback 标签，确保没有 i18n 时也能正常工作
const fallbackLabels = {
  'zh-CN': {
    matchType: '匹配类型',
    matchTypes: [
      { id: 'all', label: '全部匹配' },
      { id: 'any', label: '任意匹配' }
    ],
    addRule: '添加规则',
    removeRule: '删除',
    addGroup: '添加分组',
    removeGroup: '删除分组',
    textInputPlaceholder: '请输入值',
    selectRulePlaceholder: '选择规则',
    selectOperatorPlaceholder: '选择操作符',
    selectOperandPlaceholder: '选择操作数',
    selectPlaceholder: '请选择',
    selectDatePlaceholder: '选择日期'
  },
  'en-US': {
    matchType: 'Match Type',
    matchTypes: [
      { id: 'all', label: 'All' },
      { id: 'any', label: 'Any' }
    ],
    addRule: 'Add Rule',
    removeRule: '×',
    addGroup: 'Add Group',
    removeGroup: '×',
    textInputPlaceholder: 'value',
    selectRulePlaceholder: 'Select Rule',
    selectOperatorPlaceholder: 'Select Operator',
    selectOperandPlaceholder: 'Select Operand',
    selectPlaceholder: 'Select',
    selectDatePlaceholder: 'Select Date'
  }
}

const operatorLabels = {
  'zh-CN': {
    'equals': '等于',
    'does not equal': '不等于',
    'contains': '包含',
    'does not contain': '不包含',
    'is empty': '为空',
    'is not empty': '不为空',
    'begins with': '以...开头',
    'ends with': '以...结尾'
  },
  'en-US': {
    'equals': 'Equals',
    'does not equal': 'Does not equal',
    'contains': 'Contains',
    'does not contain': 'Does not contain',
    'is empty': 'Is empty',
    'is not empty': 'Is not empty',
    'begins with': 'Begins with',
    'ends with': 'Ends with'
  }
}

export default {
  name: 'VueQueryBuilder',
  components: {
    QueryBuilderGroup: ElementPlusGroup
  },
  props: {
    rules: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Object,
      default: null
    },
    maxDepth: {
      type: Number,
      default: 3,
      validator: function (value) {
        return value >= 1
      }
    },
    modelValue: {
      type: Object,
      default: null
    },
    locale: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const query = ref({
      logicalOperator: 'all',
      children: []
    })

    const ruleTypes = {
      text: {
        operators: ['equals', 'does not equal', 'contains', 'does not contain', 'is empty', 'is not empty', 'begins with', 'ends with'],
        inputType: 'text',
        id: 'text-field'
      },
      numeric: {
        operators: ['=', '<>', '<', '<=', '>', '>='],
        inputType: 'number',
        id: 'number-field'
      },
      custom: {
        operators: [],
        inputType: 'text',
        id: 'custom-field'
      },
      radio: {
        operators: [],
        choices: [],
        inputType: 'radio',
        id: 'radio-field'
      },
      checkbox: {
        operators: [],
        choices: [],
        inputType: 'checkbox',
        id: 'checkbox-field'
      },
      select: {
        operators: [],
        choices: [],
        inputType: 'select',
        id: 'select-field'
      },
      'multi-select': {
        operators: ['='],
        choices: [],
        inputType: 'select',
        id: 'multi-select-field'
      }
    }

    // 确定当前语言
    const currentLocale = props.locale || getDefaultLocale()
    const isZh = currentLocale.startsWith('zh')
    const fallbackLocale = isZh ? 'zh-CN' : 'en-US'

    // 尝试获取 i18n 实例
    let t = (key) => key
    let hasI18n = false

    // 方式1: 通过 inject 尝试获取 useI18n
    const useI18nInject = inject('useI18n', null)
    if (useI18nInject) {
      try {
        const i18nInstance = useI18nInject()
        if (i18nInstance && i18nInstance.t) {
          t = i18nInstance.t
          hasI18n = true
        }
      } catch (e) {
        // 忽略错误，使用 fallback
      }
    }

    // 方式2: 尝试通过 globalProperties 获取 i18n
    if (!hasI18n) {
      try {
        const instance = getCurrentInstance()
        if (instance && instance.appContext && instance.appContext.config && instance.appContext.config.globalProperties) {
          const global = instance.appContext.config.globalProperties
          if (global.$t) {
            t = global.$t
            hasI18n = true
          }
        }
      } catch (e) {
        // 忽略错误，使用 fallback
      }
    }

    // 内置的翻译函数 fallback
    const builtInTranslate = (key) => {
      const parts = key.split('.')
      let result = messages[currentLocale] || messages['en-US']
      
      for (const part of parts) {
        if (result && result[part]) {
          result = result[part]
        } else {
          return key
        }
      }
      
      return result
    }

    // 如果没有 i18n，使用内置翻译
    if (!hasI18n) {
      t = builtInTranslate
    }

    const getOperatorTranslation = (operator) => {
      const operatorMap = {
        'equals': 'queryBuilder.operators.equals',
        'does not equal': 'queryBuilder.operators.doesNotEqual',
        'contains': 'queryBuilder.operators.contains',
        'does not contain': 'queryBuilder.operators.doesNotContain',
        'is empty': 'queryBuilder.operators.isEmpty',
        'is not empty': 'queryBuilder.operators.isNotEmpty',
        'begins with': 'queryBuilder.operators.beginsWith',
        'ends with': 'queryBuilder.operators.endsWith'
      }
      
      let translated = t(operatorMap[operator] || operator)
      
      // 如果翻译结果和 key 一样，说明没有翻译，使用 fallback
      if (translated === operatorMap[operator] || translated === operator) {
        translated = operatorLabels[fallbackLocale]?.[operator] || operator
      }
      
      return translated
    }

    const defaultLabels = computed(() => {
      const baseLabels = { ...fallbackLabels[fallbackLocale] }
      
      try {
        // 尝试用 i18n 更新标签
        const i18nLabels = {
          matchType: t('queryBuilder.matchType'),
          matchTypes: [
            { id: 'all', label: t('queryBuilder.matchAll') },
            { id: 'any', label: t('queryBuilder.matchAny') }
          ],
          addRule: t('queryBuilder.addRule'),
          removeRule: t('queryBuilder.removeRule'),
          addGroup: t('queryBuilder.addGroup'),
          removeGroup: t('queryBuilder.removeGroup'),
          textInputPlaceholder: t('queryBuilder.textInputPlaceholder'),
          selectRulePlaceholder: t('queryBuilder.selectRulePlaceholder'),
          selectOperatorPlaceholder: t('queryBuilder.selectOperatorPlaceholder'),
          selectOperandPlaceholder: t('queryBuilder.selectOperandPlaceholder'),
          selectPlaceholder: t('queryBuilder.selectPlaceholder'),
          selectDatePlaceholder: t('queryBuilder.selectDatePlaceholder')
        }
        
        // 检查是否翻译成功（翻译值不等于 key）
        for (const key of Object.keys(i18nLabels)) {
          if (key !== 'matchTypes') {
            const expectedKey = `queryBuilder.${key.charAt(0).toLowerCase() + key.slice(1)}`
            if (i18nLabels[key] !== expectedKey) {
              baseLabels[key] = i18nLabels[key]
            }
          } else {
            // 处理 matchTypes
            const allLabel = t('queryBuilder.matchAll')
            const anyLabel = t('queryBuilder.matchAny')
            if (allLabel !== 'queryBuilder.matchAll') {
              baseLabels.matchTypes[0].label = allLabel
            }
            if (anyLabel !== 'queryBuilder.matchAny') {
              baseLabels.matchTypes[1].label = anyLabel
            }
          }
        }
      } catch (e) {
        // 出错时使用 fallback
      }
      
      return Object.assign({}, baseLabels, {
        getOperatorTranslation
      })
    })

    const mergedLabels = computed(() => {
      return Object.assign({}, defaultLabels.value, props.labels || {})
    })

    const mergedRules = computed(() => {
      const mergedRules = []
      if (!props.rules || !Array.isArray(props.rules)) {
        return mergedRules
      }

      props.rules.forEach((rule) => {
        if (typeof ruleTypes[rule.type] !== 'undefined') {
          mergedRules.push(Object.assign({}, ruleTypes[rule.type], rule))
        } else {
          mergedRules.push(rule)
        }
      })

      return mergedRules
    })

    const vqbProps = computed(() => ({
      index: 0,
      depth: 1,
      maxDepth: props.maxDepth,
      ruleTypes: ruleTypes,
      rules: mergedRules.value,
      labels: mergedLabels.value
    }))

    onMounted(() => {
      if (typeof props.modelValue !== 'undefined' && props.modelValue !== null) {
        query.value = Object.assign(query.value, props.modelValue)
      }
    })

    watch(
      () => query.value,
      (newQuery) => {
        if (JSON.stringify(newQuery) !== JSON.stringify(props.modelValue)) {
          emit('update:modelValue', deepClone(newQuery))
        }
      },
      {
        deep: true
      }
    )

    watch(
      () => props.modelValue,
      (newValue) => {
        if (JSON.stringify(newValue) !== JSON.stringify(query.value)) {
          query.value = deepClone(newValue)
        }
      },
      {
        deep: true
      }
    )

    provide('t', t)
    provide('currentLocale', currentLocale)

    return {
      query,
      mergedLabels,
      mergedRules,
      vqbProps
    }
  }
}
</script>

<style scoped>
.vue-query-builder {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  box-sizing: border-box;
}
</style>
