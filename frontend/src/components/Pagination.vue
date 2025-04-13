<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
      </li>
      <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['page-changed'],
  methods: {
    changePage(page: number) {
      this.$emit('page-changed', page);
    },
  },
});
</script>

<style scoped>
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}
.page-item {
  margin: 0 5px;
}
.page-link {
  color: #007bff;
  text-decoration: none;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.page-link:hover {
  background-color: #f8f9fa;
}
.active .page-link {
  background-color: #007bff;
  color: white;
}
.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #e9ecef;
}
</style>