import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Remplacez l'URL par celle de votre API

export default {
  getGuides() {
    return axios.get(`${API_URL}/guides`);
  },

  getGuide(id, config) {
    return axios.get(`${API_URL}/guides/${id}`, config);
  },
  

  createGuide(guideData) {
    return axios.post(`${API_URL}/guides`, guideData);
  },

  updateGuide(id, guideData) {
    return axios.put(`${API_URL}/guides/${id}`, guideData);
  },

  deleteGuide(id) {
    return axios.delete(`${API_URL}/guides/${id}`);
  },

  async addRating(guideId, note, config) {
    try {
      //console.log('Guide ID:', guideId);
      //console.log('Note:', note);
      //console.log('Configuration:', config);
      const response = await axios.post(`${API_URL}/guides/${guideId}/ratings`, { note }, config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  getMyGuides(config) {
    return axios.get(`${API_URL}/guides?userId=${config.userId}`);
  },

  async reportGuide(guideId, reason, config) {
    const response = await axios.post(`${API_URL}/guides/report/`, { guideId, reason }, config);
    return response.data;
  }
  
  
  
  
  
  
};
