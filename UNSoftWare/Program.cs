using UNSoftWare.Map;

namespace UNSoftWare
{
    public class Program
    {
        static string connectionString = "Data Source=192.168.1.100;Port=3306;User ID=unsoftw;Password=yI1.ft!@p*;Charset=utf8;Database=3900UNSW;SslMode=none;Max pool size=10";
        public static Random Rnd = new Random();
        public static IFreeSql FSQL = new FreeSql.FreeSqlBuilder()
             .UseConnectionString(FreeSql.DataType.MySql, connectionString)
             .UseMonitorCommand(cmd => Console.WriteLine($"Sql��{cmd.CommandText}"))
             .UseAutoSyncStructure(true) //�Զ�ͬ��ʵ��ṹ�����ݿ�
             .Build(); //����ض���� Singleton ����ģʽ
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "UNSoftWare BackEND");
            app.MapPost("/User/Login", User.Login);
            app.MapPost("/User/Register", User.Register);

            app.Run();
        }
    }
}