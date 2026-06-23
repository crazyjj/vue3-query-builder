<template>
  <div></div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import deepClone from '../utilities.js';
import QueryBuilderChildren from './QueryBuilderChildren.vue';

export default {
  components: {
    QueryBuilderChildren
  },

  props: {
    ruleTypes: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "query-builder-group"
    },
    query: {
      type: Object,
      default: () => ({ children: [], logicalOperator: 'all' })
    },
    rules: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    maxDepth: {
      type: Number,
      default: 3
    },
    depth: {
      type: Number,
      default: 1
    },
    labels: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      selectedRule: this.rules[0] || null
    }
  },

  methods: {
    ruleById (ruleId) {
      var rule = null;
      
      if (!this.rules || !Array.isArray(this.rules)) {
        return rule;
      }

      this.rules.forEach(function(value){
        if ( value.id === ruleId ) {
          rule = value;
          return false;
        }
      });

      return rule;
    },

    addRule () {
      if (!this.selectedRule) {
        return;
      }
      
      let updated_query = deepClone(this.query);
      let child = {
        type: 'query-builder-rule',
        query: {
          rule: this.selectedRule.id,
          operator: this.selectedRule.operators ? this.selectedRule.operators[0] : null,
          operand: typeof this.selectedRule.operands === "undefined" ? this.selectedRule.label : this.selectedRule.operands[0],
          value: null
        }
      };
      // A bit hacky, but `v-model` on `select` requires an array.
      let ruleByIdResult = this.ruleById(child.query.rule);
      if (ruleByIdResult && ruleByIdResult.type === 'multi-select') {
        child.query.value = [];
      }
      if (!updated_query.children) {
        updated_query.children = [];
      }
      updated_query.children.push(child);
      this.$emit('update:query', updated_query);
    },

    addGroup () {
      let updated_query = deepClone(this.query);
      if ( this.depth < this.maxDepth ) {
        if (!updated_query.children) {
          updated_query.children = [];
        }
        updated_query.children.push({
          type: 'query-builder-group',
          query: {
            logicalOperator: this.labels.matchTypes ? this.labels.matchTypes[0].id : 'all',
            children: []
          }
        });
        this.$emit('update:query', updated_query);
      }
    },

    remove () {
      this.$emit('child-deletion-requested', this.index);
    },

    removeChild (index) {
      let updated_query = deepClone(this.query);
      if (!updated_query.children) {
        updated_query.children = [];
      }
      updated_query.children.splice(index, 1);
      this.$emit('update:query', updated_query);
    }
  }
}
</script>
