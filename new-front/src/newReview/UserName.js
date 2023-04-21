import React, { useState, useEffect } from 'react';

function UserName({ uid }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [uid]);

  async function fetchUserData() {
    const response = await fetch(`http://lbosau.exlb.org:9900/User/Info?Uid=${uid}`);
    const data = await response.json();
    setUserName(data.UserName); 
  }

  return <p>{userName || "Tonia"}</p>;
}

export default UserName;