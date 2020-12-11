import Axios from 'axios';

async function uploadMultipleFile(files) {
    const resultImages = [];
    const uploader = files.map((file) => {
        // Initial FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', `codeinfuse, medium, gist`);
        formData.append('upload_preset', 'sc14evw3'); // Replace the preset name with your own
        formData.append('api_key', '511129783159453'); // Replace API key with your own Cloudinary key
        formData.append('timestamp', (Date.now() / 1000) | 0);

        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        return Axios.post(
            'https://api.cloudinary.com/v1_1/dsysolkex/image/upload',
            formData,
            {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            }
        )
            .then((response) => {
                const data = response.data;
                const fileURL = data.secure_url; // You should store this URL for future references in your app
                resultImages.push(fileURL);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    // Once all the files are uploaded
    await Axios.all(uploader).then((result) => {
        // ... perform after upload is successful operation
    });
    return resultImages;
}

export default uploadMultipleFile;
