using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using AutoMapper;
using EasyAccomod.Dtos;
using EasyAccomod.Models;
using EasyAccomod.Models.AddressModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Newtonsoft.Json;
using Owin;

[assembly: OwinStartup(typeof(EasyAccomod.Startup))]

namespace EasyAccomod
{
    public partial class Startup
    {
        private ApplicationDbContext _context;

        public Startup()
        {
            _context = new ApplicationDbContext();
        }

        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateRolesAndUsers();
            GenerateAddressDataInDb();
        }

        private void CreateRolesAndUsers()
        {
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(_context));

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_context));

            if (!roleManager.RoleExists("Admin"))
            {
                var role = new IdentityRole("Admin");
                roleManager.Create(role);

                var user = new ApplicationUser
                {
                    Email = "admin@admin.com",
                    UserName = "Admin"
                };

                string userPassword = "Admin1234.";

                var result = userManager.Create(user, userPassword);

                if (result.Succeeded)
                {
                    userManager.AddToRole(user.Id, "Admin");
                }

                var admin = new Admin()
                {
                    Name = "Admin",
                    Email = user.Email,
                    AccountId = user.Id
                };

                _context.Admins.Add(admin);
                _context.SaveChanges();
            }

            if (!roleManager.RoleExists(RoleName.Owner))
            {
                var role = new IdentityRole(RoleName.Owner);
                roleManager.Create(role);
            }

            if (!roleManager.RoleExists(RoleName.Renter))
            {
                var role = new IdentityRole(RoleName.Renter);
                roleManager.Create(role);
            }

            if (!roleManager.RoleExists(RoleName.WaitForConfirmation))
            {
                var role = new IdentityRole(RoleName.WaitForConfirmation);
                roleManager.Create(role);
            }
        }

        private void GenerateAddressDataInDb()
        {
            if (_context.Provinces.Any()) return;

            var fileName = "Province_District_Ward.json";
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\", fileName);

            using (StreamReader streamReader = File.OpenText(path))
            {
                var json = streamReader.ReadToEndAsync().Result;

                var listProvinces = JsonConvert.DeserializeObject<IEnumerable<ProvinceViewModel>>(json);

                foreach (var provinceViewModel in listProvinces)
                {
                    var provinceDto = new ProvinceDto()
                    {
                        Id = provinceViewModel.Id,
                        Name = provinceViewModel.Name
                    };

                    var province = Mapper.Map<ProvinceDto, Province>(provinceDto);
                    _context.Provinces.Add(province);
                    _context.SaveChanges();

                    var listDistricts = provinceViewModel.Huyen;
                    foreach (var districtViewModel in listDistricts)
                    {
                        var districtDto = new DistrictDto()
                        {
                            Id = districtViewModel.Id,
                            Name = districtViewModel.Name,
                            ProvinceId = districtViewModel.Tinh_id
                        };

                        var district = Mapper.Map<DistrictDto, District>(districtDto);
                        _context.Districts.Add(district);
                        _context.SaveChanges();

                        var listWards = districtViewModel.Xa;
                        foreach (var wardViewModel in listWards)
                        {
                            var wardDto = new WardDto()
                            {
                                Id = wardViewModel.Id,
                                Name = wardViewModel.Name,
                                DistrictId = wardViewModel.Huyen_id
                            };

                            var ward = Mapper.Map<WardDto, Ward>(wardDto);
                            _context.Wards.Add(ward);
                            _context.SaveChanges();
                        }
                    }
                }
            }
        }
    }
}