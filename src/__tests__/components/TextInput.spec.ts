import { describe, it, expect } from 'vitest'
import { useVuelidate } from '@vuelidate/core'
import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { required, minLength } from '@vuelidate/validators'
import TextInput from "../../components/TextInput.vue"

describe("TextInput component", () => {
  const createValidation = (value: string, rules: any) => {
    const state = ref({ value })
    const v$ = useVuelidate(rules, state)
    return v$.value.value
  }

  it('renders input with correct props', () => {
    const validation = createValidation('', { required })
    const wrapper = mount(TextInput, {
      props: {
        label: 'Username',
        type: 'text',
        validation,
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Username')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('id')).toBe('Username')
  })

  it('uses default type "text" when type prop is not provided', () => {
    const validation = createValidation('', {})
    const wrapper = mount(TextInput, {
      props: {
        label: 'Default Type',
        validation,
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('updates v-model on input', async () => {
    const validation = createValidation('', { required })
    const wrapper = mount(TextInput, {
      props: {
        label: 'Email',
        validation,
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('test@example.com')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['test@example.com'])
  })

})
