import { test, expect } from '@playwright/test';
import { API, accounts, apiLogin, createPost, loginViaUi } from './helpers';

test.describe('visitor', () => {
    test('sees an approved post on the home page and can open it', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await page.goto('/');
        await page.getByText(post.title).first().click();
        await expect(page).toHaveURL(new RegExp(`/post/${post.id}$`));
        await expect(page.getByText(post.title).first()).toBeVisible();
        await expect(page.getByText(/Thành phố Hà Nội/).first()).toBeVisible();
    });

    test('is sent to the login page from a protected route', async ({ page }) => {
        await page.goto('/my-post');
        await expect(page).toHaveURL(/\/login$/);
    });

    test('sees the not-found page for an unknown route', async ({ page }) => {
        await page.goto('/this-page-does-not-exist');
        await expect(page.locator('main img')).toBeVisible();
    });

    test('is told off with a wrong password and stays on the login page', async ({ page }) => {
        await page.goto('/login');
        const inputs = page.locator('input');
        await inputs.nth(0).fill('Owner1');
        await inputs.nth(1).fill('Wrong1234.');
        await page.getByRole('button', { name: /đăng nhập/i }).first().click();
        await expect(page).toHaveURL(/\/login$/);
        expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
    });
});

test.describe('owner', () => {
    test('logs in and sees their posts with the province', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await loginViaUi(page, accounts.owner);
        await page.goto('/my-post');
        const row = page.getByRole('row', { name: new RegExp(post.title) });
        await expect(row).toBeVisible();
        await expect(row).toContainText('Thành phố Hà Nội');
    });

    test('is blocked from the admin page', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.goto('/approved');
        await expect(page.getByText('Phê duyệt bài đăng')).toHaveCount(0);
        await expect(page.locator('main img')).toBeVisible();
    });
});

test.describe('admin', () => {
    test('approves a pending post and it appears on the home page', async ({ page, request }) => {
        const post = await createPost(request);
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved');
        // The list defaults to "all"; filter to the posts waiting for approval.
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'Đang chờ duyệt' }).click();
        const row = page.getByRole('row', { name: new RegExp(post.title) });
        await expect(row).toBeVisible();
        await row.getByRole('button', { name: /Xác nhận/ }).click();
        await expect(row).toHaveCount(0);

        await page.goto('/');
        await expect(page.getByText(post.title).first()).toBeVisible();
    });
});

test.describe('renter', () => {
    test('can comment on an approved post', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await loginViaUi(page, accounts.renter);
        await page.goto(`/post/${post.id}`);
        // Wait for the post to finish loading so the form is not re-rendered under us.
        await expect(page.getByText(post.title).first()).toBeVisible();
        await page.getByPlaceholder(/Viết bình luận/).fill('Phòng rất tốt');
        await page.getByRole('button', { name: /gửi/i }).click();

        const token = await apiLogin(request, accounts.renter);
        await expect
            .poll(async () => {
                const response = await request.get(`${API}/api/Renter/RentalPost/IsCommented?postId=${post.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return (await response.json()).result;
            })
            .toBe(true);
    });
});
