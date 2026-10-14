import { afterEach, describe, expect, it, vi } from 'vitest';
import Axios from 'axios';

vi.mock('axios');

async function loadUploader(env) {
    vi.resetModules();
    for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
    return (await import('./cloudinaryUpload')).default;
}

afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
});

describe('uploadMultipleFile', () => {
    it('rejects when Cloudinary is not configured', async () => {
        const upload = await loadUploader({
            VITE_CLOUDINARY_CLOUD_NAME: '',
            VITE_CLOUDINARY_UPLOAD_PRESET: '',
        });
        await expect(upload([new File(['x'], 'a.png')])).rejects.toThrow(/not configured/);
        expect(Axios.post).not.toHaveBeenCalled();
    });

    it('uploads every file with the unsigned preset and returns the secure URLs', async () => {
        const upload = await loadUploader({
            VITE_CLOUDINARY_CLOUD_NAME: 'demo',
            VITE_CLOUDINARY_UPLOAD_PRESET: 'preset1',
        });
        Axios.post.mockImplementation(async (url, form) => ({
            data: { secure_url: `https://cdn/${form.get('file').name}` },
        }));

        const urls = await upload([new File(['x'], 'a.png'), new File(['x'], 'b.png')]);

        expect(urls).toEqual(['https://cdn/a.png', 'https://cdn/b.png']);
        const [url, form] = Axios.post.mock.calls[0];
        expect(url).toBe('https://api.cloudinary.com/v1_1/demo/image/upload');
        expect(form.get('upload_preset')).toBe('preset1');
        expect(form.get('api_key')).toBeNull();
    });

    it('rejects when any upload fails instead of returning a partial list', async () => {
        const upload = await loadUploader({
            VITE_CLOUDINARY_CLOUD_NAME: 'demo',
            VITE_CLOUDINARY_UPLOAD_PRESET: 'preset1',
        });
        Axios.post
            .mockResolvedValueOnce({ data: { secure_url: 'https://cdn/a.png' } })
            .mockRejectedValueOnce(new Error('network'));

        await expect(
            upload([new File(['x'], 'a.png'), new File(['x'], 'b.png')])
        ).rejects.toThrow('network');
    });
});
