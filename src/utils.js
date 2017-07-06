// utils
import client from "axios";
import { API_ROOT_URL } from './apis';

export const axios = client.create({
  baseURL: API_ROOT_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCSRFToken
  }
});

export const getCSRFToken = () => {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el ? el.getAttribute('content') : '';
};

export const capitalize = (string) => {
  return (string.substring(0, 1).toUpperCase() + string.substring(1));
};

export const createAuthorizedRequest = (method, path, params, token) => {
  const config = {
    headers: { 'Authorization': `Bearer ${token}` }
  };
  switch(method) {
    case 'get':
      return axios.get(path, config);
    case 'post':
      return axios.post(path, params, config);
    case 'patch' :
      return axios.patch(path, params, config);
    case 'delete' :
      return axios.delete(path, config);
  }
};
