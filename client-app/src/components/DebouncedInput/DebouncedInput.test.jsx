import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DebouncedInput from './index';

afterEach(() => vi.useRealTimers());

describe('DebouncedInput', () => {
    it('reports one change with the final text after the user pauses', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onChange = vi.fn((event) => event.target.value);
        render(<DebouncedInput name="title" value="" onChange={onChange} debounceTimeout={100} />);

        await user.type(screen.getByRole('textbox'), 'abc');
        expect(onChange).not.toHaveBeenCalled();

        act(() => vi.advanceTimersByTime(150));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.results[0].value).toBe('abc');
        expect(onChange.mock.calls[0][0].target.name).toBe('title');
    });

    it('takes a new value prop when nothing is pending', () => {
        const { rerender } = render(<DebouncedInput value="one" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveValue('one');
        rerender(<DebouncedInput value="two" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveValue('two');
    });

    it('keeps what the user typed while a change is still pending', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const { rerender } = render(<DebouncedInput value="a" onChange={() => {}} debounceTimeout={100} />);
        await user.type(screen.getByRole('textbox'), 'bc');
        rerender(<DebouncedInput value="a" onChange={() => {}} debounceTimeout={100} />);
        rerender(<DebouncedInput value="ab" onChange={() => {}} debounceTimeout={100} />);
        expect(screen.getByRole('textbox')).toHaveValue('abc');
    });

    it('starts from defaultValue and keeps the typed text when it has no value prop', async () => {
        const user = userEvent.setup();
        render(<DebouncedInput defaultValue={0} onChange={() => {}} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('0');
        await user.clear(input);
        await user.type(input, '42');
        expect(input).toHaveValue('42');
    });
});
