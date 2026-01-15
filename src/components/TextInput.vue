<script setup lang="ts">
import type { BaseValidation } from 'vuelidate/core'
import { computed } from 'vue'

interface Props {
  label: string
  type?: string
  disabled?: boolean
  validation: BaseValidation
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  disabled: false
})

const emit = defineEmits<{
  blur: []
}>()

const model = defineModel<string>({ required: true })

const hasError = computed(() => props.validation?.$error || false)
const errors = computed(() => props.validation?.$errors || [])

const handleBlur = () => {
  props.validation?.$touch()
  emit('blur')
}
</script>
<template>
  <div class="form-group">
    <input
      :id="label"
      v-model="model"
      :type="type"
      :placeholder="label"
      :disabled="disabled"
      :class="{ 'input-error': hasError }"
      @blur="handleBlur"
    />
    <div v-if="hasError" class="error-messages">
      <p v-for="error of errors" :key="error.$uid" class="error-message">
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>
<style>
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

</style>
