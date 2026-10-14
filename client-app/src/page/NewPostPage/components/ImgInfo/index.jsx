import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

function ImgInfo({ name }) {
    const {
        register,
        setValue,
        formState: { errors, isSubmitted },
    } = useFormContext();
    // The picked files live in the form under `name` but are not tied to a single input.
    React.useEffect(() => {
        register(name);
    }, [register, name]);
    // Each item keeps its preview URL next to the file so both always change together.
    const [items, setItems] = React.useState([]);

    const update = (next) => {
        setItems(next);
        setValue(
            name,
            next.map((item) => item.file),
            { shouldValidate: isSubmitted }
        );
    };

    const handleImageChange = (event) => {
        const picked = Array.from(event.target.files)
            .filter((file) => ACCEPTED_TYPES.includes(file.type))
            .map((file) => ({ file, url: URL.createObjectURL(file) }));
        update([...items, ...picked]);
        event.target.value = '';
    };

    const handleRemove = (index) => {
        URL.revokeObjectURL(items[index].url);
        update(items.filter((_, i) => i !== index));
    };

    return (
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Hình Ảnh</h5>
            <div className={cardBodyClass}>
                <p>Chọn tối thiểu 3 ảnh, mỗi ảnh không quá 6MB</p>
                <input
                    type="file"
                    name={name}
                    accept={ACCEPTED_TYPES.join(',')}
                    multiple
                    onChange={handleImageChange}
                />
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginTop: '10px',
                    }}
                >
                    {items.map((item, index) => (
                        <div key={item.url} style={{ position: 'relative' }}>
                            <img
                                src={item.url}
                                alt={item.file.name}
                                style={{ height: '120px', borderRadius: '4px' }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                style={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <FieldError error={errors[name]} />
            </div>
        </div>
    );
}

export default ImgInfo;
