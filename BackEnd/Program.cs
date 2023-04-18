using Microsoft.AspNetCore.Routing.Constraints;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Crypto.Agreement.Kdf;
using SixLabors.ImageSharp;
using UNSoftWare.Map;

namespace UNSoftWare
{
    public class Program
    {
        public static string ConnectionString = "";
        public static string ImageHostName = "";
        public static Random Rnd = new Random();
        public static IFreeSql? FSQL = null;
        public static void Main(string[] args)
        {
            //LoadSetting
            var settingpath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Setting.json");
            JObject setting = JObject.Parse(File.ReadAllText(settingpath));
            ConnectionString = setting["ConnectionString"].ToString();
            ImageHostName = setting["ImageHostName"].ToString();
            FSQL = new FreeSql.FreeSqlBuilder()
            .UseConnectionString(FreeSql.DataType.MySql, ConnectionString)
            .UseMonitorCommand(cmd => Console.WriteLine($"Sql��{cmd.CommandText}"))
            .UseAutoSyncStructure(true)
            .Build();

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(e => e.AddDefaultPolicy(o => o.AllowAnyOrigin()
            .AllowAnyMethod().AllowAnyHeader()));

            var app = builder.Build();

            for (int i = 0; i < Images.ProfileImage.len; i++)
            {
                DirectoryInfo tmpdi = new DirectoryInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PIRND", i.ToString()));
                if (tmpdi.Exists)
                {
                    foreach (FileInfo tmpfi in tmpdi.EnumerateFiles("*.png"))
                    {
                        Images.Profile.Files[i].Add(tmpfi.FullName);
                    }
                }
            }

            app.UseCors();

            app.MapGet("/", () => "UNSoftWare BackEND");

            //User
            app.MapPost("/User/Login", User.Login);
            app.MapPost("/User/Register", User.Register);
            app.MapPost("/User/Logout", User.Logout);
            app.MapGet("/User/Info", User.Info);

            app.MapGet("/User/Wishlist/list", User.Wishlist.list);
            app.MapPost("/User/Wishlist/add", User.Wishlist.add);
            app.MapPost("/User/Wishlist/remove", User.Wishlist.remove);

            app.MapGet("/User/Banlist/list", User.Banlist.list);
            app.MapPost("/User/Banlist/add", User.Banlist.add);
            app.MapPost("/User/Banlist/remove", User.Banlist.remove);

            app.MapPost("/User/Recommend/add", User.Recommend.add);
            app.MapPost("/User/Recommend/Clear", User.Recommend.Clear);

            app.MapPost("/User/JSON", User.setJSON);
            app.MapGet("/User/JSON", User.getJSON);

            //Movie
            app.MapGet("/Movie/Recommend", Movie.Recommend);
            app.MapGet("/Movie/Info", Movie.Info);
            app.MapPost("/Movie/add", Movie.add);
            app.MapGet("/Movie/Search", Movie.Search);
            app.MapGet("/Movie/ListOrder", Movie.ListOrder);

            //Comment
            app.MapPost("/Comment/add", Comment.add);
            app.MapGet("/Comment/User", Comment.User);
            app.MapGet("/User/Comment", Comment.User);
            app.MapGet("/Comment/Movie", Comment.Movie);
            app.MapGet("/Movie/Comment", Comment.Movie);
            app.MapPost("/Comment/remove", Comment.remove);
            app.MapPost("/Comment/Like", Comment.Like);
            app.MapPost("/Comment/DisLike", Comment.DisLike);


            app.MapGet("/Image/{MoveName}/{ImageName}", Images.Base);
            app.MapGet("/Image/User/{uid:int}", Images.User);
            app.MapPost("UploadImage/User", Images.UploadUser);
            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "api",
            //        pattern: "api/{controller}/{action}",
            //        defaults: new { action = "Index" },
            //        constraints: new { httpMethod = new HttpMethodRouteConstraint("GET") });
            //});



            app.Run();


        }
    }
}