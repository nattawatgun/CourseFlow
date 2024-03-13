import axios from 'axios';

export default async function handleFleUpload(materialsId, materialType, file, axiosInstance) {
  try {
    // TODO: Get Cloudinary's signature from Courseflow backend.
    const { data: signData } = await axiosInstance.post('/admin/authorize-upload', { materialsId, materialType });
    const url = 'https://api.cloudinary.com/v1_1/' + signData.cloudname + '/auto/upload';
    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('api_key', signData.apiKey);
    uploadForm.append('timestamp', signData.timestamp);
    uploadForm.append('signature', signData.signature);
    uploadForm.append('tags', `temporary ${materialType}`);
    uploadForm.append('folder', `${materialsId}/`);

    const uploadResult = await axios.post(url, uploadForm);
    return uploadResult;

  } catch (error) {
    console.error('File upload error:', error);
    alert('File upload failed');
  }
}