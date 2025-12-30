<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile } from '@/types'
import { ElMessage } from 'element-plus'

interface Props {
  profiles: Profile[]
}

const props = defineProps<Props>()
const updatedProfiles = ref<Profile[]>([])

const modifiedProfiles = ref<Record<string, string>>({})

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.profiles.slice(start, end)
})



const applyProfilesUpdate = () => {
  ElMessage.success("apply triggered");

}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const updateProfileState = (profile: Profile, action: string) => {
  if (modifiedProfiles.value[profile.username] === action) {
    delete modifiedProfiles.value[profile.username]
  } else {
    modifiedProfiles.value[profile.username] = action
  }
  ElMessage.success(`Action "${action}" applied to ${profile.username}`)
}

const goToProfile = (profile: Profile) => {
  window.open(profile.url, '_blank')
}

const getStatusType = (status?: string) => {

  switch (status) {
    case 'Approved':
      return 'success'
    case 'Unfollow':
      return 'warning'
    case 'Not Exist':
      return 'danger'
    default:
      return 'info'
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Profile List</span>
        <el-tag type="info">Total: {{ profiles.length }}</el-tag>
      </div>
    </template>

    <el-table :data="paginatedProfiles" style="width: 100%" stripe>
      <el-table-column prop="username" label="User Name" min-width="150">
        <template #default="{ row }">
          <el-text tag="b">{{ row.username }}</el-text>
        </template>
      </el-table-column>

      <el-table-column prop="timestamp" label="Date" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.timestamp) }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Status" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.status" :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
          <el-text v-else type="info">-</el-text>
        </template>
      </el-table-column>

      <el-table-column label="Actions" min-width="400" fixed="right">
        <template  #default="{ row }">
          <div class="row">

            <el-button-group class="actions_group">
              <el-button
                size="small"
                type="warning"
                :plain="modifiedProfiles[row.username] === 'Unfollowed'"
                @click="updateProfileState(row, 'Unfollowed')">
                Unfollow
              </el-button>
              <el-button
                size="small"
                type="success"
                :plain="modifiedProfiles[row.username] === 'Approved'"
                @click="updateProfileState(row, 'Approved')">
                Approve
              </el-button>
              <el-button
                size="small"
                type="danger"
                :plain="modifiedProfiles[row.username] === 'Not Exist'"
                @click="updateProfileState(row, 'Not Exist')">
                Not Exist
              </el-button>
            </el-button-group>
            <el-button size="small" type="primary" @click="goToProfile(row)" class="ml-sm">
              Go to Profile
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="profiles.length"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
      <el-button type="info" @click="applyProfilesUpdate()">Update Profiles</el-button>
    </div>
  </el-card>
</template>

<style scoped>
  .actions_group{
    margin: 0 2px;
    min-width: 16rem;
  }
  .row{
    display: flex;

  }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  gap: 15px;
  display: flex;
  justify-content: center;
}

.ml-sm {
  margin-left: 8px;
}
</style>
