export const API = process.env.E2E_API_URL || 'http://localhost:5100';

export const accounts = {
    admin: { username: 'Admin', password: 'Admin1234.' },
    owner: { username: 'Owner1', password: 'Owner1234.' },
    renter: { username: 'Renter1', password: 'Renter1234.' },
};

export async function apiLogin(request, account) {
    const response = await request.post(`${API}/api/account/token`, { data: account });
    if (!response.ok()) throw new Error(`login failed for ${account.username}: ${response.status()}`);
    return (await response.json()).access_token;
}

function postBody(title) {
    return {
        Title: title,
        Content: 'Phòng đẹp, gần trung tâm',
        AccommodationPictures: [0, 1, 2].map((i) => ({ PictureLink: `https://example.com/${i}.jpg` })),
        Accommodation: {
            Address: { ProvinceId: 1, DistrictId: 1, WardId: 1, Street: '12 Ngõ Hoa', PublicLocationNearby: 'Gần Hồ Gươm' },
            AccommodationTypeId: 1, RoomQuantity: 2, PaymentTypeId: 1, Price: 3000000,
            RoomAreaRangeId: 2, LiveWithOwner: false, HaveClosedBathroom: true, HaveWaterHeater: true,
            KitchenTypeId: 1, HaveAirConditioner: true, HaveBalcony: false,
            IsStateElectricityPrice: false, ElectricityPrice: 3500, IsStateWaterPrice: false,
            WaterPrice: 20000, RoomOptions: '', OwnerId: 0,
        },
        TimeDisplayed: 30,
    };
}

// Creates a post as Owner1 through the API. Each test uses its own uniquely titled post.
export async function createPost(request, { approved = false } = {}) {
    const title = `E2E ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const owner = await apiLogin(request, accounts.owner);
    const created = await request.post(`${API}/api/RentalPosts`, {
        headers: { Authorization: `Bearer ${owner}` },
        data: postBody(title),
    });
    if (created.status() !== 201) throw new Error(`create post failed: ${created.status()}`);
    const post = await created.json();

    if (approved) {
        const admin = await apiLogin(request, accounts.admin);
        const approvedResponse = await request.put(`${API}/api/Admin/RentalPost/SetStatus`, {
            headers: { Authorization: `Bearer ${admin}` },
            data: { Id: 2, PostId: post.id },
        });
        if (!approvedResponse.ok()) throw new Error(`approve failed: ${approvedResponse.status()}`);
    }
    return { id: post.id, title };
}

export async function loginViaUi(page, account) {
    await page.goto('/login');
    const inputs = page.locator('input');
    await inputs.nth(0).fill(account.username);
    await inputs.nth(1).fill(account.password);
    await page.getByRole('button', { name: /đăng nhập/i }).first().click();
    await page.waitForURL('/');
}
