using UNSoftWare.DataBase;

namespace DataLoader
{
    internal class Program
    {
        static string connectionString = "Data Source=192.168.1.100;Port=3306;User ID=unsoftw;Password=yI1.ft!@p*;Charset=utf8;Database=3900UNSW;SslMode=none;Max pool size=10";
        static Random rnd = new Random();
        public static IFreeSql FSQL = new FreeSql.FreeSqlBuilder()
            .UseConnectionString(FreeSql.DataType.MySql, connectionString)
            .UseMonitorCommand(cmd => Console.WriteLine($"Sql：{cmd.CommandText}"))
            .UseAutoSyncStructure(true) //自动同步实体结构到数据库
            .Build(); //请务必定义成 Singleton 单例模式
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, Data!");
            Console.WriteLine("FilePath");
            string[] data = File.ReadAllLines(Console.ReadLine().Trim('"'));
            Console.WriteLine("Please Type Loading Type");
            Console.WriteLine("1. Movie");
            Console.WriteLine("2. Common");
            Console.WriteLine("3. User");
            switch (Console.ReadLine())
            {
                case "1":
                    LoadMovie(data);
                    break;
                case "2":
                    LoadComment(data);
                    break;
                case "3":
                    LoadUser(data);
                    break;
                case "4":
                    for(int i = 62; i < 95;i++)
                    {
                        FSQL.Update<MV_Moive>().Where(x => x.Mid == i).Set(y => y.Score,
                            MV_Comment.CalScore(FSQL.Select<MV_Comment>().Where(x => x.Mid == i).ToList())).ExecuteAffrows();
                    }
                    break;
            }

            Console.WriteLine("Bye, Data!");
            Console.ReadLine();
        }
        public static void LoadMovie(string[] data)
        {
            foreach (var d in data)
            {
                if (string.IsNullOrWhiteSpace(d))
                    return;
                var ds = d.Split('\t');
                var mv = new MV_Moive(ds[0], ds[4], ds[5], ds[6], ds[1], ds[2], DateTime.Parse(ds[3]), rnd.Next(300));
                int mid = (int)FSQL.Insert(mv).ExecuteIdentity();
                double s = MV_Comment.CalScore(FSQL.Select<MV_Comment>().Where(x => x.Mid == mid).ToList());
                FSQL.Update<MV_Moive>().Where(x => x.Mid == mid).Set(y => y.Score, s).ExecuteAffrows();
            }
        }

        public static void LoadComment(string[] data)
        {
            foreach (var d in data)
            {
                var ds = d.Split('\t');
                FSQL.Insert(new MV_Comment()
                {
                    Uid = int.Parse(ds[0]),
                    Mid = int.Parse(ds[1]),
                    Score = byte.Parse(ds[2]),
                    Comment = ds[3],
                    Like = int.Parse(ds[4]),
                    DisLike = int.Parse(ds[5]),
                }).ExecuteAffrows();
            }
        }

        public static void LoadUser(string[] data)
        {
            foreach (var d in data)
            {
                var ds = d.Split('\t');
                FSQL.Insert(new MV_User(ds[0], ds[1], "password")).ExecuteAffrows();
            }
        }
    }
}