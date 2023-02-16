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
        [Column(DbType = "TEXT")]
        public string Comment { get; set; }
    }
}
