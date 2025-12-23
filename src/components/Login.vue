<template>
  <div class="login-container">
    <div class="login-form">
      <div class="form-header">
        <img src="@/assets/lumen_valley_lgo.png" alt="Lumen Valley Logo" class="logo" />
        <p>Veuillez entrer vos identifiants</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Votre email"
            required
            :class="{ 'error-input': error && !email }"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Votre mot de passe"
            required
            :class="{ 'error-input': error && !password }"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          <span v-if="!loading">Se connecter</span>
          <span v-else>Connexion en cours...</span>
        </button>
      </form>

      <div class="form-footer">
        <p>© {{ new Date().getFullYear() }} wequipuinternational. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '@/services/authService.js';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    console.log('Starting login process with email:', email.value);
    const response = await authService.login(email.value, password.value);
    console.log('Login successful, response:', response);

    // Store user info in localStorage if needed
    localStorage.setItem('user_info', JSON.stringify(response.user));

    // Redirect to dashboard or home page after successful login
    console.log('Redirecting to dashboard...');
    router.push('/'); // Change this to your desired redirect route
  } catch (err) {
    console.error('Login error details:', err);
    console.error('Error response:', err?.response);

    // Handle different types of error responses
    if (err && err.response) {
      if (err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else if (err.response.data && err.response.data.errors && err.response.data.errors.email) {
        error.value = err.response.data.errors.email[0];
      } else {
        error.value = 'Email ou mot de passe incorrect';
      }
    } else if (err && err.message) {
      error.value = err.message;
    } else {
      error.value = 'Une erreur de connexion est survenue. Veuillez réessayer.';
    }
  } finally {
    loading.value = false;
    console.log('Login process completed, loading:', loading.value);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background: url('@/assets/bat_lumen.png') no-repeat center center fixed;
  background-size: cover;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-form {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px; /* Élargi le formulaire */
  backdrop-filter: blur(5px); /* Effet de flou pour le fond */
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 150px; /* Réduit la taille du logo */
  height: auto;
  margin-bottom: 0.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.form-header p {
  color: #777;
  margin: 0;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-group input.error-input {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  margin: 1rem 0;
  text-align: center;
  padding: 0.75rem;
  background-color: #fdeded;
  border: 1px solid #fadbd8;
  border-radius: 6px;
  font-size: 0.9rem;
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #eacb59 0%, #e6a315 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: translateY(2px);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  color: #888;
  font-size: 0.8rem;
}
</style>