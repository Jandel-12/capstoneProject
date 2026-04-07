//js/dashboard.js
const API = 'https://el-royale-api.onrender.com/api';;

// Grab token from URL if present (first time coming from login)
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get('token');
const urlUser = urlParams.get('user');

if (urlToken) {
  localStorage.setItem('adminToken', urlToken);
}
if (urlUser) {
  localStorage.setItem('adminUser', decodeURIComponent(urlUser));
}

const getToken = () => localStorage.getItem('adminToken');

const requireAuth = () => {
  const token = getToken();
  if (!token) window.location.href = 'http://localhost:3000/login.html';
};

const authFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers
    }
  });
};

const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = 'http://localhost:3000/login.html';
};