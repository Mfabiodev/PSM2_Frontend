<template>
  <div class="dashboard-container">
    <!-- BARRE DE NAVIGATION (NAVBAR) -->
    <nav class="navbar">
      <!-- Coin extrême gauche : Logo discret -->
      <div class="nav-logo">
        <img src="@/assets/lumen_valley_lgo.png" alt="Lumen Valley Logo" class="logo-image" />
      </div>

      <!-- Coin extrême droit : Profil utilisateur -->
      <div class="profile-section" ref="profileRef">
        <button
          @click="toggleProfileDropdown"
          class="profile-button"
        >
          <div class="profile-info">
            <p class="profile-name">{{ user?.name || 'Utilisateur' }}</p>
            <p class="profile-role">{{ user?.roles?.[0] || 'Rôle' }}</p>
          </div>
          <div class="profile-avatar">
            {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
        </button>

        <!-- Menu déroulant Profil -->
        <div
          v-if="showProfileDropdown"
          class="profile-dropdown"
        >
          <div class="dropdown-header">
            <p class="dropdown-title">Mon Compte</p>
          </div>
          <div class="dropdown-items">
            <a href="#" @click.prevent="openProfileModal" class="dropdown-item">
              <i class="fas fa-user-edit"></i> Modifier le profil
            </a>
            <a href="#" @click.prevent="changePassword" class="dropdown-item">
              <i class="fas fa-lock"></i> Mot de passe
            </a>
          </div>
          <div class="dropdown-footer">
            <a href="#" @click.prevent="logout" class="dropdown-logout">
              <i class="fas fa-sign-out-alt"></i> Déconnexion
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- BARRE LATÉRALE (SIDEBAR) -->
    <aside class="sidebar">
      <!-- Menu Principal (Haut) -->
      <div class="sidebar-content">
        <ul class="menu-list">
          <li>
            <router-link to="/" class="menu-item active">
              <i class="fas fa-chart-bar"></i> Tableau de Bord
            </router-link>
          </li>
          <li>
            <router-link to="/rooms" class="menu-item">
              <i class="fas fa-bed"></i> Chambres
            </router-link>
          </li>
          <li>
            <router-link to="/conference-rooms" class="menu-item">
              <i class="fas fa-building"></i> Salles de conf
            </router-link>
          </li>
          <li>
            <router-link to="/reservations" class="menu-item">
              <i class="fas fa-calendar-check"></i> Réservations
            </router-link>
          </li>
          <li>
            <router-link to="/clients" class="menu-item">
              <i class="fas fa-users"></i> Clients
            </router-link>
          </li>
          <!-- Section Nouveaux Prospects -->
          <li>
            <router-link to="/leads" class="menu-item menu-item-prospect">
              <i class="fas fa-user-plus"></i> Prospects
              <span class="prospect-badge"></span>
            </router-link>
          </li>
          <li>
            <router-link to="/payments" class="menu-item">
              <i class="fas fa-credit-card"></i> Paiements
            </router-link>
          </li>
          <li>
            <router-link to="/services" class="menu-item">
              <i class="fas fa-concierge-bell"></i> Services
            </router-link>
          </li>
          <li>
            <router-link to="/audits" class="menu-item">
              <i class="fas fa-clipboard-list"></i> Audits
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Section Basse (Réglages et Aide - Discret) -->
      <div class="sidebar-footer">
        <ul class="footer-menu">
          <li>
            <a href="#" class="footer-item">
              <i class="fas fa-cog"></i> Réglages
            </a>
          </li>
          <li>
            <a href="#" class="footer-item">
              <i class="fas fa-question-circle"></i> Besoin d'aide ?
            </a>
          </li>
        </ul>
        <div class="version-info">
          <p>Version 2.4.0</p>
        </div>
      </div>
    </aside>

    <!-- CONTENU PRINCIPAL (MAIN CONTENT) -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Header du contenu -->
        <div class="content-header">
          <div class="header-text">
            <h1>Bienvenue, {{ user?.name }} !</h1>
            <p>Voici ce qui se passe dans votre système aujourd'hui.</p>
          </div>
          <div class="header-actions">
            <button class="action-button secondary">
              Exporter rapport
            </button>
            <button class="action-button primary">
              Nouvelle Réservation
            </button>
          </div>
        </div>

        <!-- Cartes de Statistiques -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon revenue">
                <i class="fas fa-coins"></i>
              </div>
              <span class="stat-change positive">+4.2%</span>
            </div>
            <p class="stat-label">Chiffre d'Affaire</p>
            <p class="stat-value">12,450 €</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon occupancy">
                <i class="fas fa-bed"></i>
              </div>
              <span class="stat-change">82/100</span>
            </div>
            <p class="stat-label">Taux d'Occupation</p>
            <p class="stat-value">82%</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon leads">
                <i class="fas fa-user-plus"></i>
              </div>
              <span class="stat-change new">12 Nouveaux</span>
            </div>
            <p class="stat-label">Nouveaux Prospects</p>
            <p class="stat-value">45</p>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon rating">
                <i class="fas fa-star"></i>
              </div>
              <span class="stat-change">4.8/5</span>
            </div>
            <p class="stat-label">Note Moyenne</p>
            <p class="stat-value">Très Bien</p>
          </div>
        </div>

        <!-- Section Prospects & Activités (Placeholder) -->
        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <h3>Derniers Prospects</h3>
              <button class="view-all">Voir tout</button>
            </div>
            <div class="prospect-list">
              <div class="prospect-item">
                <div class="prospect-info">
                  <div class="prospect-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="prospect-details">
                    <p class="prospect-name">Marc Levain</p>
                    <p class="prospect-request">Demande : Suite Royale</p>
                  </div>
                </div>
                <span class="prospect-status waiting">En attente</span>
              </div>
              <div class="prospect-item">
                <div class="prospect-info">
                  <div class="prospect-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="prospect-details">
                    <p class="prospect-name">Sophie Dupont</p>
                    <p class="prospect-request">Demande : Séminaire Pro</p>
                  </div>
                </div>
                <span class="prospect-status contacted">Contacté</span>
              </div>
            </div>
          </div>

          <div class="card chart-placeholder">
            <div class="chart-content">
              <div class="chart-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <p>Graphique des réservations (Chart.js)</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de modification de profil -->
    <ProfileModal
      v-if="showProfileModal"
      :user="user"
      @close="closeProfileModal"
      @profile-updated="handleProfileUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService.js';
import { onClickOutside } from '@vueuse/core';
import ProfileModal from './ProfileModal.vue';

const router = useRouter();
const showProfileDropdown = ref(false);
const showProfileModal = ref(false);
const user = ref(null);
const profileRef = ref(null);

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

// Ouvrir le modal de modification de profil
const openProfileModal = () => {
  showProfileDropdown.value = false;
  showProfileModal.value = true;
};

// Fermer le modal de modification de profil
const closeProfileModal = () => {
  showProfileModal.value = false;
};

// Gérer la mise à jour du profil
const handleProfileUpdated = (updatedUser) => {
  user.value = updatedUser;
  // Mettre à jour les informations dans le localStorage
  localStorage.setItem('user_info', JSON.stringify(updatedUser));
};

// Change password
const changePassword = () => {
  alert('Fonctionnalité de changement de mot de passe à implémenter');
  showProfileDropdown.value = false;
};

// Logout function
const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if the API call fails, remove the token and redirect
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  }
};

// Load user info
const loadUser = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user_info'));
    if (userData) {
      user.value = userData;
    } else {
      // If no user info in localStorage, fetch from API
      const userInfo = await authService.getCurrentUser();
      user.value = userInfo;
      localStorage.setItem('user_info', JSON.stringify(userInfo));
    }
  } catch (error) {
    console.error('Error loading user info:', error);
    // If there's an error getting user info, redirect to login
    router.push('/login');
  }
};

// Close dropdown when clicking outside
onClickOutside(
  profileRef,
  () => {
    showProfileDropdown.value = false;
  }
);

// Load user info on component mount
onMounted(() => {
  loadUser();
});
</script>

<style scoped>
/* Dashboard container */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Navbar styles */
.navbar {
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  height: 40px;
  width: auto;
  max-width: 150px;
}

.profile-section {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 32px;
  background: #f3f4f6;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}

.profile-button:hover {
  background: #e5e7eb;
}

.profile-info {
  text-align: right;
  margin-right: 8px;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 2px 0;
}

.profile-role {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #374151;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 224px;
  z-index: 1000;
  margin-top: 8px;
  overflow: hidden;
}

.dropdown-header {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
}

.dropdown-title {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 1px;
}

.dropdown-items {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 11px 16px;
  text-decoration: none;
  color: #374151;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f0f9ff;
  color: #1d4ed8;
}

.dropdown-footer {
  padding: 8px 0;
  border-top: 1px solid #f3f4f6;
  background: #fef2f2;
}

.dropdown-logout {
  display: flex;
  align-items: center;
  padding: 11px 16px;
  text-decoration: none;
  color: #dc2626;
  transition: background 0.2s;
  font-weight: 500;
}

.dropdown-logout:hover {
  background: #fef2f2;
}

/* Sidebar styles */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 256px;
  height: 100vh;
  padding-top: 80px;
  transition: transform 0.3s;
  background: #111827;
  border-right: 1px solid #1f2937;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.sidebar-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #9ca3af;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
  position: relative;
}

.menu-item:hover {
  background: #1f2937;
  color: white;
}

.menu-item.active {
  background: #3b82f6;
  color: white;
}

.menu-item-prospect {
  color: #fbbf24;
}

.menu-item-prospect:hover {
  color: #f59e0b;
}

.prospect-badge {
  position: absolute;
  right: 12px;
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
}

.sidebar-footer {
  padding: 24px 16px;
  border-top: 1px solid #1f2937;
  background: #111827;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.footer-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.footer-item:hover {
  background: #1f2937;
  color: #3b82f6;
}

.version-info {
  margin-top: 16px;
  padding: 0 12px;
}

.version-info p {
  font-size: 10px;
  text-transform: uppercase;
  color: #4b5563;
  letter-spacing: 1px;
  font-weight: bold;
  margin: 0;
}

/* Main content styles */
.main-content {
  padding: 16px;
  margin-left: 256px;
  min-height: 100vh;
}

.content-wrapper {
  padding: 64px 16px 0;
}

.content-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
}

@media (min-width: 768px) {
  .content-header {
    flex-direction: row;
    align-items: center;
  }
}

.header-text h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-text p {
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.secondary {
  background: white;
  color: #374151;
}

.action-button.secondary:hover {
  background: #f3f4f6;
}

.action-button.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-button.primary:hover {
  background: #2563eb;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 24px;
  padding: 10px;
  border-radius: 12px;
  background: #f0fdf4;
  color: #16a34a;
}

.stat-icon.revenue {
  background: #f0fdf4;
  color: #16a34a;
}

.stat-icon.occupancy {
  background: #eff6ff;
  color: #2563eb;
}

.stat-icon.leads {
  background: #fffbeb;
  color: #d97706;
}

.stat-icon.rating {
  background: #fdf2f8;
  color: #c026d3;
}

.stat-change {
  font-size: 12px;
  font-weight: bold;
  color: #6b7280;
}

.stat-change.positive {
  color: #16a34a;
  background: #dcfce7;
  padding: 4px 8px;
  border-radius: 8px;
}

.stat-change.new {
  color: #d97706;
  background: #fef3c7;
  padding: 4px 8px;
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 1px;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

/* Content grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.view-all {
  color: #3b82f6;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.prospect-list {
  padding: 0;
}

.prospect-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.prospect-item:last-child {
  border-bottom: none;
}

.prospect-item:hover {
  background: #f9fafb;
}

.prospect-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prospect-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.prospect-details {
  display: flex;
  flex-direction: column;
}

.prospect-name {
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 2px 0;
}

.prospect-request {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.prospect-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

.prospect-status.waiting {
  background: #fef3c7;
  color: #d97706;
}

.prospect-status.contacted {
  background: #dbeafe;
  color: #2563eb;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 64px 24px;
}

.chart-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.chart-icon {
  font-size: 48px;
  opacity: 0.2;
}
</style>