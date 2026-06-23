<template>
  <el-card
    class="vqb-group"
    :class="'depth-' + depth.toString()"
    shadow="hover"
  >
    <div class="vqb-group-header">
      <div class="match-type-container">
        <span class="label">{{ labels.matchType }}</span>

        <el-select
          id="vqb-match-type"
          v-model="query.logicalOperator"
          class="match-type-select"
        >
          <el-option
            v-for="label in labels.matchTypes"
            :key="label.id"
            :label="label.label"
            :value="label.id"
          />
        </el-select>

        <el-button
          v-if="depth > 1"
          type="danger"
          text
          @click="remove"
        >
          {{ labels.removeGroup }}
        </el-button>
      </div>
    </div>

    <div class="vqb-group-body">
      <div class="rule-actions">
        <el-select
          v-model="selectedRule"
          class="rule-select"
          :placeholder="labels.selectRulePlaceholder"
          :key="selectKey"
          value-key="id"
        >
          <el-option
            v-for="rule in rules"
            :key="rule.id"
            :label="getRuleDisplayLabel(rule)"
            :value="rule"
          />
        </el-select>

        <el-button
          type="primary"
          @click="addRule"
        >
          {{ labels.addRule }}
        </el-button>

        <el-button
          v-if="depth < maxDepth"
          type="success"
          @click="addGroup"
        >
          {{ labels.addGroup }}
        </el-button>
      </div>

      <query-builder-children
        v-bind="$props"
        :rule-by-id="ruleById"
        :remove-child="removeChild"
      />
    </div>
  </el-card>
</template>

<script>
import { inject, ref } from 'vue'
import QueryBuilderGroup from '../../components/QueryBuilderGroup.vue'
import ElementPlusRule from './ElementPlusRule.vue'

export default {
  name: "ElementPlusGroup",
  components: {
    ElementPlusRule
  },
  extends: QueryBuilderGroup,
  setup(props) {
    const t = inject('t', (key) => key)
    const selectKey = ref(0)
    
    const getRuleDisplayLabel = (rule) => {
      if (rule.labelI18n) {
        return t(rule.labelI18n)
      }
      return rule.label
    }
    
    return {
      getRuleDisplayLabel,
      selectKey
    }
  },
  data() {
    return {
      selectedRule: this.rules[0] || null
    }
  },
  watch: {
    labels: {
      handler() {
        // 当语言变化时，重新渲染选择器
        this.selectKey++
        // 保持当前选择的规则
        if (this.selectedRule) {
          const currentRule = this.ruleById(this.selectedRule.id)
          if (currentRule) {
            this.selectedRule = currentRule
          }
        }
      },
      deep: true
    },
    rules: {
      handler(newRules) {
        if (newRules && newRules.length > 0) {
          if (!this.selectedRule) {
            this.selectedRule = newRules[0]
          } else {
            const currentRule = this.ruleById(this.selectedRule.id)
            if (currentRule) {
              this.selectedRule = currentRule
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
.vqb-group {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.vqb-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.vqb-group-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.match-type-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.match-type-container .label {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.match-type-select {
  width: 160px;
}

.vqb-group-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.rule-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.rule-select {
  width: 220px;
}

.depth-1 {
  border-left: 4px solid #67c23a;
}

.depth-2 {
  border-left: 4px solid #409eff;
}

.depth-3 {
  border-left: 4px solid #e6a23c;
}

.depth-4 {
  border-left: 4px solid #f56c6c;
}
</style>
