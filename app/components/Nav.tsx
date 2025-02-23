"use client"
import { logout } from './functions'
import "../styles/nav.css"
const Nav = () => {

  
  return (
    <nav className='bg-gray-900'>
        <p>Previous Chats</p>
        <button className="logout" onClick={()=>logout()}>Logout</button>
    </nav>
  )
}

export default Nav