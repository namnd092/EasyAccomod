import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImgInfo from './index';

function png(name) {
    return new File(['x'], name, { type: 'image/png' });
}

// Shows which files the form currently holds, so tests can check the form state.
function FormFiles() {
    const files = useWatch({ name: 'roomImageArr' });
    return <output data-testid="form-files">{(files || []).map((file) => file.name).join(',')}</output>;
}

function Harness() {
    const methods = useForm({ defaultValues: { roomImageArr: [] } });
    return (
        <FormProvider {...methods}>
            <ImgInfo name="roomImageArr" />
            <FormFiles />
        </FormProvider>
    );
}

function setup() {
    const utils = render(<Harness />);
    const input = utils.container.querySelector('input[type=file]');
    return { input, formFiles: () => screen.getByTestId('form-files').textContent, ...utils };
}

describe('ImgInfo', () => {
    beforeEach(() => {
        URL.createObjectURL = vi.fn((file) => `blob:${file.name}`);
        URL.revokeObjectURL = vi.fn();
    });

    it('previews picked images and reports the files to the form', async () => {
        const { input, formFiles } = setup();
        await userEvent.upload(input, [png('a.png'), png('b.png'), png('c.png')]);

        expect(screen.getAllByRole('img')).toHaveLength(3);
        expect(formFiles()).toBe('a.png,b.png,c.png');
    });

    it('ignores files that are not images', async () => {
        const { input, formFiles } = setup();
        const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
        await userEvent.upload(input, [pdf], { applyAccept: false });

        expect(screen.queryAllByRole('img')).toHaveLength(0);
        expect(formFiles()).toBe('');
    });

    it('removes one image and keeps the others in sync with the form', async () => {
        const { input, formFiles } = setup();
        await userEvent.upload(input, [png('a.png'), png('b.png'), png('c.png')]);

        await userEvent.click(screen.getAllByRole('button', { name: 'X' })[1]);

        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(formFiles()).toBe('a.png,c.png');
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:b.png');
    });
});
