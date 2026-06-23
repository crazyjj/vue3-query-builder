<template>
  <div></div>
</template>

<script>
import deepClone from '../utilities.js';

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    labels: {
      type: Object,
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 1
    }
  },

  computed: {
    isCustomComponent () {
      return this.rule && this.rule.type === 'custom-component';
    },

    selectOptions () {
      if (!this.rule || typeof this.rule.choices === 'undefined') {
        return {};
      }

      // Nest items to support <optgroup> if the rule's choices have
      // defined groups. Otherwise just return a single-level array
      return this.rule.choices.reduce(function(groups, item, index) {
        let key = item['group'];
        if (typeof key !== 'undefined') {
          groups[key] = groups[key] || [];
          groups[key].push(item);
        } else {
          groups[index] = item;
        }

        return groups;
      }, {});
    },

    hasOptionGroups() {
      return this.selectOptions.length && Array.isArray(this.selectOptions[0]);
    }
  },

  mounted () {
    if (!this.rule) {
      return;
    }
    
    let updated_query = deepClone(this.query);

    // Set a default value for these types if one isn't provided already
    if (this.query && this.query.value === null) {
      if (this.rule.inputType === 'checkbox') {
          updated_query.value = [];
      }
      if (this.rule.type === 'select' && this.rule.choices && this.rule.choices[0]) {
          updated_query.value = this.rule.choices[0].value;
      }
      if (this.rule.type === 'custom-component') {
        updated_query.value = null;
        if (typeof this.rule.default !== 'undefined') {
          updated_query.value = deepClone(this.rule.default)
        }
      }

      this.$emit('update:query', updated_query);
    }
  },

  methods: {
    remove: function() {
      this.$emit('child-deletion-requested', this.index);
    },
    updateQuery(value) {
      let updated_query = deepClone(this.query);
      updated_query.value = value;
      this.$emit('update:query', updated_query);
    },
  }
}
</script>
