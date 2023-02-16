using Newtonsoft.Json;
using System.Xml.Linq;
using UNSoftWare.DataBase;
using static UNSoftWare.Map.User;
using static UNSoftWare.Program;

namespace UNSoftWare.Map
{
    /// <summary>
    /// Movie
    /// </summary>
    public static class Movie
    {
        /// <summary>
        /// Add Movie
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
            if (usr.Exp <= 25)
            {
                context.Response.StatusCode = 406;
                await context.Response.WriteAsync("Do not have Enough Exp");
                return;
            }
            var form = context.Request.Form;
            var movie = new MV_Moive(form["name"], form["intor"], form["info"], form["type"], ((string)form["tag"]).Replace(", ", ","), form["director"],
                 ((string)form["performer"]).Replace(", ", ","), Convert.ToDateTime(form["publishdate"]), form["link"], usr.Uid);
            movie.Mid = (int)FSQL.Insert(movie).ExecuteIdentity();
            await context.Response.WriteAsync(JsonConvert.SerializeObject(movie));
        }
        /// <summary>
        /// Recommend Movie for User
        /// </summary>
        public static async void Recommend(HttpContext context)
        {
            var usr = GetUserInfofromToken(context);
            if (usr == null || usr.PreferenceModels.Count == 0)
            {
                await context.Response.WriteAsync(JsonConvert.SerializeObject(FSQL.Select<MV_Moive>().OrderBy("rand()").Limit(20).ToList()));
            }
            else
            {
                var moives = FSQL.Select<MV_Moive>().ToList();

                foreach (var moive in moives)
                {
                    foreach (var jr in usr.PreferenceModels)
                    {
                        if (moive.Tag.Contains(jr.Key) || moive.Performer.Contains(jr.Key) || moive.Director == jr.Key)
                            moive.RankPoint += (int)jr.Value;
                    }
                }
                await context.Response.WriteAsync(JsonConvert.SerializeObject(moives.OrderByDescending(x => x.RankPoint).Take(20).ToArray()));
            }
        }
        /// <summary>
        /// Get Movie Info
        /// </summary>
        public static async void Info(HttpContext context)
        {
            if (long.TryParse(context.Request.Query["Mid"], out long mid))
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
                    var usr = GetUserInfofromToken(context);
                    if (usr != null)
                    {
                        var pm = usr.PreferenceModels;
                        pm[movie.Director] = pm.GetValueOrDefault(movie.Director) + 1;
                        foreach (string tag in movie.Tags)
                            pm[tag] = pm.GetValueOrDefault(tag) + 1;
                        foreach (string per in movie.Performers)
                            pm[per] = pm.GetValueOrDefault(per) + 1;
                        usr.SetPreferenceModel(pm);
                        FSQL.Update<MV_User>().SetSource(usr).ExecuteAffrows();
                    }
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(movie));
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
        /// Search Movie
        /// </summary>
        public static async void Search(HttpContext context)
        {
            var searchtext = (string)context.Request.Query["searchtext"];
            if (string.IsNullOrWhiteSpace(searchtext))
            {
                await context.Response.WriteAsync("[]");
                return;
            }
            var searchtexts = searchtext.ToLower().Split(' ');

            var moives = FSQL.Select<MV_Moive>().ToList();

            foreach (var moive in moives)
            {
                foreach (string jr in searchtexts)
                {
                    if (moive.Tag.ToLower().Contains(jr))
                        moive.RankPoint += 20;
                    if (moive.MovieName.ToLower().Contains(jr))
                        moive.RankPoint += 40;
                    if (moive.Director.ToLower().Contains(jr))
                        moive.RankPoint += 16;
                    if (moive.Performer.ToLower().Contains(jr))
                        moive.RankPoint += 18;
                    if (moive.Type.ToLower().Contains(jr))
                        moive.RankPoint += 30;
                    if (moive.Intor.ToLower().Contains(jr))
                        moive.RankPoint += 2;
                    if (moive.Info.ToLower().Contains(jr))
                        moive.RankPoint += 1;
                }
            }
            await context.Response.WriteAsync(JsonConvert.SerializeObject(moives.Where(x => x.RankPoint > 0).OrderByDescending(x => x.RankPoint).Take(20).ToArray()));
        }
    }
}
