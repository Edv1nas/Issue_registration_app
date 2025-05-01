const API_BASE_URL = 'http://192.168.1.140:8000/api/v1'

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch(`${API_BASE_URL}/images/upload-image/`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image upload failed: ${errorText}`);
    }
  
    return await response.json();
  };