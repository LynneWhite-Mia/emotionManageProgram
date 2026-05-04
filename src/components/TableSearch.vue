<template>
    <el-form ref='ruleFormRef':model="formDate">
      <el-row :gutter="24">
        <template v-for="item in formItemAttrs" :key="item.prop">
          <el-col v-bind="item.col">
            <el-form-item :label="item.label" :prop="item.prop">
              <component v-model="formDate[item.prop]" 
                :is="isComp(item.comp)" 
                :placeholder="item.placeholder">
                <template v-if="item.comp === 'select'">
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </template>
              </component>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset(ruleFormRef)">重置</el-button>
      </el-row>
    </el-form>
  </template>
  
  <script setup>
  import { ref , reactive ,computed } from 'vue'

  const props = defineProps({
    formItem: {
      type: Array,
      default: () => []
    }
  }) 
  const emit = defineEmits(['search'])

  const formItemAttrs = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  })
    return formItem
  })
  //表单数据
  const ruleFormRef=ref()
  const formDate = reactive({})
  const isComp = (comp) => {
    return {
      input: 'ElInput',
      select: 'ElSelect'
    }[comp]
  }

  const handleSearch = () => {
    emit ('search',formDate)
  }
  const handleReset = (formEl) => {
    //先重置表单，再触发查询
    if(!formEl) return
    formEl.resetFields()
    emit ('search',formDate)
  }
  </script>