import React from 'react';
import './style.css';
// Import React FilePond
import { registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import uploadMultipleFile from '../../utils/cloudinaryUpload';
import { useNavigate, useParams } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import EditPostForm from './Form';
import { notifyError } from '../../helper/notify';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [files, setFiles] = React.useState([]);
    const handleChangeFile = (fileArr) => {
        setFiles(fileArr);
    };
    const [defaultValue, setDefaultValue] = React.useState(null);
    const handleSubmit = async (values) => {
        const newFiles = files.map((file) => {
            if (typeof file === 'string') {
                return file;
            } else {
                return file.file;
            }
        });

        try {
            const fileUploaded = await uploadMultipleFile(newFiles);

            const newAccommodationPictures = fileUploaded.map((e) => ({
                PictureLink: e,
            }));
            let params = {
                ...values,
                accommodationPictures: newAccommodationPictures,
            };
            await rentalPost.putEditRentalPost(id, params);
            navigate('/my-post');
        } catch (error) {
            notifyError(error);
        }
    };

    React.useEffect(() => {
        async function getDefaultValue() {
            try {
                const response = await rentalPost.getRentalPostInfo(id);
                setDefaultValue(response);
                setFiles(
                    [...response.accommodationPictures].map(
                        (e) => e.pictureLink
                    )
                );
            } catch (error) {
                notifyError(error);
            }
        }
        getDefaultValue();
    }, [id]);
    return (
        <div className="editPostPage">
            <EditPostForm
                handleSubmit={handleSubmit}
                files={files}
                handleChangeFile={handleChangeFile}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default EditPostPage;
