<template>
  <el-card class="vqb-rule" shadow="hover">
    <div class="rule-content">
      <span class="rule-label">{{ ruleDisplayLabel }}</span>

      <!-- List of operands (optional) -->
      <el-select
        v-if="typeof rule.operands !== 'undefined'"
        v-model="query.operand"
        class="form-item operand-select"
        :placeholder="labels.selectOperandPlaceholder"
      >
        <el-option
          v-for="operand in rule.operands"
          :key="operand"
          :label="getOperandLabel(operand)"
          :value="operand"
        />
      </el-select>

      <!-- List of operators (e.g. =, !=, >, <) -->
      <el-select
        v-if="typeof rule.operators !== 'undefined' && rule.operators.length > 1"
        v-model="query.operator"
        class="form-item operator-select"
        :placeholder="labels.selectOperatorPlaceholder"
      >
        <el-option
          v-for="operator in rule.operators"
          :key="operator"
          :label="getOperatorLabel(operator)"
          :value="operator"
        />
      </el-select>

      <!-- Basic text input -->
      <el-input
        v-if="rule.inputType === 'text'"
        v-model="query.value"
        class="form-item text-input"
        :placeholder="labels.textInputPlaceholder"
      />

      <!-- Basic number input -->
      <el-input-number
        v-if="rule.inputType === 'number'"
        v-model="query.value"
        class="form-item number-input"
        :min="0"
        :controls-position="right"
      />

      <!-- Datepicker -->
      <el-date-picker
        v-if="rule.inputType === 'date'"
        v-model="query.value"
        type="date"
        :placeholder="labels.selectDatePlaceholder"
        value-format="YYYY-MM-DD"
        class="form-item date-picker"
      />

      <!-- Custom component input -->
      <div
        v-if="isCustomComponent"
        class="vqb-custom-component-wrap form-item"
      >
        <component
          :is="rule.component"
          :value="query.value"
          @input="updateQuery"
        />
      </div>

      <!-- Checkbox input -->
      <el-checkbox-group
        v-if="rule.inputType === 'checkbox'"
        v-model="query.value"
        class="form-item checkbox-group"
      >
        <el-checkbox
          v-for="choice in rule.choices"
          :key="choice.value"
          :value="choice.value"
        >
          {{ getChoiceLabel(choice) }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- Radio input -->
      <el-radio-group
        v-if="rule.inputType === 'radio'"
        v-model="query.value"
        class="form-item radio-group"
      >
        <el-radio
          v-for="choice in rule.choices"
          :key="choice.value"
          :value="choice.value"
        >
          {{ getChoiceLabel(choice) }}
        </el-radio>
      </el-radio-group>

      <!-- Select without groups -->
      <el-select
        v-if="rule.inputType === 'select' && !hasOptionGroups"
        v-model="query.value"
        :multiple="rule.type === 'multi-select'"
        class="form-item value-select"
        :placeholder="labels.selectPlaceholder"
      >
        <el-option
          v-for="option in selectOptions"
          :key="option.value"
          :label="getChoiceLabel(option)"
          :value="option.value"
        />
      </el-select>

      <!-- Select with groups -->
      <el-select
        v-if="rule.inputType === 'select' && hasOptionGroups"
        v-model="query.value"
        :multiple="rule.type === 'multi-select'"
        class="form-item value-select"
        :placeholder="labels.selectPlaceholder"
      >
        <el-option-group
          v-for="(options, label) in selectOptions"
          :key="label"
          :label="label"
        >
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="getChoiceLabel(option)"
            :value="option.value"
          />
        </el-option-group>
      </el-select>

      <!-- Remove rule button -->
      <el-button
        type="danger"
        text
        @click="remove"
        class="remove-btn"
      >
        {{ labels.removeRule }}
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { computed, inject } from 'vue'
import QueryBuilderRule from '../../components/QueryBuilderRule.vue'

export default {
  extends: QueryBuilderRule,
  setup(props) {
    const t = inject('t', (key) => key)
    
    const ruleDisplayLabel = computed(() => {
      if (props.rule.labelI18n) {
        return t(props.rule.labelI18n)
      }
      return props.rule.label || ''
    })
    
    const getOperatorLabel = (operator) => {
      if (props.labels && props.labels.getOperatorTranslation) {
        return props.labels.getOperatorTranslation(operator)
      }
      return operator
    }
    
    const getOperandLabel = (operand) => {
      if (props.rule.operandLabels && props.rule.operandLabels[operand]) {
        return t(props.rule.operandLabels[operand])
      }
      return operand
    }
    
    const getChoiceLabel = (choice) => {
      if (choice.labelI18n) {
        return t(choice.labelI18n)
      }
      return choice.label
    }
    
    return {
      ruleDisplayLabel,
      getOperatorLabel,
      getOperandLabel,
      getChoiceLabel
    }
  }
}
</script>

<style scoped>
.vqb-rule {
  margin-bottom: 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.vqb-rule:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.rule-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.rule-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.form-item {
  flex: 1 1 180px;
  min-width: 160px;
}

.text-input {
  flex: 1 1 220px;
  min-width: 180px;
}

.number-input {
  flex: 1 1 160px;
  min-width: 140px;
}

.date-picker {
  flex: 1 1 200px;
  min-width: 180px;
}

.operand-select,
.operator-select,
.value-select {
  flex: 1 1 160px;
  min-width: 140px;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1 1 100%;
}

.remove-btn {
  flex-shrink: 0;
  padding: 4px 8px;
  font-size: 14px;
  white-space: nowrap;
  margin-left: auto;
}

/* 针对 Element Plus 组件内部样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-date-editor .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
}

/* 响应式布局 - PC 尺寸优化 */
@media (min-width: 1200px) {
  .rule-content {
    flex-wrap: nowrap;
  }
  
  .rule-label {
    flex-basis: 120px;
  }
  
  .form-item {
    flex: 1 1 auto;
  }
  
  .text-input {
    flex: 2 1 auto;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .rule-content {
    flex-wrap: nowrap;
  }
  
  .rule-label {
    flex-basis: 100px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .rule-content {
    gap: 10px;
  }
  
  .rule-label {
    flex-basis: 100%;
  }
  
  .form-item {
    flex: 1 1 calc(50% - 10px);
  }
  
  .remove-btn {
    flex-basis: 100%;
    margin-left: 0;
    align-self: flex-end;
  }
}

@media (max-width: 767px) {
  .rule-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .rule-label {
    font-size: 15px;
  }
  
  .form-item {
    width: 100%;
    flex: 0 0 auto;
  }
  
  .remove-btn {
    align-self: flex-end;
    padding: 8px 16px;
    font-size: 16px;
    margin-left: 0;
  }
}
</style>
