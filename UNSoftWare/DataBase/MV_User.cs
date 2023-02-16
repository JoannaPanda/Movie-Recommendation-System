﻿using FreeSql.DataAnnotations;
using LinePutScript;
using Newtonsoft.Json;

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
        [Column(StringLength = 255, IsNullable = false)]
        public string UserName { get; set; }
        /// <summary>
        /// User Email
        /// </summary>
        [Column(StringLength = 255, IsNullable = false)]
        public string Email { get; set; }
        /// <summary>
        /// Preference model
        /// </summary>
        [Column(DbType = "TEXT", IsNullable = false)]
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
        [JsonIgnore]
        public long Password { get; set; }
        /// <summary>
        /// User Exp
        /// </summary>
        [Column]
        public int Exp { get; set; } = 0;
        /// <summary>
        /// Movie Wishlist
        /// </summary>
        [Column(StringLength = 4096, IsNullable = false)]
        public string Wishlist { get; set; } = "";
        /// <summary>
        /// Set Wishlist
        /// </summary>
        /// <param name="Wishlist">Wishlist</param>
        public void SetWishlist(List<int> wishlist) => Wishlist = string.Join(",", wishlist);
        /// <summary>
        /// Get Wishlist
        /// </summary>
        /// <returns>Wishlist List</returns>
        public List<int> GetWishlist()
        {
            var list = new List<int>();
            if (Wishlist != "")
                foreach (var wish in Wishlist.Split(','))
                    list.Add(int.Parse(wish));
            return list;
        }

        /// <summary>
        /// User Banlist
        /// </summary>
        [Column(StringLength = 4096, IsNullable = false)]
        public string Banlist { get; set; } = "";
        /// <summary>
        /// Set Banlist
        /// </summary>
        /// <param name="Banlist">Banlist</param>
        public void SetBanlist(List<int> banlist) => Banlist = string.Join(",", banlist);
        /// <summary>
        /// Get Banlist
        /// </summary>
        /// <returns>Banlist List</returns>
        public List<int> GetBanlist()
        {
            var list = new List<int>();
            if (Banlist != "")
                foreach (var wish in Banlist.Split(','))
                    list.Add(int.Parse(wish));
            return list;
        }
    }
}
