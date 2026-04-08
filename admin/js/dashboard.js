const API = 'https://el-royale-api.onrender.com/api';

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
  if (!token) window.location.href = 'https://capstone-project-psi-seven.vercel.app/login.html';
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
  window.location.href = 'https://capstone-project-psi-seven.vercel.app/login.html';
};