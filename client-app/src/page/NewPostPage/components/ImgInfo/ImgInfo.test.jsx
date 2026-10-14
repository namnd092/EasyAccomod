import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImgInfo from './index';

function png(name) {
    return new File(['x'], name, { type: 'image/png' });
}

function setup() {
    const setFieldValue = vi.fn();
    const utils = render(
        <ImgInfo name="roomImageArr" errors={{}} touched={{}} setFieldValue={setFieldValue} />
    );
    const input = utils.container.querySelector('input[type=file]');
    return { setFieldValue, input, ...utils };
}

describe('ImgInfo', () => {
    beforeEach(() => {
        URL.createObjectURL = vi.fn((file) => `blob:${file.name}`);
        URL.revokeObjectURL = vi.fn();
    });

    it('previews picked images and reports the files to the form', async () => {
        const { setFieldValue, input } = setup();
        const files = [png('a.png'), png('b.png'), png('c.png')];
        await userEvent.upload(input, files);

        expect(screen.getAllByRole('img')).toHaveLength(3);
        expect(setFieldValue).toHaveBeenLastCalledWith('roomImageArr', files);
    });

    it('ignores files that are not images', async () => {
        const { setFieldValue, input } = setup();
        const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
        await userEvent.upload(input, [pdf], { applyAccept: false });

        expect(screen.queryAllByRole('img')).toHaveLength(0);
        expect(setFieldValue).toHaveBeenLastCalledWith('roomImageArr', []);
    });

    it('removes one image and keeps the others in sync with the form', async () => {
        const { setFieldValue, input } = setup();
        const files = [png('a.png'), png('b.png'), png('c.png')];
        await userEvent.upload(input, files);

        await userEvent.click(screen.getAllByRole('button', { name: 'X' })[1]);

        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(setFieldValue).toHaveBeenLastCalledWith('roomImageArr', [files[0], files[2]]);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:b.png');
    });
});
