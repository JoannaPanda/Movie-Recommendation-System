using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
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
            var movie = new MV_Moive(form["name"], form["info"], form["type"], ((string)form["tag"]).Replace(", ", ","), form["director"],
                 ((string)form["performer"]).Replace(", ", ","), Convert.ToDateTime(form["publishdate"]), usr.Uid);
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
                await context.Response.WriteAsync(JsonConvert.SerializeObject(FSQL.Select<MV_Moive>().OrderBy("rand()").Limit(20).ToList().ToArray()));
            }
            else
            {
                var moives = FSQL.Select<MV_Moive>().ToList();

                foreach (var moive in moives)
                {
                    foreach (var jr in usr.PreferenceModels)
                    {
                        if (moive.Tag.ToLower().Contains(jr.Key) || moive.Performer.ToLower().Contains(jr.Key)
                            || moive.Director.ToLower() == jr.Key || moive.Type.ToLower() == jr.Key)
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
                        pm[movie.Type.ToLower()] = pm.GetValueOrDefault(movie.Type.ToLower()) + 1;
                        pm[movie.Director.ToLower()] = pm.GetValueOrDefault(movie.Director.ToLower()) + 1;
                        foreach (string tag in movie.Tags)
                            pm[tag.ToLower()] = pm.GetValueOrDefault(tag.ToLower()) + 1;
                        foreach (string per in movie.Performers)
                            pm[per.ToLower()] = pm.GetValueOrDefault(per.ToLower()) + 1;
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
        /// Get Movie Recommend for Movie
        /// </summary>
        public static async void RecommendforMovie(HttpContext context)
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
                    var recom = FSQL.Select<MV_Moive>()
                        .Where(a => a.Type == movie.Type || a.Director == movie.Director || movie.Tags.Any(y => a.Tag.Contains(y))).ToList();
                    recom.RemoveAll(x => x.Mid == mid);

                    await context.Response.WriteAsync(JsonConvert.SerializeObject(recom.ToArray()));
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
                        moive.RankPoint += 5;
                    if (moive.MovieName.ToLower().Contains(jr))
                        moive.RankPoint += 20;
                    if (moive.Director.ToLower().Contains(jr))
                        moive.RankPoint += 4;
                    if (moive.Performer.ToLower().Contains(jr))
                        moive.RankPoint += 6;
                    if (moive.Type.ToLower().Contains(jr))
                        moive.RankPoint += 15;
                    //if (moive.Intor.ToLower().Contains(jr))
                    //    moive.RankPoint += 2;
                    if (moive.Info.ToLower().Contains(jr))
                        moive.RankPoint += 1;
                }
            }
            await context.Response.WriteAsync(JsonConvert.SerializeObject(moives.Where(x => x.RankPoint > 0).OrderByDescending(x => x.RankPoint).Take(20).ToArray()));
        }

        /// <summary>
        /// List Movie Order By
        /// </summary>
        public static async void ListOrder(HttpContext context)
        {
            var moviesql = FSQL.Select<MV_Moive>();
            //moviesql.OrderBy(x => x.MovieName);
            if (bool.TryParse(context.Request.Query["desc"], out bool desc) && desc)
                switch (context.Request.Query["orderby"])
                {
                    case "WishListCount":
                        moviesql.OrderByDescending(x => x.WishListCount);
                        break;
                    case "PublishDate":
                        moviesql.OrderByDescending(x => x.PublishDate);
                        break;
                    case "Score":
                        moviesql.OrderByDescending(x => x.Score);
                        break;
                    default:
                        moviesql.OrderByDescending(x => x.MovieName);
                        break;
                }
            else
                switch (context.Request.Query["orderby"])
                {
                    case "WishListCount":
                        moviesql.OrderBy(x => x.WishListCount);
                        break;
                    case "PublishDate":
                        moviesql.OrderBy(x => x.PublishDate);
                        break;
                    case "Score":
                        moviesql.OrderBy(x => x.Score);
                        break;
                    default:
                        moviesql.OrderBy(x => x.MovieName);
                        break;
                }
            if (int.TryParse(context.Request.Query["limit"], out int limit))
            {
                moviesql.Limit(limit);
            }
            var mvs = moviesql.ToList().OrderBy(x => x.MovieName);
            if (desc)
                switch (context.Request.Query["orderby"])
                {
                    case "WishListCount":
                        mvs = mvs.OrderByDescending(x => x.WishListCount);
                        break;
                    case "PublishDate":
                        mvs = mvs.OrderByDescending(x => x.PublishDate);
                        break;
                    case "Score":
                        mvs = mvs.OrderByDescending(x => x.Score);
                        break;
                    default:
                        mvs = mvs.OrderByDescending(x => x.MovieName);
                        break;
                }
            else
                switch (context.Request.Query["orderby"])
                {
                    case "WishListCount":
                        mvs = mvs.OrderBy(x => x.WishListCount);
                        break;
                    case "PublishDate":
                        mvs = mvs.OrderBy(x => x.PublishDate);
                        break;
                    case "Score":
                        mvs = mvs.OrderBy(x => x.Score);
                        break;
                    default:
                        mvs = mvs.OrderBy(x => x.MovieName);
                        break;
                }
            await context.Response.WriteAsync(JsonConvert.SerializeObject(mvs.ToArray()));
        }
    }
}
