#!/usr/bin/env python3
"""End-to-end smoke test for the EasyAccomod API.

Needs a running API seeded with the demo accounts (Development environment).
Usage: python3 scripts/smoke_test.py [base_url]
"""
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5100").rstrip("/")
failures = []
checks = 0


def call(method, path, token=None, body=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    data = json.dumps(body).encode() if body is not None else None
    path = urllib.parse.quote(path, safe="/?&=:")
    request = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            status, raw = response.status, response.read().decode()
    except urllib.error.HTTPError as error:
        status, raw = error.code, error.read().decode()
    try:
        return status, json.loads(raw)
    except ValueError:
        return status, raw


def check(name, condition, detail=""):
    global checks
    checks += 1
    if condition:
        print("  ok    " + name)
    else:
        print("  FAIL  " + name + ("  -> " + str(detail)[:300] if detail else ""))
        failures.append(name)


def expect(name, response, status):
    check(name, response[0] == status, "expected %s, got %s: %s" % (status, response[0], response[1]))
    return response[1]


def login(username, password):
    return call("POST", "/api/account/token", body={"username": username, "password": password})


def post_body(title):
    return {
        "Title": title,
        "Content": "Phòng đẹp, gần trung tâm",
        "AccommodationPictures": [{"PictureLink": "https://example.com/%d.jpg" % i} for i in range(3)],
        "Accommodation": {
            "Address": {"ProvinceId": 1, "DistrictId": 1, "WardId": 1, "Street": "12 Ngõ Hoa", "PublicLocationNearby": "Gần Hồ Gươm"},
            "AccommodationTypeId": 1, "RoomQuantity": 2, "PaymentTypeId": 1, "Price": 3000000,
            "RoomAreaRangeId": 2, "LiveWithOwner": False, "HaveClosedBathroom": True, "HaveWaterHeater": True,
            "KitchenTypeId": 1, "HaveAirConditioner": True, "HaveBalcony": False,
            "IsStateElectricityPrice": False, "ElectricityPrice": 3500, "IsStateWaterPrice": False,
            "WaterPrice": 20000, "RoomOptions": "", "OwnerId": 0,
        },
        "TimeDisplayed": 30,
    }


run = str(int(time.time()))

print("auth")
admin_login = login("Admin", "Admin1234.")
check("admin login ok", admin_login[0] == 200, admin_login)
admin = admin_login[1]["access_token"]
for key in ("access_token", "token_type", "expires_in", "username", "name", "account_id", "user_id", "role"):
    check("token response has " + key, key in admin_login[1])
owner = login("Owner1", "Owner1234.")[1]["access_token"]
renter = login("Renter1", "Renter1234.")[1]["access_token"]
check("wrong password rejected", login("Admin", "wrong")[0] == 400)

info = expect("admin info", call("GET", "/api/account/info", admin), 200)
check("info role/camelCase", info.get("role") == "Admin" and "accountId" in info and "userId" in info, info)
check("owner info role", call("GET", "/api/account/info", owner)[1].get("role") == "Owner")
check("renter info role", call("GET", "/api/account/info", renter)[1].get("role") == "Renter")
check("info without token is 401", call("GET", "/api/account/info")[0] == 401)
check("admin token on renter endpoint is 403", call("GET", "/api/Renter/RentalPost/Likes", admin)[0] == 403)
check("renter token on admin endpoint is 403", call("GET", "/api/Admin/Owners", renter)[0] == 403)
check("anonymous on admin endpoint is 401", call("GET", "/api/Admin/Owners")[0] == 401)

print("address and lookups")
check("provinces", len(expect("provinces", call("GET", "/api/Provinces"), 200)) == 63)
check("districts of province 1", len(expect("districts", call("GET", "/api/Provinces/1/Districts"), 200)) > 0)
wards = expect("wards of district 1", call("GET", "/api/Districts/1/Wards"), 200)
check("ward carries district and province", wards[0]["district"]["province"]["id"] == 1, wards[0])
for lookup in ("Types", "PaymentTypes", "KitchenTypes", "RoomAreaRanges", "Statuses"):
    check("lookup " + lookup, len(expect(lookup, call("GET", "/api/Accommodations/" + lookup), 200)) > 0)
check("post statuses", len(expect("post statuses", call("GET", "/api/RentalPosts/Statuses"), 200)) == 5)
check("search on empty result is 404 (legacy behaviour)", call("GET", "/api/RentalPosts/Search?street=zzzzzz" + run)[0] == 404)

print("owner creates a post")
check("fewer than 3 pictures rejected",
      call("POST", "/api/RentalPosts", owner, dict(post_body("x"), AccommodationPictures=[]))[0] == 400)
bad_address = post_body("x")
bad_address["Accommodation"]["Address"]["WardId"] = 999999
check("unknown ward rejected", call("POST", "/api/RentalPosts", owner, bad_address)[0] == 400)
created = expect("create post", call("POST", "/api/RentalPosts", owner, post_body("Phòng " + run)), 201)
post_id = created["id"]
check("created post pending", created["statusId"] == 1, created)
check("renter cannot create post", call("POST", "/api/RentalPosts", renter, post_body("x"))[0] == 403)
check("pending post hidden from anonymous", call("GET", "/api/RentalPosts/Get/%d" % post_id)[0] == 404)
check("pending post visible to its owner", call("GET", "/api/RentalPosts/Get/%d" % post_id, owner)[0] == 200)
check("pending post visible to admin", call("GET", "/api/RentalPosts/Get/%d" % post_id, admin)[0] == 200)
pending_list = expect("admin lists pending posts", call("GET", "/api/Admin/RentalPosts?statusId=1", admin), 200)
check("admin list contains post", any(p["id"] == post_id for p in pending_list["simplePostDtos"]), pending_list)

print("admin approves, search and view")
expect("approve post", call("PUT", "/api/Admin/RentalPost/SetStatus", admin, {"Id": 2, "PostId": post_id}), 200)
results = expect("search street (case-insensitive)", call("GET", "/api/RentalPosts/Search?street=ngõ hoa&provinceId=1"), 200)
found = [p for p in results["simplePostDtos"] if p["id"] == post_id]
check("search returns approved post", len(found) == 1, results)
if found:
    check("search item shape", found[0]["accommodationProvince"] and "đ/Tháng" in found[0]["accommodationPrice"]
          and found[0]["roomArea"] == "20-30m2" and len(found[0]["pictures"]) == 3, found[0])
check("search with facility filter", any(p["id"] == post_id for p in call(
    "GET", "/api/RentalPosts/Search?haveAirConditioner=1&haveBalcony=-1&paymentTypeId=1&minPrice=1000000&maxPrice=5000000")[1]["simplePostDtos"]))
check("search excludes by facility filter", all(p["id"] != post_id for p in call(
    "GET", "/api/RentalPosts/Search?haveBalcony=1")[1].get("simplePostDtos", [])) if call("GET", "/api/RentalPosts/Search?haveBalcony=1")[0] == 200 else True)
check("search rejects invalid tri-state", call("GET", "/api/RentalPosts/Search?haveBalcony=5")[0] == 400)
detail = expect("anonymous gets approved post", call("GET", "/api/RentalPosts/Get/%d" % post_id), 200)
acc = detail["accommodation"]
check("detail has address chain", acc["address"]["province"]["id"] == 1 and acc["address"]["ward"]["district"]["province"]["id"] == 1, acc["address"])
check("detail has lookups", acc["paymentType"]["name"] == "Tháng" and acc["kitchenType"] and acc["roomAreaRange"] and acc["accommodationType"], acc)
check("detail hides owner private fields", acc["owner"]["identification"] is None and acc["owner"]["address"] is None and acc["owner"]["accountId"] is None, acc["owner"])
check("detail has pictures and status", len(detail["accommodationPictures"]) == 3 and detail["status"]["name"] == "Được duyệt", detail)
views_before = call("GET", "/api/RentalPosts/%d/Views" % post_id)[1]
call("GET", "/api/RentalPosts/Get/%d" % post_id)
check("view counter increments", call("GET", "/api/RentalPosts/%d/Views" % post_id)[1] == views_before + 1)
check("fee endpoint", call("GET", "/api/RentalPosts/Fee?timeDisplayed=10", owner)[1] == 50000)

print("renter interactions")
check("initially not liked", call("GET", "/api/Renter/RentalPost/IsLiked?postId=%d" % post_id, renter)[1]["result"] is False)
check("like", expect("like", call("POST", "/api/Renter/RentalPost/Like", renter, {"AccommodationRentalPostId": post_id}), 200) == "Like")
check("now liked", call("GET", "/api/Renter/RentalPost/IsLiked?postId=%d" % post_id, renter)[1]["result"] is True)
check("like count", call("GET", "/api/RentalPosts/%d/Likes" % post_id)[1] == 1)
liked = expect("liked list", call("GET", "/api/Renter/RentalPost/Likes", renter), 200)
check("liked list has post", any(p["id"] == post_id for p in liked["simplePostDtos"]), liked)
expect("comment", call("POST", "/api/Renter/RentalPost/Comment", renter,
                       {"AccommodationRentalPostId": post_id, "Rate": 4, "Content": "Tốt"}), 200)
check("second comment rejected", call("POST", "/api/Renter/RentalPost/Comment", renter,
                                      {"AccommodationRentalPostId": post_id, "Rate": 4, "Content": "Tốt"})[0] == 400)
check("is commented", call("GET", "/api/Renter/RentalPost/IsCommented?postId=%d" % post_id, renter)[1]["result"] is True)
expect("report", call("POST", "/api/Renter/RentalPost/Report", renter,
                      {"AccommodationRentalPostId": post_id, "Content": "Thông tin sai"}), 200)
check("is reported", call("GET", "/api/Renter/RentalPost/IsReported?postId=%d" % post_id, renter)[1]["result"] is True)
check("unapproved comment not public", call("GET", "/api/RentalPosts/%d/Comments" % post_id)[0] == 404)

print("admin moderation")
pending = expect("pending comments", call("GET", "/api/Admin/PendingComment", admin), 200)
mine = [c for c in pending if c["accommodationRentalPostId"] == post_id]
check("pending comment listed with renter name", len(mine) == 1 and mine[0]["renterName"] == "Renter1", pending)
expect("approve comment", call("POST", "/api/Admin/ApproveComment", admin, {"Id": mine[0]["id"]}), 200)
comments = expect("public comments", call("GET", "/api/RentalPosts/%d/Comments" % post_id), 200)
check("public comment visible", comments["maxPage"] == 1 and comments["listCommentDtos"][0]["content"] == "Tốt", comments)
rated = call("GET", "/api/RentalPosts/Search?street=ngõ hoa")[1]["simplePostDtos"]
check("rating averaged on search", any(p["id"] == post_id and p["rate"] == 4 for p in rated), rated)
reports = expect("unsolved reports", call("GET", "/api/Admin/RentalPost/Reports?isSolved=false", admin), 200)
mine = [r for r in reports if r["accommodationRentalPostId"] == post_id]
check("report listed with title", len(mine) == 1 and mine[0]["postTitle"] == "Phòng " + run, reports)
expect("resolve report", call("POST", "/api/Admin/RentalPost/ResolveReport", admin, {"Id": mine[0]["id"]}), 200)
check("report now solved", any(r["accommodationRentalPostId"] == post_id
                               for r in call("GET", "/api/Admin/RentalPost/Reports?isSolved=true", admin)[1]))
check("dislike toggles", call("POST", "/api/Renter/RentalPost/Like", renter, {"AccommodationRentalPostId": post_id})[1] == "Dislike")

print("owner dashboard, extension and notifications")
mine_posts = expect("owner posts", call("GET", "/api/Owner/RentalPosts", owner), 200)
entry = [p for p in mine_posts["ownerSimplePostDtos"] if p["id"] == post_id]
check("owner post entry", len(entry) == 1 and entry[0]["status"] == "Được duyệt" and entry[0]["views"] >= 1
      and entry[0]["address"]["ward"]["district"]["province"], entry)
accommodation_id = entry[0]["accommodationId"]
expect("mark rented", call("PUT", "/api/Owner/Accommodation/SetStatus", owner,
                           {"AccommodationId": accommodation_id, "WasRented": True}), 200)
check("rented filter", any(p["id"] == post_id for p in call("GET", "/api/Owner/RentalPosts?wasRented=1", owner)[1]["ownerSimplePostDtos"]))
expired_before = call("GET", "/api/RentalPosts/Get/%d" % post_id, owner)[1]["dateExpired"]
expect("request extension", call("POST", "/api/Owner/RentalPosts/ExtendPeriod", owner,
                                 {"AccommodationRentalPostId": post_id, "ExtendPeriod": 10}), 200)
check("duplicate extension rejected", call("POST", "/api/Owner/RentalPosts/ExtendPeriod", owner,
                                           {"AccommodationRentalPostId": post_id, "ExtendPeriod": 10})[0] == 400)
extends = expect("extension list", call("GET", "/api/Admin/RentalPosts/ExtendPeriod", admin), 200)
mine = [e for e in extends["listPost"] if e["id"] == post_id]
check("extension listed", len(mine) == 1 and mine[0]["extendPeriod"] == 10, extends)
expect("approve extension", call("POST", "/api/Admin/RentalPost/ExtendPeriod/Approve", admin, {"Id": mine[0]["extendId"]}), 200)
expired_after = call("GET", "/api/RentalPosts/Get/%d" % post_id, owner)[1]["dateExpired"]
check("expiry moved forward", expired_after > expired_before, (expired_before, expired_after))
owner_notes = expect("owner notifications", call("GET", "/api/Notifications", owner), 200)
check("owner got approval notification", any("phê duyệt" in n["content"] for n in owner_notes), owner_notes)
expect("check notification", call("PUT", "/api/Notifications/Check", owner, {"Id": owner_notes[0]["id"]}), 200)
admin_notes = expect("admin notifications", call("GET", "/api/Notifications", admin), 200)
check("admin got rented notification", any("đã cho thuê" in n["content"] for n in admin_notes), admin_notes)

print("edit pending post")
second = expect("create second post", call("POST", "/api/RentalPosts", owner, post_body("Sửa " + run)), 201)
edit = post_body("Đã sửa " + run)
edit.pop("TimeDisplayed")
edit["Accommodation"]["Price"] = 4200000
edit["Accommodation"]["Address"]["Street"] = "99 Phố Mới"
expect("edit post", call("PUT", "/api/RentalPosts/Edit/%d" % second["id"], owner, edit), 200)
edited = call("GET", "/api/RentalPosts/Get/%d" % second["id"], owner)[1]
check("edit applied in place", edited["title"] == "Đã sửa " + run and edited["accommodation"]["price"] == 4200000
      and edited["accommodation"]["address"]["street"] == "99 Phố Mới"
      and edited["accommodationId"] == second["accommodationId"], edited)
expect("reject second post", call("PUT", "/api/Admin/RentalPost/SetStatus", admin, {"Id": 3, "PostId": second["id"]}), 200)
check("rejected post cannot be edited", call("PUT", "/api/RentalPosts/Edit/%d" % second["id"], owner, edit)[0] == 400)
check("admin must give an OwnerId", call("POST", "/api/RentalPosts", admin, post_body("Admin " + run))[0] == 400)
owner_row_id = call("GET", "/api/account/info", owner)[1]["userId"]
admin_body = post_body("Admin " + run)
admin_body["Accommodation"]["OwnerId"] = owner_row_id
admin_post = expect("admin creates post for an owner", call("POST", "/api/RentalPosts", admin, admin_body), 201)
check("admin post is approved immediately", admin_post["statusId"] == 2 and admin_post["accommodation"]["ownerId"] == owner_row_id, admin_post)

print("registration and owner approval")
renter_name = "renter" + run
expect("renter register", call("POST", "/api/Account/RenterRegister", None, {
    "Name": "Người thuê", "UserName": renter_name, "Email": renter_name + "@test.com",
    "Password": "Abcdef1!", "ConfirmPassword": "Abcdef1!"}), 200)
check("renter can log in", login(renter_name, "Abcdef1!")[1].get("role") == "Renter")
check("weak password rejected", call("POST", "/api/Account/RenterRegister", None, {
    "Name": "x", "UserName": renter_name + "b", "Email": renter_name + "b@test.com",
    "Password": "abcdef", "ConfirmPassword": "abcdef"})[0] == 400)
check("duplicate username rejected", call("POST", "/api/Account/RenterRegister", None, {
    "Name": "x", "UserName": renter_name, "Email": "other" + run + "@test.com",
    "Password": "Abcdef1!", "ConfirmPassword": "Abcdef1!"})[0] == 400)
owner_name = "owner" + run
expect("owner register", call("POST", "/api/Account/OwnerRegister", None, {
    "Name": "Chủ trọ", "UserName": owner_name, "Email": owner_name + "@test.com", "Identification": "123456789",
    "Address": "HN", "Phone": "0987654321", "Password": "Abcdef1!", "ConfirmPassword": "Abcdef1!"}), 200)
new_owner = login(owner_name, "Abcdef1!")[1]
check("new owner waits for confirmation", new_owner.get("role") == "Wait for Admin to confirm", new_owner)
waiting = expect("owners waiting", call("GET", "/api/Admin/Owners?confirmationStatus=-1", admin), 200)
entry = [o for o in waiting["owners"] if o["email"] == owner_name + "@test.com"]
check("new owner listed as waiting", len(entry) == 1, waiting)
expect("approve owner", call("POST", "/api/Admin/SetOwner", admin, {"AccountId": entry[0]["accountId"]}), 200)
check("owner role after approval", login(owner_name, "Abcdef1!")[1].get("role") == "Owner")
check("approved owners list", any(o["email"] == owner_name + "@test.com"
                                  for o in call("GET", "/api/Admin/Owners?confirmationStatus=1", admin)[1]["owners"]))
other_owner_token = login(owner_name, "Abcdef1!")[1]["access_token"]
foreign = expect("create post to be edited by a stranger", call("POST", "/api/RentalPosts", owner, post_body("Của chủ 1 " + run)), 201)
stranger_edit = post_body("Bị sửa trái phép " + run)
stranger_edit.pop("TimeDisplayed")
check("owner cannot edit another owner's post", call("PUT", "/api/RentalPosts/Edit/%d" % foreign["id"], other_owner_token, stranger_edit)[0] == 403)
check("foreign edit changed nothing", call("GET", "/api/RentalPosts/Get/%d" % foreign["id"], owner)[1]["title"] == "Của chủ 1 " + run)
reject_name = "reject" + run
call("POST", "/api/Account/OwnerRegister", None, {
    "Name": "Bị từ chối", "UserName": reject_name, "Email": reject_name + "@test.com", "Identification": "123456789",
    "Address": "HN", "Phone": "0987654321", "Password": "Abcdef1!", "ConfirmPassword": "Abcdef1!"})
reject_id = login(reject_name, "Abcdef1!")[1]["account_id"]
expect("reject owner", call("POST", "/api/Admin/RejectOwner", admin, {"AccountId": reject_id}), 200)
check("rejected owner cannot log in", login(reject_name, "Abcdef1!")[0] == 400)

print("owner edit-info workflow")
check("initial edit status", call("GET", "/api/Owner/EditInfoStatus", owner)[1]["result"] == -1)
check("edit before permission rejected", call("PUT", "/api/Owner/EditInfo", owner, {
    "Name": "Chủ 1", "Identification": "123456789", "Address": "HN", "Phone": "0987654321", "Email": "owner1@owner.com"})[0] == 400)
expect("require edit info", call("POST", "/api/Owner/RequireEditInfo", owner), 200)
check("waiting for permission", call("GET", "/api/Owner/EditInfoStatus", owner)[1]["result"] == 0)
check("waiting list for admin", len(call("GET", "/api/Admin/Owners?confirmationStatus=-2", admin)[1]["owners"]) >= 1)
owner_row = call("GET", "/api/account/info", owner)[1]
expect("grant edit permission", call("POST", "/api/Admin/ResolveEditInfo", admin,
                                     {"OwnerId": owner_row["userId"], "CanEditInfo": True}), 200)
check("permission granted", call("GET", "/api/Owner/EditInfoStatus", owner)[1]["result"] == 1)
expect("edit info", call("PUT", "/api/Owner/EditInfo", owner, {
    "Name": "Chủ trọ 1", "Identification": "123456789", "Address": "HCM", "Phone": "0987654321",
    "Email": "owner1@owner.com"}), 200)
changed = login("Owner1", "Owner1234.")[1]
check("owner back to waiting after edit", changed.get("role") == "Wait for Admin to confirm" and changed.get("name") == "Chủ trọ 1", changed)
owner_row = call("GET", "/api/account/info", changed["access_token"])[1]
expect("re-approve owner", call("POST", "/api/Admin/SetOwner", admin, {"AccountId": owner_row["accountId"]}), 200)
check("owner restored", login("Owner1", "Owner1234.")[1].get("role") == "Owner")

print("\n%d checks, %d failed" % (checks, len(failures)))
for name in failures:
    print("  FAILED: " + name)
sys.exit(1 if failures else 0)
