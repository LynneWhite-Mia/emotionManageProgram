<template>
    <el-dialog
      :title="isEdit ? '编辑文章' : '新增文章'"
      v-model="dialogVisible"
      width="50%"
      @close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable/>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" >
                <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
              <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4"/>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
              <el-select v-model="formData.tagArray" placeholder="请输入文章标签(多个标签用逗号隔开)" multiple filterable allow-create style="width:100%">
                  <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
              </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
              <div class="cover-upload">
                <el-upload
                  action="avatar-uploader"
                  action:null
                  :before-upload="beforeUpload"
                  :http-request="handleloadRequest"
                  :show-file-list="false"
                  accept="image/*"
                >
                  <div v-if="!imageUrl" class="cover-placeholder">
                    <p>上传封面图片</p>
                  </div>
                  <img v-else :src="imageUrl" class="cover-image" alt="封面图片"/>
                </el-upload>
                <div v-if="imageUrl" class="cover-remove">
                  <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <RichTextEditor
                v-model="formData.content"
                placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。"
                :maxCharCount="5000"
                @change="handleContentChange"
                @created="handleEditorCreated"
                min-height="400px"
                />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h3>内容预览</h3>
            <div v-html="formData.content"></div>
        </div>
        <template #footer>
            <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit?'更新文章' : '创建文章' }}</el-button>
        </template>
    </el-dialog>
  </template>
  <script setup>
  import { ref,reactive,computed,nextTick,watch} from 'vue'
  import { ElMessage } from 'element-plus'
  import { uploadFile,createArticle,updateArticle} from '@/api/admin'
  import { fileBaseUrl } from '@/config/index.js'
  import RichTextEditor from '@/components/RichTextEditor.vue' 
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    categories:{
      type:Array,
      default:null
    },
    article:{
      type:Object,
      default:()=>({})
    }
  })

  const emit = defineEmits('update:modelValue','success')

  const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
  })

  const isEdit = computed(() => !!props.article?.id)

  // 监听编辑数据
  watch(() => props.article, (newVal) => {
    if (newVal) {
      nextTick(() => {
        Object.assign(formData, newVal)
        // 使用现有ID
        businessId.value = newVal.id
        // 封面Url
        imageUrl.value = fileBaseUrl + newVal.coverImage
      })
    }
})
  const handleClose = () => {
    //重置表单
    formRef.value.resetFields()
    //重置ID
    businessId.value = null
    //充值标签
    formData.tagArray = []
    //重置封面图片和数据
    handleRemove()
    emit('update:modelValue',false)
  }

// 表单数据
const formData = reactive({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": "",
  "summary": "",
  "tags": "",
  "id": ""
})

const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId:[
    { required:true,message:'请选择分类',trigger:'change'}
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容最多50000个字符', trigger: 'blur' }
  ],
})
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
// 上传封面图片
const imageUrl = ref('')
const beforeUpload = (file) => {
  //针对上传的图片进行处理
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1014 / 1014 < 5
  if(!isImage){
    ElMessage.error('请上传封面文件，请选择图片文件')
    return false
  }
  if(!isLt5M){
    ElMessage.error('封面图片大小不能超过5MB')
    return false
  }
  return true
}
const businessId = ref(null)
const handleloadRequest = async ({file}) => {
//UUID生成
  businessId.value =crypto.randomUUID()
  const fileRes = await uploadFile(file,{businessId:businessId.value})
  console.log(fileRes)
  

  //拼接完整的图片地址
  imageUrl.value = fileBaseUrl + fileRes.filePath
  formData.coverImage = fileRes.filePath
  console.log('拼接后的地址:', fileBaseUrl + fileRes.filePath)
}

const handleRemove = () => {
  imageUrl.value =''
  formData.coverImage=''
}

// 富文本
const handleContentChange = (data) => {
    console.log(data, '富文本内容')
    formData.content = data.html
}

const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    // 编辑
    if (formData.content && editor) {
      nextTick(() => {
        editor.setHtml(formData.content)
      })
    }
}

const btnPreview = ref(false)

//提交
const formRef = ref()
const loading = ref(false)
const handleSubmit =()=>{
  formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value = true
    }
    console.log(FormDataEvent,'FormDate')
    const submitDate ={
      ...formData,
      tags:formData.tagArray.join(',')
    }
    delete submitDate.tagArray

    if(!isEdit.value){
      submitDate.id = businessId.value
      createArticle(submitDate).then(res =>{
        loading.value = false
        emit('success')
      })
    }
    else{
      updateArticle(props.article.id,submitDate).then(res=>{
      loading.value = false
      emit('success')
    })
    }

  })
}
</script>
<style scoped lang="scss">
.cover-placeholder{
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f6f8fa;
  color: #8b949e;
}
.cover-image{
  width: 200px;
  height: 120px;
  display: block;
}
</style>