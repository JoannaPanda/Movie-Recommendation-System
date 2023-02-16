using FreeSql.DataAnnotations;
using Newtonsoft.Json;

namespace UNSoftWare.DataBase
{
    /// <summary>
    /// Movie Table
    /// </summary>
    [Table]
    [Index("MovieName", "MovieName", IsUnique = true)]
    [Index("Type", "Type", IsUnique = false)]
    [Index("Tag", "Tag", IsUnique = false)]
    [Index("Director", "Director", IsUnique = false)]
    [Index("PublishDate", "PublishDate", IsUnique = false)]
    public class MV_Moive
    {
        public MV_Moive(string movieName, string intor, string info, string type, string tag, string director,
            string performer, DateTime publishDate, string imagelink, int uPLoaderID)
        {
            MovieName = movieName;
            Intor = intor;
            Info = info;
            Type = type;
            Tag = tag;
            Director = director;
            Performer = performer;
            PublishDate = publishDate;
            UPLoaderID = uPLoaderID;
            ImageLink = imagelink;
        }

        public MV_Moive()
        {
        }

        /// <summary>
        /// Movie ID
        /// </summary>
        [Column(IsPrimary = true, IsIdentity = true)]
        public int Mid { get; set; }
        /// <summary>
        /// Movie Name
        /// </summary>
        [Column(StringLength = 1024, IsNullable = false)]
        public string MovieName { get; set; }

        /// <summary>
        /// Movie Intor
        /// </summary>
        [Column(DbType = "TEXT", IsNullable = false)]
        public string Intor { get; set; }
        /// <summary>
        /// Movie detailed information
        /// </summary>
        [Column(DbType = "LONGTEXT", IsNullable = false)]
        public string Info { get; set; }
        /// <summary>
        /// Movie Type
        /// </summary>
        [Column(StringLength = 256, IsNullable = false)]
        public string Type { get; set; }
        /// <summary>
        /// Movie Tag
        /// </summary>
        [Column(StringLength = 4096, IsNullable = false)]
        [JsonIgnore]
        public string Tag { get; set; }
        /// <summary>
        /// Set Tag
        /// </summary>
        /// <param name="tag">Tag Value</param>
        public void SetTag(List<string> tag) => Tag = string.Join(",", tag);
        /// <summary>
        /// Get Tag
        /// </summary>
        /// <returns>Tag List</returns>
        [Column(IsIgnore = true)]
        public List<string> Tags => Tag.Split(',').ToList();
        /// <summary>
        /// Movie Director Name
        /// </summary>
        [Column(StringLength = 256)]
        public string Director { get; set; }

        /// <summary>
        /// Movie Performer
        /// </summary>
        [Column(StringLength = 4096, IsNullable = false)]
        [JsonIgnore]
        public string Performer { get; set; }
        /// <summary>
        /// Set Performer
        /// </summary>
        /// <param name="Performer">Performer Value</param>
        public void SetPerformer(List<string> performer) => Performer = string.Join(",", performer);
        /// <summary>
        /// Get Performer
        /// </summary>
        /// <returns>Performer List</returns>
        [Column(IsIgnore = true)]
        public List<string> Performers => Performer.Split(',').ToList();

        /// <summary>
        /// Movie Publish Date
        /// </summary>
        [Column]
        public DateTime PublishDate { get; set; }
        /// <summary>
        /// UpLoader User ID
        /// </summary>
        [Column]
        public int UPLoaderID { get; set; }

        /// <summary>
        /// Image Link
        /// </summary>
        [Column]
        public string ImageLink { get; set; }
        /// <summary>
        /// TMP: Point for Rank
        /// </summary>
        [JsonIgnore]
        public int RankPoint = 0;
    }
}
