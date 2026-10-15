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

    test('keeps the search filters in the URL across a reload and can clear them', async ({ page }) => {
        await page.goto('/?provinceId=1&haveBalcony=-1');
        await expect(page.getByText('Đang áp dụng 2 bộ lọc')).toBeVisible();
        await page.reload();
        await expect(page).toHaveURL(/provinceId=1&haveBalcony=-1/);
        await expect(page.getByText('Đang áp dụng 2 bộ lọc')).toBeVisible();
        // The filter that was applied is shown in the (already opened) detail section.
        await expect(page.getByLabel('Ban công')).toBeAttached();
        await page.getByRole('button', { name: 'Xóa bộ lọc' }).click();
        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByRole('button', { name: 'Xóa bộ lọc' })).toHaveCount(0);
    });

    test('sorts by newest, counts the results and narrows them with the price chips', async ({ page, request }) => {
        // The post costs 3 triệu a month. Newest first, it is the first one a search it matches can show.
        const post = await createPost(request, { approved: true });
        await page.goto('/?sort=newest');
        await expect(page.getByText(post.title).first()).toBeVisible();
        await expect(page.getByText(/\d+ kết quả/)).toBeVisible();
        await page.getByRole('button', { name: '3 triệu - 5 triệu' }).click();
        await expect(page).toHaveURL(/minPrice=3&maxPrice=5/);
        await expect(page.getByText(post.title).first()).toBeVisible();
        await page.getByRole('button', { name: 'Dưới 1 triệu' }).click();
        await expect(page).toHaveURL(/maxPrice=1(&|$)/);
        await expect(page.getByRole('button', { name: 'Dưới 1 triệu' })).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByText(post.title)).toHaveCount(0);
    });

    test('narrows the search by payment type', async ({ page, request }) => {
        // The post is paid monthly (payment type 1).
        const post = await createPost(request, { approved: true });
        await page.goto('/?paymentTypeId=1&sort=newest');
        await expect(page.getByText(post.title).first()).toBeVisible();
        await page.goto('/?paymentTypeId=2&sort=newest');
        await expect(page.getByText('Đang áp dụng 1 bộ lọc')).toBeVisible();
        await expect(page.getByText(post.title)).toHaveCount(0);
    });

    test('falls back to the first page when the URL asks for a page that does not exist', async ({ page }) => {
        await page.goto('/?page=9999');
        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('is sent to the login page from a protected route', async ({ page }) => {
        await page.goto('/my-post');
        await expect(page).toHaveURL(/\/login$/);
    });

    test('sees the not-found page for an unknown route', async ({ page }) => {
        await page.goto('/this-page-does-not-exist');
        await expect(page.locator('main img')).toBeVisible();
    });

    test('opening a post shows no error toast', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await page.goto(`/post/${post.id}`);
        await expect(page.getByText(post.title).first()).toBeVisible();
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('is told off with a wrong password and stays on the login page', async ({ page }) => {
        await page.goto('/login');
        const inputs = page.locator('input');
        await inputs.nth(0).fill('Owner1');
        await inputs.nth(1).fill('Wrong1234.');
        await page.getByRole('button', { name: /đăng nhập/i }).first().click();
        await expect(page).toHaveURL(/\/login$/);
        expect(await page.evaluate(() => localStorage.getItem('hasSession'))).toBeNull();
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

    test('steps back from a posts page that does not exist and shows the posts', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await loginViaUi(page, accounts.owner);
        await page.goto('/my-post?approvedPage=9999');
        await expect(page).not.toHaveURL(/approvedPage=9999/);
        // The post is on the last page the owner has, whatever page that is.
        await expect(page.getByRole('row', { name: new RegExp(post.title) })).toBeVisible();
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('stays logged in after a reload, without keeping the token in storage', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.goto('/my-post');
        // Let the restore after the navigation finish: reloading while its refresh is in flight can drop the rotated cookie.
        await expect(page.getByRole('button', { name: /Owner1|Chủ trọ|Tài khoản/ })).toBeVisible();
        await page.reload();
        // The session comes back from the HttpOnly refresh cookie.
        await expect(page).toHaveURL(/\/my-post$/);
        await expect(page.getByRole('button', { name: /Owner1|Chủ trọ|Tài khoản/ })).toBeVisible();
        const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
        expect(stored).not.toMatch(/eyJ/);
        const cookies = await page.context().cookies();
        expect(cookies.find((c) => c.httpOnly)).toBeTruthy();
    });

    test('logs out for good: the session does not come back after a reload', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.getByRole('button', { name: /Owner1|Chủ trọ|Tài khoản/ }).click();
        await page.getByRole('link', { name: /Đăng xuất/ }).click();
        await expect(page).toHaveURL(/\/login$/);
        expect(await page.evaluate(() => localStorage.getItem('hasSession'))).toBeNull();

        await page.goto('/my-post');
        await expect(page).toHaveURL(/\/login$/);
    });

    test('a remembered session whose cookie is gone sends them to the login page', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.context().clearCookies();
        await page.goto('/my-post');
        await expect(page).toHaveURL(/\/login$/);
        expect(await page.evaluate(() => localStorage.getItem('hasSession'))).toBeNull();
    });

    test('can open the edit page of a pending post from the post list', async ({ page, request }) => {
        const post = await createPost(request);
        await loginViaUi(page, accounts.owner);
        await page.goto('/my-post');
        const row = page.getByRole('row', { name: new RegExp(post.title) });
        await row.getByRole('button', { name: /Chỉnh sửa/ }).click();
        await expect(page).toHaveURL(new RegExp(`/post/${post.id}/edit$`));
        // The form is filled with the post being edited.
        await expect(page.getByRole('textbox', { name: 'Tiêu đề' })).toHaveValue(post.title);
    });

    test('new post form validates what was typed', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.goto('/newpost');
        const title = page.locator('input[name="title"]');
        await title.fill('too short');
        await page.getByRole('button', { name: /Đăng Tin/ }).click();
        // The "min length" message (not "required") proves the typed text reached the form state.
        await expect(page.getByText('Tiêu đề phải dài ít nhất 30 ký tự')).toBeVisible();

        await title.fill('A title that is comfortably longer than thirty characters');
        await page.getByRole('button', { name: /Đăng Tin/ }).click();
        await expect(page.getByText('Tiêu đề phải dài ít nhất 30 ký tự')).toHaveCount(0);
        await expect(title).toHaveValue('A title that is comfortably longer than thirty characters');
    });

    test('is blocked from the admin page', async ({ page }) => {
        await loginViaUi(page, accounts.owner);
        await page.goto('/approved');
        await expect(page.getByText('Phê duyệt bài đăng')).toHaveCount(0);
        await expect(page.locator('main img')).toBeVisible();
    });
});

test.describe('admin', () => {
    test('keeps the chosen tab in the URL across a reload', async ({ page }) => {
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved');
        await page.getByRole('tab', { name: 'Gia hạn' }).click();
        await expect(page).toHaveURL(/tab=extend/);
        await page.reload();
        await expect(page.getByText('Yêu cầu gia hạn bài đăng')).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Gia hạn' })).toHaveAttribute('aria-selected', 'true');
    });

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

    test('opens an empty favorites list without an error', async ({ page, request }) => {
        const token = await apiLogin(request, accounts.renter);
        const headers = { Authorization: `Bearer ${token}` };
        const liked = await request.get(`${API}/api/Renter/RentalPost/Likes?_limit=100`, { headers });
        // Liking a liked post removes the like, so this empties the list.
        for (const { id } of liked.ok() ? (await liked.json()).simplePostDtos : []) {
            await request.post(`${API}/api/Renter/RentalPost/Like`, { headers, data: { AccommodationRentalPostId: id } });
        }

        await loginViaUi(page, accounts.renter);
        await page.goto('/favorite');
        await expect(page.getByText('Không tìm thấy bài viết nào')).toBeVisible();
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('steps back from a favorites page that does not exist and leaves a clean URL', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        const token = await apiLogin(request, accounts.renter);
        const liked = await request.post(`${API}/api/Renter/RentalPost/Like`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { AccommodationRentalPostId: post.id },
        });
        expect(liked.ok()).toBe(true);

        await loginViaUi(page, accounts.renter);
        await page.goto('/favorite?page=9999');
        await expect(page).toHaveURL(/\/favorite$/);
        await expect(page.getByRole('row').nth(1)).toBeVisible();
        await expect(page.getByRole('alert')).toHaveCount(0);
    });
});
