import { describe, expect, it } from 'vitest';
import { getDistanceTime, getTime } from './time';

describe('getDistanceTime', () => {
    const now = new Date('2026-10-14T12:00:00Z').getTime();

    it.each([
        ['2026-10-14T11:59:30Z', '30 giây trước'],
        ['2026-10-14T11:15:00Z', '45 phút trước'],
        ['2026-10-14T09:00:00Z', '3 giờ trước'],
        ['2026-10-11T12:00:00Z', '3 ngày trước'],
    ])('describes %s as %s', (time, expected) => {
        expect(getDistanceTime(time, now)).toBe(expected);
    });

    it('does not go negative when the server clock is ahead', () => {
        expect(getDistanceTime('2026-10-14T12:00:05Z', now)).toBe('0 giây trước');
    });
});

describe('getTime', () => {
    it('formats as DD-MM-YYYY with zero padding', () => {
        expect(getTime(new Date(2026, 0, 5, 10))).toBe('05-01-2026');
        expect(getTime(new Date(2026, 11, 25, 10))).toBe('25-12-2026');
    });
});
