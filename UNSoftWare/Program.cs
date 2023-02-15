namespace UNSoftWare
{
    public class Program
    {
        static string connectionString = "Data Source=192.168.1.100;Port=3306;User ID=unsoftw;Password=yI1.ft!@p*;Charset=utf8;Database=3900UNSW;SslMode=none;Max pool size=10";

        public static IFreeSql FSQL = new FreeSql.FreeSqlBuilder()
             .UseConnectionString(FreeSql.DataType.MySql, connectionString)
             .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
             .UseAutoSyncStructure(false) //自动同步实体结构到数据库
             .Build(); //请务必定义成 Singleton 单例模式
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "Hello World!");

            app.Run();
        }
    }
}