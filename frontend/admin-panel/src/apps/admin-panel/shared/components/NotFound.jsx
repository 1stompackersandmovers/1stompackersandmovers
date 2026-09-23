import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
    <div>
      <p>404 not found</p>
      <Link to="/">Go to Dashbord</Link>
    </div>
  )
}

export default NotFound
