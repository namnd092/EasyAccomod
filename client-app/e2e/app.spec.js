import { test, expect } from '@playwright/test';
import { API, accounts, apiLogin, commentOn, createPost, loginViaUi, reportPost } from './helpers';

test.describe('visitor', () => {
    test('sees an approved post on the home page and can open it', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await page.goto('/?sort=newest');
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
        // The post has no comments yet; wait for the answer to the comments request, which is what could fail.
        const commentsLoaded = page.waitForResponse((response) => /\/api\/RentalPosts\/\d+\/Comments/.test(response.url()));
        await page.goto(`/post/${post.id}`);
        expect((await commentsLoaded).status()).toBe(200);
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

test.describe('on a phone', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    // A table wider than the screen must scroll by itself instead of making the whole page scroll sideways.
    const pageScrollsSideways = (page) =>
        page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

    test('the owner posts tables do not widen the page', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await loginViaUi(page, accounts.owner);
        await page.goto('/my-post?approvedPage=9999');
        await expect(page.getByRole('row', { name: new RegExp(post.title) })).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
    });

    test('the favorites list does not widen the page and keeps its dislike button within reach', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        const token = await apiLogin(request, accounts.renter);
        const liked = await request.post(`${API}/api/Renter/RentalPost/Like`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { AccommodationRentalPostId: post.id },
        });
        expect(liked.ok()).toBe(true);
        await loginViaUi(page, accounts.renter);
        await page.goto('/favorite');
        await expect(page.getByText(post.title).first()).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
        const button = page.getByRole('button', { name: /Bỏ thích/ }).first();
        await expect(button).toBeVisible();
        const box = await button.boundingBox();
        expect(box.x + box.width).toBeLessThanOrEqual(375);
    });

    test('the post page, login and register do not widen the page', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await page.goto(`/post/${post.id}`);
        await expect(page.getByText(post.title).first()).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
        for (const path of ['/login', '/register']) {
            await page.goto(path);
            await expect(page.locator('input').first()).toBeVisible();
            expect(await pageScrollsSideways(page)).toBe(false);
        }
    });

    test('the admin comments and reports tables do not widen the page', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        const comment = `Bình luận dài ${Date.now()} ${'rất '.repeat(20)}tốt`;
        const report = `Báo cáo dài ${Date.now()} ${'rất '.repeat(20)}xấu`;
        await commentOn(request, post.id, comment);
        await reportPost(request, post.id, report);
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved?tab=comments&commentPage=9999');
        await expect(page.getByRole('row', { name: new RegExp(comment) })).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
        await page.goto('/approved?tab=reports&reportPage=9999');
        await expect(page.getByRole('row', { name: new RegExp(report) })).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
    });
});

test.describe('on a small phone', () => {
    test.use({ viewport: { width: 320, height: 640 } });

    const pageScrollsSideways = (page) =>
        page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

    test('the admin tabs, the new post form and the edit form fit the screen', async ({ page, request }) => {
        const pending = await createPost(request);
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved');
        await expect(page.getByRole('tab', { name: 'Gia hạn' })).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);

        await page.context().clearCookies();
        await loginViaUi(page, accounts.owner);
        await page.goto('/newpost');
        await expect(page.locator('input').first()).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
        await page.goto(`/post/${pending.id}/edit`);
        await expect(page.locator('input').first()).toBeVisible();
        expect(await pageScrollsSideways(page)).toBe(false);
    });
});

test.describe('owner', () => {
    test('logs in and sees their posts with the province', async ({ page, request }) => {
        const post = await createPost(request, { approved: true });
        await loginViaUi(page, accounts.owner);
        // The posts are listed oldest first, so the new one is on the last page; asking for a page far past it lands there.
        await page.goto('/my-post?approvedPage=9999');
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
        // The new post is on the last page of the pending list.
        await page.goto('/my-post?pendingPage=9999');
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

    test('keeps the chosen post status in the URL and starts from the first page', async ({ page }) => {
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved?tab=posts&page=3');
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'Đang chờ duyệt' }).click();
        await expect(page).toHaveURL(/tab=posts/);
        await expect(page).toHaveURL(/status=1/);
        await expect(page).not.toHaveURL(/page=/);
    });

    test('reaches the posts beyond the first page', async ({ page, request }) => {
        // More posts waiting than fit on one page; the last one created is on the last page.
        let last;
        for (let i = 0; i < 16; i += 1) last = await createPost(request);
        await loginViaUi(page, accounts.admin);
        await page.goto('/approved?tab=posts&status=1');
        await page.getByRole('button', { name: 'Trang cuối' }).click();
        await expect(page).toHaveURL(/page=\d+/);
        await expect(page.getByRole('row', { name: new RegExp(last.title) })).toBeVisible();
    });

    test('steps back from a page that does not exist in every paged tab', async ({ page }) => {
        await loginViaUi(page, accounts.admin);
        for (const [path, param] of [
            ['/approved?tab=posts&page=9999', 'page'],
            ['/approved?tab=extend&page=9999', 'page'],
            ['/approved?tab=accounts&confirmedPage=9999', 'confirmedPage'],
            ['/approved?tab=comments&commentPage=9999', 'commentPage'],
            ['/approved?tab=reports&reportPage=9999', 'reportPage'],
        ]) {
            await page.goto(path);
            await expect(page).not.toHaveURL(new RegExp(`${param}=9999`));
            await expect(page.getByRole('alert')).toHaveCount(0);
        }
    });

    test('approves a comment and resolves a report that sit beyond the first page', async ({ page, request }) => {
        // Enough comments waiting to push the new one past the first page of 15.
        const comment = `Chờ duyệt ${Date.now()}`;
        const report = `Cần xử lý ${Date.now()}`;
        const post = await createPost(request, { approved: true });
        await commentOn(request, post.id, comment);
        await reportPost(request, post.id, report);
        await loginViaUi(page, accounts.admin);

        await page.goto('/approved?tab=comments&commentPage=9999');
        const commentRow = page.getByRole('row', { name: new RegExp(comment) });
        await commentRow.getByRole('button', { name: /Xác nhận/ }).click();
        await expect(commentRow).toHaveCount(0);
        await expect(page.getByRole('alert')).toHaveCount(0);

        await page.goto('/approved?tab=reports&reportPage=9999');
        const reportRow = page.getByRole('row', { name: new RegExp(report) });
        await reportRow.getByRole('button', { name: /Xóa/ }).click();
        await expect(reportRow).toHaveCount(0);
        await expect(page.getByRole('alert')).toHaveCount(0);
    });

    test('approves a pending post and it appears on the home page', async ({ page, request }) => {
        const post = await createPost(request);
        await loginViaUi(page, accounts.admin);
        // Posts are listed oldest first, so the new one is on the last page of those waiting for approval.
        await page.goto('/approved?tab=posts&status=1&page=9999');
        const row = page.getByRole('row', { name: new RegExp(post.title) });
        await expect(row).toBeVisible();
        await row.getByRole('button', { name: /Xác nhận/ }).click();
        await expect(row).toHaveCount(0);

        await page.goto('/?sort=newest');
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
