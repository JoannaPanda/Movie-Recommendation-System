using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;
using UNSoftWare.DataBase;
using static UNSoftWare.Map.User;
using static UNSoftWare.Program;

namespace UNSoftWare.Map
{
    public static class Comment
    {
        /// <summary>
        /// get User All Move Comment
        /// </summary>
        public static async void User(HttpContext context)
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
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(FSQL.Select<MV_User>().Where(x => x.Uid == uid).ToList()));
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
        /// Add a New Comment
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
                    var comm = FSQL.Select<MV_Comment>().Where(x => x.Mid == mid && x.Uid == usr.Uid).First();
                    if (comm == null)
                    {
                        comm = new MV_Comment(mid, usr.Uid, byte.Parse(context.Request.Form["score"]), context.Request.Form["comment"]);
                        comm.Cid = (int)FSQL.Insert(comm).ExecuteIdentity();
                    }
                    else
                    {
                        comm.Score = byte.Parse(context.Request.Form["score"]);
                        comm.Comment = context.Request.Form["comment"];
                        FSQL.Update<MV_Comment>().SetSource(comm).ExecuteAffrows();
                    }
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(comm));
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
        /// Remove Comment
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

            if (int.TryParse(context.Request.Form["Cid"], out int cid))
            {
                var movie = FSQL.Delete<MV_Comment>().Where(x => x.Cid == cid).ExecuteAffrows();
                if (movie == 0)
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("Comment No Found");
                    return;
                }
                else
                {
                    await context.Response.WriteAsync("Success");
                }
            }
            else
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync("Comment No Found");
                return;
            }
        }
        /// <summary>
        /// List All Comment for movie
        /// </summary>
        public static async void Movie(HttpContext context)
        {
            var usr = GetUserInfofromToken(context);
            if (int.TryParse(context.Request.Query["Mid"], out int Mid))
            {
                var movie = FSQL.Select<MV_Moive>().Where(a => a.Mid == Mid).First();
                if (movie == null)
                {
                    context.Response.StatusCode = 404;
                    await context.Response.WriteAsync("No Movie Found");
                    return;
                }
                else
                {
                    List<MV_Comment> comms;
                    if (usr == null)
                        comms = FSQL.Select<MV_Comment>().Where(x => x.Mid == Mid).ToList();
                    else
                    {
                        var banlist = usr.BanList;
                        comms = FSQL.Select<MV_Comment>().Where(x => x.Mid == Mid && !banlist.Contains(x.Uid)).ToList();
                    }
                    var jret = new JObject();
                    jret["score"] = comms.Count == 0 ? 0 : comms.Sum(x => x.Score) / comms.Count;
                    jret["commentinfo"] = JObject.Parse(JsonConvert.SerializeObject(comms));
                    await context.Response.WriteAsync(jret.ToString());
                }
            }
            else
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync("No Movie Found");
                return;
            }
        }
    }
}
