"use client"
import Nav from "./components/Nav";
/* import "./home.css"; */
import Main from "./components/main";

export default function Homepage() {
  return (
    <div className="nav-main-container bg-gray-900">
      <Nav/>
      <div className='main-container'><Main/></div>
    </div>
  )
}