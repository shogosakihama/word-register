<template>
  <div class="debug-page">
    <h1>🔧 デバッグ情報</h1>
    <div class="debug-info">
      <h2>Runtime Config:</h2>
      <pre>{{ JSON.stringify(runtimeConfig, null, 2) }}</pre>
      
      <h2>Environment Variables:</h2>
      <pre>{{ envInfo }}</pre>
      
      <h2>API URL Test:</h2>
      <p>Configured URL: {{ apiUrl }}</p>
      <button @click="testApi" :disabled="testing">{{ testing ? 'テスト中...' : 'API接続テスト' }}</button>
      <div v-if="apiResult" class="api-result">
        <h3>結果:</h3>
        <pre>{{ apiResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const apiUrl = 'https://word-register-production.up.railway.app'
const testing = ref(false)
const apiResult = ref('')

const envInfo = {
  userAgent: process.client ? navigator.userAgent : 'Server-side',
  timestamp: new Date().toISOString(),
  buildMode: process.dev ? 'development' : 'production'
}

const testApi = async () => {
  testing.value = true
  apiResult.value = ''
  
  try {
    const response = await fetch(`${apiUrl}/api/words`)
    const data = await response.json()
    apiResult.value = `✅ 成功: ${data.total} 個の単語を取得`
  } catch (error) {
    apiResult.value = `❌ エラー: ${error.message}`
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.debug-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.debug-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

pre {
  background: #000;
  color: #0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.api-result {
  margin-top: 20px;
  padding: 10px;
  background: #e7f3ff;
  border-radius: 4px;
}

button {
  background: #0070f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>