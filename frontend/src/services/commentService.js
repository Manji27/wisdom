import axios from 'axios';

const baseURL = 'http://localhost:3000/comments';

const getCommentsByGuide = async (guideId, config) => {
  const response = await axios.get(`${baseURL}/guide/${guideId}`, config);
  return response.data;
};

const createComment = async (comment, config) => {
  const response = await axios.post(baseURL, comment, config);
  return response.data;
};

const getCommentsByUser = async (userId, config) => {
  const response = await axios.get(`${baseURL}/user/${userId}`, config);
  return response.data;
};


const deleteComment = async (commentId, config) => {
  const response = await axios.delete(`${baseURL}/${commentId}`, config);
  return response.data;
};

export default {
  getCommentsByGuide,
  createComment,
  getCommentsByUser,
  deleteComment  // Ajoutez cette ligne
};