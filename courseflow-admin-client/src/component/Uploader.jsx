import { Stack, Text, Loader } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import classes from '../style/Uploader.module.css';
import { useState } from 'react';
import handleFleUpload from '../utils/handleFileUpload';
import useAxiosWithAuth0 from '../interceptor';

function Uploader({label, materialType, materialsId, maxSize, allowedTypes, onError, onUpload}) {
  const [isUploading, toggleIsUploading] = useToggle();
  const { axiosInstance } = useAxiosWithAuth0();
  // Handle file selection.
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > maxSize) {
      console.log('File size exceeds', maxSize, 'MB');
      onError('Image size exceeds 5MB"');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type');
      onError('Invalid file type');
      return;
    }

    // begin the uploading
    try {
      toggleIsUploading();
      const result = await handleFleUpload(materialsId, materialType, file, axiosInstance);
      // add the result to the form
      onUpload({url: result.data.secure_url, publicId: result.data.public_id});
      return;
    }
    catch (error) {
      onError('Error uploading the file');
      return;
    }
    finally {
      toggleIsUploading();
    }
  };
  return (
    <div className={classes.imageUploader} id={materialType}>
      {isUploading ? (
        <Loader /> // Show loader when file is uploading
      ) : (
        <Stack align='center'>
          <Text size='36px' fw={300}>+</Text>
          <Text>{label}</Text>
        </Stack>
      )}
      <input
        type="file"
        className={classes.invisibleInput}
        onChange={handleFileChange} // Trigger file upload on file selection
        disabled={isUploading}
        accept={allowedTypes.join(', ')}
      />
    </div>
  );
}
export default Uploader;