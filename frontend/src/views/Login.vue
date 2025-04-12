<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p class="mt-3">
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const toast = useToast();
    const router = useRouter();
    return { toast, router };
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/auth/login`,
          {
            email: this.email,
            password: this.password,
          }
        );
        localStorage.setItem('token', response.data.token);
        this.toast.success('Login successful!');
        this.router.push('/dashboard');
      } catch (error: any) {
        this.toast.error(error.response?.data?.message || 'Login failed');
      }
    },
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
}
</style>

