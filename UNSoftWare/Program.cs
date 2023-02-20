using UNSoftWare.Map;

namespace UNSoftWare
{
    public class Program
    {
        static string connectionString = "Data Source=192.168.1.100;Port=3306;User ID=unsoftw;Password=yI1.ft!@p*;Charset=utf8;Database=3900UNSW;SslMode=none;Max pool size=10";
        public static Random Rnd = new Random();
        public static IFreeSql FSQL = new FreeSql.FreeSqlBuilder()
             .UseConnectionString(FreeSql.DataType.MySql, connectionString)
             .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
             .UseAutoSyncStructure(true) //自动同步实体结构到数据库
             .Build(); //请务必定义成 Singleton 单例模式
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

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

            //Movie
            app.MapGet("/Movie/Recommend", Movie.Recommend);
            app.MapGet("/Movie/Info", Movie.Info);
            app.MapPost("/Movie/add", Movie.add);
            app.MapGet("/Movie/Search", Movie.Search);

            //Comment
            app.MapPost("/Comment/add", Comment.add);
            app.MapGet("/Comment/User", Comment.User);
            app.MapGet("/User/Comment", Comment.User);
            app.MapGet("/Comment/Movie", Comment.Movie);
            app.MapGet("/Movie/Comment", Comment.Movie);
            app.MapPost("/Comment/remove", Comment.remove);

            app.Run();
        }
    }
}