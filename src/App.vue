<template>
  <div class="app-container">
    <div class="app-header">
      <div class="language-switcher">
        <el-select v-model="currentLocale" @change="changeLocale">
          <el-option label="中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </div>
    </div>
    <div class="app-content">
      <vue-query-builder :rules="rules" v-model="output" />
    </div>
    <div class="output-section">
      <div class="output-divider">
        <span class="divider-text">{{ t('common.output') }}</span>
      </div>
      <div class="output-display">
        <h3 class="output-title">Output:</h3>
        <pre class="output-json">{{ outputFormatted }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import VueQueryBuilder from './VueQueryBuilder.vue'

export default {
  name: 'App',
  components: {
    VueQueryBuilder
  },
  setup() {
    const { t, locale } = useI18n()
    
    const changeLocale = (newLocale) => {
      locale.value = newLocale
    }
    
    return {
      t,
      currentLocale: locale,
      changeLocale
    }
  },
  data() {
    return {
      rules: [
        {
          type: 'text',
          id: 'first-name',
          label: 'First Name',
          labelI18n: 'demo.firstName'
        },
        {
          type: 'text',
          id: 'last-name',
          label: 'Last Name',
          labelI18n: 'demo.lastName'
        },
        {
          type: 'radio',
          id: 'plan-type',
          label: 'Plan Type',
          labelI18n: 'demo.planType',
          choices: [
            { label: 'Standard', value: 'standard', labelI18n: 'demo.standard' },
            { label: 'Premium', value: 'premium', labelI18n: 'demo.premium' }
          ]
        },
        {
          type: 'checkbox',
          id: 'sizes',
          label: 'Sizes',
          labelI18n: 'demo.sizes',
          choices: [
            { label: 'Small', value: 'small', labelI18n: 'demo.small' },
            { label: 'Medium', value: 'medium', labelI18n: 'demo.medium' },
            { label: 'Large', value: 'large', labelI18n: 'demo.large' }
          ]
        },
        {
          type: 'text',
          id: 'date',
          inputType: 'date',
          label: 'Date',
          labelI18n: 'demo.date',
          operands: ['Start Date', 'End Date'],
          operandLabels: {
            'Start Date': 'demo.startDate',
            'End Date': 'demo.endDate'
          }
        },
        {
          type: 'select',
          id: 'select',
          label: 'Color',
          labelI18n: 'demo.color',
          choices: [
            { label: 'red', value: 'Red', labelI18n: 'demo.red' },
            { label: 'orange', value: 'Orange', labelI18n: 'demo.orange' },
            { label: 'yellow', value: 'Yellow', labelI18n: 'demo.yellow' },
            { label: 'green', value: 'Green', labelI18n: 'demo.green' },
            { label: 'blue', value: 'Blue', labelI18n: 'demo.blue' },
            { label: 'indigo', value: 'Indigo', labelI18n: 'demo.indigo' },
            { label: 'violet', value: 'Violet', labelI18n: 'demo.violet' }
          ]
        }
      ],
      output: {}
    }
  },
  computed: {
    outputFormatted() {
      return JSON.stringify(this.output, null, 2)
    }
  },
  methods: {
    updateQuery(value) {
      this.output = value
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-header {
  max-width: 1400px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: flex-end;
}

.language-switcher {
  background: white;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-content {
  max-width: 1400px;
  margin: 0 auto 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.output-section {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.output-divider {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.divider-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.output-display {
  padding: 24px 32px;
}

.output-title {
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.output-json {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  color: #2d3748;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
}

.output-json::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.output-json::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.output-json::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.output-json::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}
</style>
