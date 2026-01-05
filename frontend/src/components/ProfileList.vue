<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile, Status } from '@/types'
import { ElMessage } from 'element-plus'
import { Sort, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useProfileStore } from '@/store/profile';

interface Props {
  profiles: Profile[]
}

const props = defineProps<Props>()
const updatedProfiles = ref<Profile[]>([])
const store = useProfileStore()
const modifiedProfiles = ref<Record<string, Status>>({})
const { updateProfiles } = store
const currentPage = ref(1)
const pageSize = ref(10)
const sortOrder = ref<'default' | 'status-asc' | 'status-desc'>('default')
const statusFilter = ref<'no-status' | 'APPROVED' | 'UNFOLLOWED' | 'NOT_EXISTED' | 'all'>('all')

const statusPriority: Record<string, number> = {
  'APPROVED': 1,
  'UNFOLLOWED': 2,
  'NOT_EXISTED': 3,
}

const filteredProfiles = computed(() => {
  if (!props.profiles || !Array.isArray(props.profiles)) {
    return []
  }

  if (statusFilter.value === 'all') {
    return props.profiles
  }

  if (statusFilter.value === 'no-status') {
    return props.profiles.filter(profile => !profile.status)
  }

  return props.profiles.filter(profile => (profile.status as string) === statusFilter.value)
})

const sortedProfiles = computed(() => {
  const profiles = [...filteredProfiles.value]

  if (sortOrder.value === 'default') {
    return profiles
  }

  return profiles.sort((a, b) => {
    const aStatus = a.status || ''
    const bStatus = b.status || ''
    const aPriority = statusPriority[aStatus] ?? 999
    const bPriority = statusPriority[bStatus] ?? 999

    if (sortOrder.value === 'status-asc') {
      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }
      return aStatus.localeCompare(bStatus)
    } else {
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      return bStatus.localeCompare(aStatus)
    }
  })
})

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedProfiles.value.slice(start, end)
})



const applyProfilesUpdate = () => {
  updateProfiles(modifiedProfiles.value)
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
    modifiedProfiles.value[profile.username] = action as Status
  }
  console.log( "modifiedProfiles: " + modifiedProfiles.value[profile.username]);
  console.log( "updatedProfiles: " + updatedProfiles.value);
  ElMessage.success(`Action "${action}" applied to ${profile.username}`)
}

const goToProfile = (profile: Profile) => {
  window.open(profile.url, '_blank')
}

const getStatusType = (status?: string) => {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'UNFOLLOWED':
      return 'warning'
    case 'NOT_EXISTED':
      return 'danger'
    default:
      return 'info'
  }
}

const formatStatusDisplay = (status?: string) => {
  switch (status) {
    case 'APPROVED':
      return 'Approved'
    case 'UNFOLLOWED':
      return 'Unfollowed'
    case 'NOT_EXISTED':
      return 'Not Exist'
    default:
      return status || '-'
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const toggleStatusSort = () => {
  if (sortOrder.value === 'default') {
    sortOrder.value = 'status-asc'
  } else if (sortOrder.value === 'status-asc') {
    sortOrder.value = 'status-desc'
  } else {
    sortOrder.value = 'default'
  }
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Profile List</span>
        <div class="header-controls">
          <el-select
            v-model="statusFilter"
            @change="handleFilterChange"
            placeholder="Filter by status"
            style="width: 160px; margin-right: 10px;"
          >
            <el-option label="No Status" value="no-status" />
            <el-option label="Approved" value="APPROVED" />
            <el-option label="Unfollowed" value="UNFOLLOWED" />
            <el-option label="Not Exist" value="NOT_EXISTED" />
            <el-option label="All" value="all" />
          </el-select>
          <el-tag type="info">Total: {{ sortedProfiles.length }}</el-tag>
        </div>
      </div>
    </template>

    <el-table :data="paginatedProfiles" class="profile-table" stripe>
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

      <el-table-column prop="status" width="150">
        <template #header>
          <div class="status-header" @click="toggleStatusSort">
            <span>Status</span>
            <span class="sort-arrows">
              <el-icon v-if="sortOrder === 'default'" class="sort-icon inactive">
                <Sort />
              </el-icon>
              <el-icon v-else-if="sortOrder === 'status-asc'" class="sort-icon active">
                <ArrowUp />
              </el-icon>
              <el-icon v-else class="sort-icon active">
                <ArrowDown />
              </el-icon>
            </span>
          </div>
        </template>
        <template #default="{ row }">
          <el-tag v-if="row.status" :type="getStatusType(row.status)">
            {{ formatStatusDisplay(row.status) }}
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
                @click="updateProfileState(row, 'Approved')"
                :class="{ 'active': modifiedProfiles[row.username] === 'Approved' }"
                >
                Approve
              </el-button>
              <el-button
                size="small"
                type="danger"
                :plain="modifiedProfiles[row.username] === 'Not Exist'"
                :class="{ 'active': modifiedProfiles[row.username] === 'Not Exist' }"
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
        :total="sortedProfiles.length"
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

.header-controls {
  display: flex;
  align-items: center;
}

.profile-table {
  width: 100%;
  min-width: 1200px;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.status-header:hover {
  color: var(--el-color-primary);
}

.sort-arrows {
  display: inline-flex;
  align-items: center;
}

.sort-icon {
  font-size: 14px;
  transition: color 0.2s;
}

.sort-icon.active {
  color: var(--el-color-primary);
}

.sort-icon.inactive {
  color: var(--el-color-text-placeholder);
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
