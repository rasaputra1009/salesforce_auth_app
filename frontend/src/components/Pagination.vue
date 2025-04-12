<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      class="btn btn-outline-primary me-2"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      :aria-disabled="currentPage === 1 ? 'true' : 'false'"
    >
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      class="btn btn-outline-primary ms-2"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      :aria-disabled="currentPage === totalPages ? 'true' : 'false'"
    >
      Next
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  methods: {
    changePage(page: number) {
      // Only emit the event if the page change is valid (i.e., within bounds)
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-changed', page);
      }
    },
  },
});
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
