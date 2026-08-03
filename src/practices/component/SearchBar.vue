<script setup>
// 부모로부터 현재 검색어를 단방향으로 전달받는다 (props)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

// 입력이 일어나면 update-query 이벤트로 검색어를 부모에게 올려보낸다 (emits)
defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <h3 class="box-title">도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      class="search-input"
      @input="$emit('update-query', $event.target.value)"
    />
    <p class="search-echo">
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.box-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: var(--s2);
  padding-bottom: var(--s1);
  border-bottom: 1px solid var(--line-strong);
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line-strong);
  background: var(--paper);
  outline: none;
}

.search-input:focus {
  box-shadow: 2px 2px 0 var(--line-strong);
}

.search-echo {
  margin-top: var(--s1);
  font-size: 13px;
  color: var(--muted);
}

.search-echo strong {
  color: var(--ink);
}
</style>
