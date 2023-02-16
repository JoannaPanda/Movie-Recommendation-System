using LinePutScript;
using UNSoftWare.DataBase;
using static UNSoftWare.Program;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace UNSoftWare.Map
{
    public static class User
    {
        /// <summary>
        /// User Token List
        /// long -> Token
        /// int -> Uid
        /// </summary>
        public static Dictionary<long, int> Tokens = new Dictionary<long, int>();

        /// <summary>
        /// Login User and get login user info
        /// </summary>
        public static async void Login(HttpContext context)
        {
            string uoe = context.Request.Form["idoremail"];
            long pass = Sub.GetHashCode(context.Request.Form["password"]);
            MV_User usr;
            if (int.TryParse(uoe, out int id))
            {
                usr = FSQL.Select<MV_User>().Where(a => a.Uid == id && a.Password == pass).First();
            }
            else
            {
                usr = FSQL.Select<MV_User>().Where(a => a.Email == uoe && a.Password == pass).First();
            }
            if (usr == null)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Email or Password Error");
            }
            else
            {
                long token = Rnd.NextInt64();
                Tokens.Add(token, usr.Uid);
                var jret = new JObject();
                jret["token"] = token;
                jret["userinfo"] = JObject.Parse(JsonConvert.SerializeObject(usr));
                await context.Response.WriteAsync(jret.ToString());
            }
        }
        /// <summary>
        /// Register User
        /// </summary>
        public static async void Register(HttpContext context)
        {
            string name = context.Request.Form["name"];
            string email = context.Request.Form["email"];
            string pass = context.Request.Form["password"];
            MV_User usr = FSQL.Select<MV_User>().Where(a => a.Email == email).First();
            if (usr == null)
            {
                usr = new MV_User(name, email, pass);
                usr.Uid = (int)FSQL.Insert(usr).ExecuteIdentity();
                long token = Rnd.NextInt64();
                Tokens.Add(token, usr.Uid);
                var jret = new JObject();
                jret["token"] = token;
                jret["userinfo"] = JObject.Parse(JsonConvert.SerializeObject(usr));
                await context.Response.WriteAsync(jret.ToString());
            }
            else
            {
                context.Response.StatusCode = 406;
                await context.Response.WriteAsync("Email Already exists");
            }
        }
    }
}
