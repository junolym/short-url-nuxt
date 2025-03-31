
<template>
  <div class="flex justify-center items-start px-4 pt-20 pb-4">
    <div class="w-full max-w-2xl relative text-center">
      <h1 class="text-4xl font-semibold mb-8 text-gray-900 dark:text-white">短链接生成器</h1>
      
      <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="flex gap-2">
            <UInput
              v-model="url"
              :loading="isLoading"
              placeholder="在此输入您的长链接"
              size="lg"
              class="flex-1"
              icon="i-heroicons-link"
              :disabled="isLoading"
            />
            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isLoading"
              icon="i-heroicons-pencil"
            >
              生成
            </UButton>
          </div>

          <UAlert
            v-if="error"
            :description="error"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            class="mt-4"
          />

          <Transition name="slide-fade">
            <div v-if="shortUrl" class="mt-6">
              <UCard
                :ui="{ 
                  base: 'transition-all duration-300 hover:-translate-y-0.5',
                  body: { padding: 'p-4' }
                }"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">您的短链接：</div>
                    <ULink
                      :to="shortUrl"
                      target="_blank"
                      class="text-primary-500 dark:text-primary-400 break-all text-lg"
                    >
                      {{ shortUrl }}
                    </ULink>
                  </div>
                  <UButton
                    :color="copySuccess ? 'green' : 'primary'"
                    :variant="copySuccess ? 'soft' : 'ghost'"
                    :icon="copySuccess ? 'i-heroicons-check' : 'i-heroicons-document-duplicate'"
                    :loading="copying"
                    square
                    @click="copyUrl"
                  />
                </div>
              </UCard>
            </div>
          </Transition>
        </form>
      </div>

      <UButton
        to="/manage"
        variant="link"
        color="primary"
        class="mt-4"
        icon="i-heroicons-cog-6-tooth"
      >
        管理链接
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = ref('')
const shortUrl = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)
const copying = ref(false)
const copySuccess = ref(false)

const handleSubmit = async () => {
  if (!url.value) {
    error.value = '请输入链接'
    return
  }

  error.value = null
  isLoading.value = true

  try {
    // 验证URL格式
    try {
      new URL(url.value)
    } catch (err) {
      throw new Error('请输入有效的链接地址')
    }

    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '生成短链接失败')
    }

    const data = await response.json()
    shortUrl.value = data.shortUrl
  } catch (err) {
    error.value = err instanceof Error ? err.message : '生成短链接失败'
  } finally {
    isLoading.value = false
  }
}

const copyUrl = async () => {
  if (!shortUrl.value) return
  
  copying.value = true
  try {
    await navigator.clipboard.writeText(shortUrl.value)
    const toast = useToast()
    toast.add({
      title: '已复制到剪贴板',
      icon: 'i-heroicons-check-circle'
    })
    copySuccess.value = true
  } catch (err) {
    const toast = useToast()
    toast.add({
      title: '复制失败',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    copying.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>