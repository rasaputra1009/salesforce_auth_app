<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h2>Salesforce Accounts</h2>
      <button @click="logout" class="btn btn-primary">Logout</button>
    </header>
    <div class="content">
      <!-- Show loader while data is loading -->
      <div v-if="isLoading" class="loader">Loading...</div>

      <!-- Show accounts table once data is loaded -->
      <div v-else class="table-container">
        <table v-if="accounts.length > 0" class="accounts-table">
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
        <p v-else class="no-data">No accounts found. {{ errorMessage }}</p>

        <!-- Pagination -->
        <div v-if="accounts.length > 0" class="pagination-container">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-changed="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import Pagination from '../components/Pagination.vue';
import { Account, PaginatedResponse } from '../types';

export default defineComponent({
  name: 'Dashboard',
  components: { Pagination },
  data() {
    return {
      accounts: [] as Account[],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10, // Set to 10 per page
      isLoading: false,
      errorMessage: '',
      toast: useToast(),
      router: useRouter(),
    };
  },
  methods: {
    async fetchAccounts() {
      console.log('Fetching accounts, page:', this.currentPage);
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response = await axios.get<PaginatedResponse>(
          `${process.env.VUE_APP_API_URL}/api/salesforce/accounts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
            },
          }
        );
        this.accounts = response.data.accounts;
        this.totalPages = Math.ceil(response.data.totalSize / this.pageSize); // Calculate totalPages from totalSize
        this.currentPage = response.data.currentPage;
      } catch (error: any) {
        console.error('Fetch error:', error.response?.data || error.message);
        this.errorMessage = error.response?.data?.message || 'Failed to fetch accounts';
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          this.router.push('/login');
        }
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
        await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
        this.toast.error('Error logging out');
      } finally {
        localStorage.removeItem('token');
        this.toast.success('Logged out successfully');
        this.router.push('/login');
      }
    },
  },
  mounted() {
    console.log('Dashboard component mounted, calling fetchAccounts');
    this.fetchAccounts();
  },
});
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Loader */
.loader {
  text-align: center;
  font-size: 20px;
  color: #007bff;
  padding: 30px;
  font-weight: 500;
}

/* Table Container */
.table-container {
  overflow-x: auto;
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.accounts-table th,
.accounts-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.accounts-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.accounts-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.accounts-table tr:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  color: #6c757d;
  font-size: 18px;
  padding: 30px;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* Add subtle border to table for improved readability */
.accounts-table {
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
