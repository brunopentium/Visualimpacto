import { getAdminUser } from './auth';
import Login from './login';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Home(){
 const user=await getAdminUser();
 if(!user)return <Login/>;
 return <Dashboard/>;
}
