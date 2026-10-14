import Axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Uploads each file with an unsigned preset and resolves to the secure URLs.
// Rejects if Cloudinary is not configured or any upload fails, so callers never
// submit a post with a partial (or empty) picture list.
async function uploadMultipleFile(files) {
    if (!cloudName || !uploadPreset) {
        throw new Error(
            'Cloudinary is not configured: set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
        );
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    return Promise.all(
        files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const response = await Axios.post(uploadUrl, formData);
            return response.data.secure_url;
        })
    );
}

export default uploadMultipleFile;
