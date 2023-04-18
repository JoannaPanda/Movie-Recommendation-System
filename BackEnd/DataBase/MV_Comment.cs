using FreeSql.DataAnnotations;

namespace UNSoftWare.DataBase
{
    /// <summary>
    /// Comment Table
    /// </summary>
    [Table]
    [Index("Mid", "Mid", IsUnique = false)]
    [Index("Uid", "Uid", IsUnique = false)]
    [Index("Score", "Score", IsUnique = false)]
    public class MV_Comment
    {
        public MV_Comment()
        {
        }

        public MV_Comment(int mid, int uid, byte score, string comment)
        {
            Mid = mid;
            Uid = uid;
            Score = score;
            Comment = comment;
        }

        /// <summary>
        /// Comment ID
        /// </summary>
        [Column(IsPrimary = true, IsIdentity = true)]
        public int Cid { get; set; }

        /// <summary>
        /// Movie ID
        /// </summary>
        [Column]
        public int Mid { get; set; }
        /// <summary>
        /// User ID
        /// </summary>
        [Column]
        public int Uid { get; set; }
        /// <summary>
        /// Score
        /// </summary>
        [Column]
        public byte Score { get; set; }
        /// <summary>
        /// Movie Comment
        /// </summary>
        [Column(DbType = "TEXT", IsNullable = false)]
        public string Comment { get; set; }
        /// <summary>
        /// Like
        /// </summary>
        public int Like { get; set; }
        /// <summary>
        /// DisLike
        /// </summary>
        public int DisLike { get; set; }
        /// <summary>
        /// Weight of Score
        /// </summary>
        public double Weight()
        {
            double tr = Like + DisLike;
            double rs = (Like + 1) / (tr + 1);
            double w = (rs - 0.5) * tr + 1;
            return w >= 0 ? w : 0;
        }
        /// <summary>
        /// Cal Score for comments
        /// </summary>
        public static double CalScore(List<MV_Comment> comments)
        {
            if (comments.Count == 0) return 0;
            double ts = 0;
            double s = 0;
            comments.ForEach(c =>
            {
                double w = c.Weight();
                s += c.Score * w;
                ts += 5 * w;
            });
            double rs = (s + 1) / (ts + 1);
            double r = rs - (rs - 0.5) * Math.Pow(2, -Math.Log10(ts + 1));
            r *= 5;
            if (r < 0) return 0;
            if (r > 5) return 5;
            if (double.IsNaN(r))
            {
                throw new Exception();
            }
            return r;
        }

    }
}
