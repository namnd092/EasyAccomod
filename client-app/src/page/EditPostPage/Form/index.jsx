import React from 'react';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FormProvider, useForm } from 'react-hook-form';
import PostingTutorial from '../../NewPostPage/components/PostingTutorial';
import BasicInfo from '../../NewPostPage/components/BasicInfo';
import DescriptionInfo from '../../NewPostPage/components/DescriptionInfo';
import Card from '../../../share/components/card';
import newPostInitialValue from '../../../models/InitialValueForm/newPost';
import postToFormValues from '../../../models/InitialValueForm/editPost';
import { Button } from '../../../ui';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
export default function EditPostForm(props) {
    const { handleSubmit, files, handleChangeFile, defaultValue } = props;
    // Filled in once the post has loaded; there is no validation schema on the edit form.
    const values = React.useMemo(
        () => (defaultValue ? postToFormValues(defaultValue) : undefined),
        [defaultValue]
    );
    const methods = useForm({ defaultValues: newPostInitialValue, values });
    return (
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12 lg:col-span-4">
                <PostingTutorial />
            </div>
            <div className="col-span-12 lg:col-span-8">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSubmit)}>
                        <BasicInfo />
                        <DescriptionInfo />
                        <Card title="Hình ảnh">
                            <FilePond
                                files={files}
                                allowReorder={true}
                                allowMultiple={true}
                                onupdatefiles={handleChangeFile}
                                labelIdle={'Thêm ảnh'}
                            />
                        </Card>
                        <div className="flex justify-center">
                            <Button type="submit" size="lg" className="m-5">
                                Xác nhận
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
