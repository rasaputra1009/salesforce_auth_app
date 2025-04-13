<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="text-center mb-4">Register</h2>
      <form @submit.prevent="register" class="auth-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            class="input-field"
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="input-field"
          />
        </div>
        <div class="input-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
            class="input-field"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Register</button>
        <p class="text-center mt-3">
          Already have an account? <router-link to="/login" class="text-link">Login here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      toast: useToast(),
      router: useRouter(),
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.toast.error('Passwords do not match');
        return;
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/register`, {
          email: this.email,
          password: this.password,
        });
        this.toast.success('Account created successfully');
        this.router.push('/login');
      } catch (error) {
        console.error('Register error:', error);
        this.toast.error('Error creating account');
      }
    },
  },
});
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #4e73df, #1cc88a);
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-box h2 {
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.input-group label {
  font-size: 14px;
  color: #555;
}

.input-field {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  margin-top: 6px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #1cc88a;
  outline: none;
}

.btn-primary {
  background-color: #4e73df;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #1cc88a;
}

.text-link {
  color: #4e73df;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.mt-3 {
  margin-top: 20px;
}
</style>
