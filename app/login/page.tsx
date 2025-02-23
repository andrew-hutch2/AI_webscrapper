"use client"
import React, { useState } from 'react'
import {login} from './actions'
import {signup} from './actions'

const Login = () => {
  const [islogin, setLogin] = useState(true)
  return (
    // Login page
    islogin ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className='description text-center'>
        <h1 className="text-3xl font-bold mb-4 text-5xl">Log In</h1>
        <p className="text-center">this is a lengthy description of the website</p>
      </div>
      <form className='form'>
          <label htmlFor="email">Email:</label>
          <input className="login-input" id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input className="login-input" id="password" name="password" type="password" required />
          <button className="loginbtn" formAction={login}>Log in</button>
      </form>
      <p className='mt-5'> Don't have an account? <button onClick={()=>setLogin(false)} className='link bg-gray-900'>Create an account here</button></p>
      
    </div>) : 
    // Sign up page
    (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className=' text-center description'>
        <h1 className="text-3xl font-bold mb-4 text-5xl">Sign Up</h1>
        <p className="text-center">this is a lengthy description of the website </p>
      </div>
      
      <form className='form'>
          
          <label htmlFor="email">Email:</label>
          <input className="login-input" id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input className="login-input" id="password" name="password" type="password" required />
          <button className="loginbtn" formAction={signup}>Sign Up</button>
          {/* <button formAction={signup}>Sign up</button> */}
      </form>
      <p className='mt-5'> Have an account already? <button onClick={()=>setLogin(true)} className='link bg-gray-900'> Sign in here</button></p>
        {/* <p>A magic link allows you to login without entering a password by authentication through a confirmation email</p> */}
    </div>
    )
  )
}

export default Login