const API = 'http://localhost:5000/api';

const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = 'http://localhost:3000/login.html';
};