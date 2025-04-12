<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
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
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <p class="mt-3">
      Already have an account? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Register',
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
    async handleRegister() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/auth/register`,
          {
            email: this.email,
            password: this.password,
          }
        );
        localStorage.setItem('token', response.data.token);
        this.toast.success('Registration successful!');
        this.router.push('/dashboard');
      } catch (error: any) {
        this.toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  },
});
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
}
</style>