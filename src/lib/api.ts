const API_URL = 'http://localhost:5000/api';

async function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    },

    register: async (userData: any) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    },

    logout: () => {
      localStorage.removeItem('token');
    },

    getProfile: async () => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/auth/me`, { headers });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  },

  tours: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/tours?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tours');
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/tours/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour');
      return response.json();
    },

    uploadVRContent: async (id: string, formData: FormData) => {
      const headers = await getAuthHeader();
      delete headers['Content-Type']; // Let browser set correct content type for FormData
      
      const response = await fetch(`${API_URL}/tours/${id}/vr-content`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload VR content');
      return response.json();
    },

    getVRContent: async (id: string) => {
      const response = await fetch(`${API_URL}/tours/${id}/vr-content`);
      if (!response.ok) throw new Error('Failed to fetch VR content');
      return response.json();
    },
  },

  bookings: {
    create: async (bookingData: any) => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    },

    getAll: async () => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/bookings`, { headers });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },

    cancel: async (id: string) => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'POST',
        headers,
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return response.json();
    },
  },
};