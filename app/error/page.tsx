import Link from 'next/link'
import React from 'react'

function ErrorPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'> 
      <h1>Sorry, something went wrong </h1>
      <p> Return to <Link className="link" href={"/"}> homepage</Link> and retry</p>
    </div>
  )
}

export default ErrorPage