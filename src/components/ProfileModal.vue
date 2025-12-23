<template>
  <div class="profile-modal-overlay" @click="closeModal">
    <div class="profile-modal" @click.stop>
      <div class="modal-header">
        <h2>Modifier le profil</h2>
        <button class="close-button" @click="closeModal">✕</button>
      </div>
      
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="name">Nom complet</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            :class="{ 'error': errors.name }"
            required
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            :class="{ 'error': errors.email }"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="current_password">Mot de passe actuel</label>
          <input
            type="password"
            id="current_password"
            v-model="formData.current_password"
            :class="{ 'error': errors.current_password }"
            placeholder="Entrez votre mot de passe actuel"
          />
          <span v-if="errors.current_password" class="error-message">{{ errors.current_password }}</span>
        </div>

        <div class="form-group">
          <label for="new_password">Nouveau mot de passe</label>
          <input
            type="password"
            id="new_password"
            v-model="formData.new_password"
            :class="{ 'error': errors.new_password }"
            placeholder="Entrez votre nouveau mot de passe"
          />
          <span v-if="errors.new_password" class="error-message">{{ errors.new_password }}</span>
        </div>

        <div class="form-group">
          <label for="new_password_confirmation">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="new_password_confirmation"
            v-model="formData.new_password_confirmation"
            :class="{ 'error': errors.new_password_confirmation }"
            placeholder="Confirmez votre nouveau mot de passe"
          />
        </div>
        
        <div class="form-group">
          <label for="profile_image">Photo de profil</label>
          <input 
            type="file" 
            id="profile_image" 
            @change="handleFileUpload"
            accept="image/*"
          />
          <span v-if="errors.profile_image" class="error-message">{{ errors.profile_image }}</span>
        </div>
        
        <div v-if="formData.profile_image_preview" class="image-preview">
          <img :src="formData.profile_image_preview" alt="Aperçu de la photo de profil" />
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeModal" class="cancel-button">Annuler</button>
          <button type="submit" :disabled="loading" class="save-button">
            <span v-if="!loading">Enregistrer</span>
            <span v-else>Enregistrement...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authService } from '@/services/authService.js';

const emit = defineEmits(['close', 'profile-updated']);
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const formData = ref({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
  profile_image: null,
  profile_image_preview: null
});

const errors = ref({});
const loading = ref(false);

onMounted(() => {
  // Initialiser les champs avec les données de l'utilisateur
  formData.value.name = props.user.name;
  formData.value.email = props.user.email;
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Vérifier que le fichier est une image
    if (!file.type.startsWith('image/')) {
      errors.value.profile_image = 'Veuillez sélectionner une image valide';
      return;
    }
    
    // Prévisualiser l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.profile_image_preview = e.target.result;
    };
    reader.readAsDataURL(file);
    
    formData.value.profile_image = file;
    delete errors.value.profile_image; // Supprimer l'erreur précédente
  }
};

const updateProfile = async () => {
  errors.value = {};
  loading.value = true;

  try {
    const data = new FormData();
    data.append('name', formData.value.name);
    data.append('email', formData.value.email);

    // Ajouter les champs de mot de passe seulement s'ils sont remplis
    if (formData.value.current_password) {
      data.append('current_password', formData.value.current_password);
    }

    if (formData.value.new_password) {
      data.append('password', formData.value.new_password);
      data.append('password_confirmation', formData.value.new_password_confirmation);
    }

    if (formData.value.profile_image) {
      data.append('profile_image', formData.value.profile_image);
    }

    const response = await authService.updateProfile(data);

    // Mettre à jour les informations dans le localStorage
    localStorage.setItem('user_info', JSON.stringify(response.user));

    // Émettre un événement pour informer le composant parent
    emit('profile-updated', response.user);

    // Fermer le modal
    emit('close');

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);

    if (error.response && error.response.data) {
      if (error.response.data.errors) {
        errors.value = error.response.data.errors;
      } else if (error.response.data.message) {
        errors.value.general = error.response.data.message;
      }
    } else {
      errors.value.general = 'Une erreur est survenue lors de la mise à jour du profil';
    }
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.profile-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.profile-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background: #f3f4f6;
}

.profile-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button, .save-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  transition: all 0.2s;
}

.cancel-button {
  background: white;
  color: #374151;
}

.cancel-button:hover {
  background: #f3f4f6;
}

.save-button {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.save-button:hover:not(:disabled) {
  background: #2563eb;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message.general {
  color: #ef4444;
  text-align: center;
  padding: 10px;
  background: #fef2f2;
  border-radius: 6px;
  margin-top: 10px;
}
</style>