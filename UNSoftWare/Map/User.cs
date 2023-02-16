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

        /// <summary>
        /// Logout
        /// </summary>
        public static async void Logout(HttpContext context)
        {
            if (long.TryParse(context.Request.Form["token"], out long id))
            {
                if (Tokens.Remove(id))
                    await context.Response.WriteAsync("Logout Success");
                else
                    await context.Response.WriteAsync("Token Not Found");
            }
            else
                await context.Response.WriteAsync("Token ERROR");
        }

        /// <summary>
        /// Get User Info From User id
        /// </summary>
        public static async void Info(HttpContext context)
        {
            if (long.TryParse(context.Request.Query["Uid"], out long uid))
            {
                var usr = FSQL.Select<MV_User>().Where(a => a.Uid == uid).First();
                if (usr == null)
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No User Found");
                    return;
                }
                else
                {
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(usr)); 
                }
            }
            else
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync("No User Found");
                return;
            }
        }

        /// <summary>
        /// Get User Info From Token
        /// </summary>
        /// <param name="context">HTTP</param>
        /// <returns>MV_User</returns>
        public static MV_User? PostUserInfofromToken(HttpContext context)
        {
            if (long.TryParse(context.Request.Form["token"], out long tk))
                if (Tokens.TryGetValue(tk, out int uid))
                    return FSQL.Select<MV_User>().Where(a => a.Uid == uid).First();
                else
                    return null;
            else
                return null;
        }
        /// <summary>
        /// Get User Info From Token
        /// </summary>
        /// <param name="context">HTTP</param>
        /// <returns>MV_User</returns>
        public static MV_User? GetUserInfofromToken(HttpContext context)
        {
            if (long.TryParse(context.Request.Query["token"], out long tk))
                if (Tokens.TryGetValue(tk, out int uid))
                    return FSQL.Select<MV_User>().Where(a => a.Uid == uid).First();
                else
                    return null;
            else
                return null;
        }

        /// <summary>
        /// User WishList
        /// </summary>
        public static class Wishlist
        {
            /// <summary>
            /// get user wishlist
            /// </summary>
            public static async void list(HttpContext context)
            {
                if (int.TryParse(context.Request.Query["Uid"], out int uid))
                {
                    var usr = FSQL.Select<MV_User>().Where(a => a.Uid == uid).First();
                    if (usr == null)
                    {
                        context.Response.StatusCode = 404;
                        await context.Response.WriteAsync("No User Found");
                        return;
                    }
                    else
                    {
                        List<MV_Moive> list = new List<MV_Moive>();
                        foreach (int mid in usr.GetWishlist())
                        {
                            list.Add(FSQL.Select<MV_Moive>().Where(m => m.Mid == mid).First());
                        }
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(list));
                    }
                }
            }
            /// <summary>
            /// Add WishList
            /// </summary>
            public static async void add(HttpContext context)
            {
                var usr = PostUserInfofromToken(context);
                if (usr == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Error Token");
                    return;
                }

                if (int.TryParse(context.Request.Form["Mid"], out int mid))
                {
                    var movie = FSQL.Select<MV_Moive>().Where(a => a.Mid == mid).First();
                    if (movie == null)
                    {
                        context.Response.StatusCode = 404;
                        await context.Response.WriteAsync("No Movie Found");
                        return;
                    }
                    else
                    {
                        var list = usr.GetWishlist();
                        if (list.Contains(mid))
                        {
                            context.Response.StatusCode = 406;
                            await context.Response.WriteAsync("Movie Already exists");
                            return;
                        }
                        list.Add(mid);
                        usr.SetWishlist(list);
                        //FSQL.Update<MV_User>(usr.Uid).Set(x => x.Wishlist, usr.Wishlist);
                        FSQL.Update<MV_User>().SetSource(usr).ExecuteAffrows();
                        await context.Response.WriteAsync("Success");
                        return;
                    }
                }
                else
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No Movie Found");
                    return;
                }
            }
            /// <summary>
            /// Remove WishList
            /// </summary>
            public static async void remove(HttpContext context)
            {
                var usr = PostUserInfofromToken(context);
                if (usr == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Error Token");
                    return;
                }

                if (int.TryParse(context.Request.Form["Mid"], out int mid))
                {
                    var list = usr.GetWishlist();
                    if (!list.Contains(mid))
                    {
                        context.Response.StatusCode = 406;
                        await context.Response.WriteAsync("Movie Not Exists");
                        return;
                    }
                    list.Remove(mid);
                    usr.SetWishlist(list);
                    FSQL.Update<MV_User>().SetSource(usr).ExecuteAffrows();
                    await context.Response.WriteAsync("Success");
                    return;
                }
                else
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No Movie Found");
                    return;
                }
            }
        }

        /// <summary>
        /// User Banlist
        /// </summary>
        public static class Banlist
        {
            /// <summary>
            /// get user Banlist
            /// </summary>
            public static async void list(HttpContext context)
            {
                var usr = GetUserInfofromToken(context);
                if (usr == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Error Token");
                    return;
                }
                else
                {
                    List<MV_User> list = new List<MV_User>();
                    foreach (int uid in usr.GetBanlist())
                    {
                        list.Add(FSQL.Select<MV_User>().Where(m => m.Uid == uid).First());
                    }
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(list));
                }
            }
            /// <summary>
            /// Add Banlist
            /// </summary>
            public static async void add(HttpContext context)
            {
                var usr = PostUserInfofromToken(context);
                if (usr == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Error Token");
                    return;
                }

                if (int.TryParse(context.Request.Form["Uid"], out int uid))
                {
                    var banusr = FSQL.Select<MV_User>().Where(a => a.Uid == uid).First();
                    if (banusr == null)
                    {
                        context.Response.StatusCode = 404;
                        await context.Response.WriteAsync("No User Found");
                        return;
                    }
                    else
                    {
                        var list = usr.GetBanlist();
                        if (list.Contains(uid))
                        {
                            context.Response.StatusCode = 406;
                            await context.Response.WriteAsync("User Already exists");
                            return;
                        }
                        list.Add(uid);
                        usr.SetBanlist(list);
                        FSQL.Update<MV_User>().SetSource(usr).ExecuteAffrows();
                        await context.Response.WriteAsync("Success");
                        return;
                    }
                }
                else
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No User Found");
                    return;
                }
            }
            /// <summary>
            /// Remove Banlist
            /// </summary>
            public static async void remove(HttpContext context)
            {
                var usr = PostUserInfofromToken(context);
                if (usr == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Error Token");
                    return;
                }

                if (int.TryParse(context.Request.Form["Uid"], out int uid))
                {
                    var list = usr.GetBanlist();
                    if (!list.Contains(uid))
                    {
                        context.Response.StatusCode = 406;
                        await context.Response.WriteAsync("User Not Exists");
                        return;
                    }
                    list.Remove(uid);
                    usr.SetBanlist(list);
                    FSQL.Update<MV_User>().SetSource(usr).ExecuteAffrows();
                    await context.Response.WriteAsync("Success");
                    return;
                }
                else
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No User Found");
                    return;
                }
            }
        }
    }
}
