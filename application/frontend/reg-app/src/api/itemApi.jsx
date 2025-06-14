// src/api/itemApi.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllItems = async (token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
  });
  if (!response.ok) throw new Error('Failed to fetch items');
  return await response.json();
};

export const createNewItem = async (itemData, token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) throw new Error('Failed to create item');
  return await response.json();
};

export const getItemById = async (itemId, token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/${itemId}`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
  });
  if (!response.ok) throw new Error('Failed to fetch item details');
  return await response.json();
};

export const getItemsByCategory = async (category, token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/by_category/${category}`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
  });
  if (!response.ok) throw new Error('Failed to fetch items by category');
  return await response.json();
};

export const updateItem = async (itemId, updatedData, token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Failed to update item');
  return await response.json();
};

export const deleteItem = async (itemId, token) => {
  const response = await fetch(`${API_BASE_URL}/items/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete item');
  // For DELETE, the response might be empty, so we return the status
  return response.status;
};