"use server"
import Nav from "./components/Nav";
/* import "./home.css"; */
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Main from "./components/main";

export default async function homepage() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
      redirect('/login')
    }
    
  return (
      <div className="nav-main-container bg-gray-900">
      <Nav/>
      <div className='main-container'><Main/></div>
      </div>
)
}