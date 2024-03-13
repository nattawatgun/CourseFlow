import { useContext, useEffect, useState } from 'react';
import { Stack, Text, Loader } from '@mantine/core';
import classes from '../../style/ProfilePhotoUploader.module.css';
import { MdAddAPhoto } from 'react-icons/md';
import useAxiosWithAuth0 from '../../utils/interceptor';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ProfileContext } from '../../context/ProfileContext';

export default function ProfilePhotoUploader() {
  // State to manage the uploading process
  const [isUploading, setIsUploading] = useState(false);
  const { axiosInstance } = useAxiosWithAuth0();
  const { isAuthenticted, user } = useAuth0();
  const [file, setFile] = useState(null);
  const { profile, updateProfile } = useContext(ProfileContext);

  // Handle file selection.
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFile(file);
  };

  const handleFleUpload = async () => {
    setIsUploading(true); // Start the upload process
    try {
      // TODO: Get Cloudinary's signature from Courseflow backend.
      const { data: signData } = await axiosInstance.get('/user/authorize-upload');
      console.log(signData);
      const url = 'https://api.cloudinary.com/v1_1/' + signData.cloudname + '/auto/upload';
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('api_key', signData.apiKey);
      uploadForm.append('timestamp', signData.timestamp);
      uploadForm.append('signature', signData.signature);
      uploadForm.append('folder', `avatar/${user.sub.slice(6)}`); // use userId as folder name
      // TODO: Upload file to Cloudinary
      // TODO: Send resource identifier back to Courseflow
      // TODO: Set avatarUrl with the returned URL.
      // Replace 'your-upload-endpoint' with your actual upload URL
      const uploadResult = await axios.post(url, uploadForm);
      // Handle successful upload here
      console.log(uploadResult);
      const captureResult = await axiosInstance.post('/user/profile/capture_url', { avatarUrl: uploadResult.data.secure_url });
      updateProfile({ ...profile, avatarUrl: uploadResult.data.secure_url });
    } catch (error) {
      console.error('File upload error:', error);
      alert('File upload failed');
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  useEffect(() => {
    console.log('hello from useEffect');
    if (user && file) {
      console.log(file);
      handleFleUpload();
    }
  }, [user, file]);

  return (
    <div className={classes.imageUploader}>
      {isUploading ? (
        <Loader /> // Show loader when file is uploading
      ) : (
        <Stack align='center'>
          <MdAddAPhoto className={classes.photoUploadIcon}/>
          <Text>Add a photo</Text>
        </Stack>
      )}
      <input
        type="file"
        className={classes.invisibleInput}
        onChange={handleFileChange} // Trigger file upload on file selection
        disabled={isUploading}
        accept=".png, .svg, .jpg, .jpeg" 
      />
    </div>
  );
}
