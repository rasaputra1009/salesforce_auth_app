<template>
  <div class="dashboard">
    <h2>Salesforce Accounts</h2>
    <button @click="logout" class="btn btn-secondary mb-3">Logout</button>

    <!-- Show loader while data is loading -->
    <div v-if="isLoading" class="loader">Loading...</div>

    <!-- Show accounts table once data is loaded -->
    <div v-else>
      <table class="table table-bordered" v-if="accounts.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Industry</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.Id">
            <td>{{ account.Name }}</td>
            <td>{{ account.Industry || 'N/A' }}</td>
            <td>{{ account.Phone || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Show Pagination if there are accounts, otherwise show message -->
      <div v-if="accounts.length > 0">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="changePage"
        />
      </div>
      <div v-else>No accounts found.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import Pagination from '../components/Pagination.vue';
import { Account, PaginatedResponse } from '../types';

export default defineComponent({
  name: 'Dashboard',
  components: { Pagination },
  setup() {
    const toast = useToast();
    const router = useRouter();
    return { toast, router };
  },
  data() {
    return {
      accounts: [] as Account[],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      isLoading: true,
    };
  },
  async created() {
    await this.fetchAccounts();
  },
  methods: {
    async fetchAccounts() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.push('/login');
          return;
        }

        const response = await axios.get<PaginatedResponse>(
          `${process.env.VUE_APP_API_URL}/api/salesforce/accounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
            },
          }
        );

        console.log('API Response:', response.data);

        this.accounts = response.data.accounts;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (error: any) {
        this.toast.error(error.response?.data?.message || 'Failed to fetch accounts');
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token'); // Clear invalid token
          this.router.push('/login'); // Redirect to login
        }
        this.accounts = [];
      } finally {
        this.isLoading = false;
      }
    },
    async changePage(page: number) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      await this.fetchAccounts();
    },
    async logout() {
      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/logout`);
        localStorage.removeItem('token'); // Clear token from localStorage
        this.router.push('/login');
        this.toast.success('Logged out successfully');
      } catch (error) {
        this.toast.error('Error logging out');
        this.router.push('/login');
      }
    },
  },
});
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}
</style>