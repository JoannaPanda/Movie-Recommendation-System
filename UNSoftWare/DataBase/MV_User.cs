using FreeSql.DataAnnotations;
using LinePutScript;

namespace UNSoftWare.DataBase
{
    /// <summary>
    /// User Table
    /// </summary>
    [Table]
    [Index("UserName", "UserName", IsUnique = false)]
    [Index("Email", "Email", IsUnique = true)]
    public class MV_User
    {
        /// <summary>
        /// Create New User
        /// </summary>
        public MV_User(string userName, string email, string password)
        {
            UserName = userName;
            Email = email;
            Password = Sub.GetHashCode(password);
        }

        public MV_User()
        {
        }

        /// <summary>
        /// User ID
        /// </summary>
        [Column(IsPrimary = true, IsIdentity = true)]
        public int Uid { get; set; }
        /// <summary>
        /// User Name
        /// </summary>
        [Column(StringLength = 255)]
        public string UserName { get; set; }
        /// <summary>
        /// User Email
        /// </summary>
        [Column(StringLength = 255)]
        public string Email { get; set; }
        /// <summary>
        /// Preference model
        /// </summary>
        [Column(DbType = "TEXT")]
        public string PreferenceModel { get; set; } = "";
        /// <summary>
        /// Get Preference model Line
        /// </summary>
        public Line GetPreferenceModel() => new Line(PreferenceModel);
        /// <summary>
        /// Set Preference model Line
        /// </summary>
        public void SetPreferenceModel(Line line) => PreferenceModel = line.ToString();
        /// <summary>
        /// User Password
        /// </summary>
        [Column]
        public long Password { get; set; }
        /// <summary>
        /// User Exp
        /// </summary>
        [Column]
        public int Exp { get; set; } = 0;

    }
}
