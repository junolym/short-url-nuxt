
<template>
  <div class="max-w-7xl mx-auto p-4">
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="text-lg font-medium">确认删除</div>
        </template>
        <div class="p-4">确定要删除这个链接吗？此操作不可撤销。</div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton @click="showDeleteModal = false">取消</UButton>
            <UButton
              color="red"
              variant="solid"
              @click="confirmDelete"
            >
              删除
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
    <div class="mb-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        to="/"
        class="mb-2"
      >
        返回
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold">短链接管理</span>
          <UButton
            icon="i-heroicons-arrow-path"
            :loading="loading"
            @click="loadUrls"
          >
            刷新
          </UButton>
        </div>
      </template>

      <UAlert
        v-if="error"
        :description="error"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        class="mb-4"
      />

      <div v-else>
        <UTable
          :rows="urls"
          :columns="columns"
          :loading="loading"
          :sort="{ column: 'created_at', direction: 'desc' }"
          :key="urls.length"
        >
          <template #short_code-data="{ row }">
            <ULink
              :to="`/${row.short_code}`"
              target="_blank"
              class="flex items-center gap-1"
            >
              {{ row.short_code }}
              <UIcon name="i-heroicons-arrow-top-right-on-square" />
            </ULink>
          </template>

          <template #original_url-data="{ row }">
            <div v-if="editingId === row.id" class="flex gap-2">
              <UInput
                v-model="editUrl"
                placeholder="输入新的链接"
                class="flex-1"
              />
              <UButtonGroup>
                <UButton
                  color="primary"
                  icon="i-heroicons-check"
                  @click="saveEdit(row.short_code)"
                  square
                />
                <UButton
                  icon="i-heroicons-x-mark"
                  @click="cancelEdit"
                  square
                />
              </UButtonGroup>
            </div>
            <div v-else class="break-all">
              {{ row.original_url }}
            </div>
          </template>

          <template #created_at-data="{ row }">
            <UTooltip :text="formatDate(row.created_at, true)">
              <span>{{ formatDate(row.created_at) }}</span>
            </UTooltip>
          </template>

          <template #actions-data="{ row }">
            <UButtonGroup>
              <UButton
                v-if="editingId !== row.id"
                color="primary"
                variant="ghost"
                icon="i-heroicons-pencil"
                square
                @click="startEdit(row)"
              />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                square
                @click="handleDelete(row.short_code)"
              />
            </UButtonGroup>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Url {
  id: number
  short_code: string
  original_url: string
  created_at: string
}

const urls = ref<Url[]>([])
const loading = ref(true)
const error = ref('')
const editingId = ref<number | null>(null)
const editUrl = ref('')
const showDeleteModal = ref(false)
const pendingDeleteCode = ref<string | null>(null)

const columns = [
  {
    key: 'short_code',
    label: '短链接',
  },
  {
    key: 'original_url',
    label: '原始链接',
  },
  {
    key: 'created_at',
    label: '创建时间',
    sortable: true,
  },
  {
    key: 'actions',
    label: '操作',
    width: '100px',
  },
]

const loadUrls = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/urls')
    if (!response.ok) throw new Error('加载链接失败')
    urls.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const startEdit = (url: Url) => {
  editingId.value = url.id
  editUrl.value = url.original_url
}

const cancelEdit = () => {
  editingId.value = null
  editUrl.value = ''
}

const saveEdit = async (shortCode: string) => {
  try {
    const response = await fetch(`/api/urls/${shortCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: editUrl.value })
    })
    if (!response.ok) throw new Error('更新链接失败')
    
    const toast = useToast()
    toast.add({
      title: '链接更新成功',
      icon: 'i-heroicons-check-circle'
    })
    
    await loadUrls()
    editingId.value = null
    editUrl.value = ''
  } catch (err: any) {
    error.value = err.message
    const toast = useToast()
    toast.add({
      title: err.message,
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}

const formatDate = (dateString: string, detailed = false) => {
  const date = new Date(dateString + 'Z')
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: detailed ? '2-digit' : undefined,
    hour12: false
  }
  return new Intl.DateTimeFormat(undefined, options).format(date)
}

// 组件加载时获取链接列表
onMounted(loadUrls)

const handleDelete = (shortCode: string) => {
    pendingDeleteCode.value = shortCode
    showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!pendingDeleteCode.value) return

  try {
    const response = await fetch(`/api/urls/${pendingDeleteCode.value}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('删除链接失败')
    
    const toast = useToast()
    toast.add({
      title: '链接删除成功',
      icon: 'i-heroicons-check-circle'
    })
    
    await loadUrls()
    showDeleteModal.value = false
    pendingDeleteCode.value = null
  } catch (err: any) {
    error.value = err.message
    const toast = useToast()
    toast.add({
      title: err.message,
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}
</script>