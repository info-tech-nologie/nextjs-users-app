// app/api/user/route.ts
import { getUsers } from '../../../lib/db';

export async function GET() {
  const users = await getUsers();
  return new Response(JSON.stringify(users), {
    status: 200,
  });
}
