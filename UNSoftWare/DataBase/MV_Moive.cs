using FreeSql.DataAnnotations;

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
        public MV_Moive(string movieName, string intor, string info, string type, string tag, string director, string performer, DateTime publishDate, int uPLoaderID)
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
        }

        public MV_Moive()
        {
        }

        /// <summary>
        /// Movie ID
        /// </summary>
        [Column(IsPrimary = true, IsIdentity = true)]
        public int Uid { get; set; }
        /// <summary>
        /// Movie Name
        /// </summary>
        [Column(StringLength = 1024)]
        public string MovieName { get; set; }

        /// <summary>
        /// Movie Intor
        /// </summary>
        [Column(DbType = "TEXT")]
        public string Intor { get; set; }
        /// <summary>
        /// Movie detailed information
        /// </summary>
        [Column(DbType = "LONGTEXT")]
        public string Info { get; set; }
        /// <summary>
        /// Movie Type
        /// </summary>
        [Column(StringLength = 256)]
        public string Type { get; set; }
        /// <summary>
        /// Movie Tag
        /// </summary>
        [Column(StringLength = 4096)]
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
        public List<string> GetTag() => Tag.Split(',').ToList();
        /// <summary>
        /// Movie Director Name
        /// </summary>
        [Column(StringLength = 256)]
        public string Director { get; set; }

        /// <summary>
        /// Movie Performer
        /// </summary>
        [Column(StringLength = 4096)]
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
        public List<string> GetPerformer() => Performer.Split(',').ToList();

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
    }
}
