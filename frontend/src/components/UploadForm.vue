<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`You can only upload 1 file at a time. Please remove the existing file first.`)
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.name.endsWith('.zip')
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isZip) {
    ElMessage.error('Only ZIP files are allowed!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('File size must be less than 50MB!')
    return false
  }
  return true
}

const handleUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('Please select a file to upload')
    return
  }

  const formData = new FormData()
  fileList.value.forEach((file) => {
    if (file.raw) {
      formData.append('file', file.raw)
    }
  })

  try {
    ElMessage.success('File uploaded successfully!')
  } catch {
    ElMessage.error('Failed to upload file')
  }
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  fileList.value = uploadFiles
}

const handleChange: UploadProps['onChange'] = (file, uploadFiles) => {
  fileList.value = uploadFiles
}
</script>

<template>
  <el-card class="upload-card">
    <template #header>
      <div class="card-header">
        <span>Upload ZIP File</span>
      </div>
    </template>

    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      drag
      :auto-upload="false"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :limit="1"
      accept=".zip"
    >
      <el-icon class="el-icon--upload">
        <Upload />
      </el-icon>
      <div class="el-upload__text">Drop ZIP file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">Only ZIP files less than 50MB are allowed</div>
      </template>
    </el-upload>

    <el-button
      type="primary"
      :disabled="fileList.length === 0"
      @click="handleUpload"
      class="upload-button"
    >
      Upload File
    </el-button>
  </el-card>
</template>

<style scoped>
.upload-card {
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 500;
}

.upload-demo {
  width: 100%;
}

.upload-button {
  width: 100%;
  margin-top: 20px;
}
</style>
