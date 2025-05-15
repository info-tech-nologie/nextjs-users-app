// app/users/page.tsx
import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  image: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {users.map((user, index) => (
        <div key={index}>
          <p>{user.name} - {user.email}</p>
          <img src={user.image} width="100" alt={user.name} />
        </div>
      ))}
    </div>
  );
}
