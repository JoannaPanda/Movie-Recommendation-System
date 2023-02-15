using FreeSql.DataAnnotations;

namespace UNSoftWare
{
    public class MV_User
    {
        /// <summary>
        /// User Name
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
    }
}
