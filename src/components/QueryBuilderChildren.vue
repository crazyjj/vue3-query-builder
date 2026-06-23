<template>
  <div class="vqb-children">
    <component
      :is="getComponent(child.type)"
      v-for="(child, index) in safeChildren"
      :key="index"
      :type="child.type"
      v-model:query="child.query"
      :rule-types="ruleTypes"
      :rules="rules"
      :rule="getRule(child)"
      :index="index"
      :max-depth="maxDepth"
      :depth="depth + 1"
      :labels="labels"
      @child-deletion-requested="removeChild"
    />
  </div>
</template>

<script>
import ElementPlusGroup from '../layouts/ElementPlus/ElementPlusGroup.vue';
import ElementPlusRule from '../layouts/ElementPlus/ElementPlusRule.vue';

export default {
  components: {
    ElementPlusGroup,
    ElementPlusRule
  },

  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    ruleTypes: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Array,
      default: () => []
    },
    maxDepth: {
      type: Number,
      default: 3
    },
    labels: {
      type: Object,
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 1
    },
    ruleById: {
      type: Function,
      default: () => () => null
    },
    removeChild: {
      type: Function,
      default: () => () => {}
    }
  },

  computed: {
    safeChildren() {
      if (!this.query || !Array.isArray(this.query.children)) {
        return [];
      }
      return this.query.children;
    }
  },

  methods: {
    getComponent(type) {
      return type === 'query-builder-group'
        ? ElementPlusGroup
        : ElementPlusRule;
    },

    getRule(child) {
      if (!this.ruleById || !child || !child.query) {
        return null;
      }
      return this.ruleById(child.query.rule);
    }
  }
}
</script>
