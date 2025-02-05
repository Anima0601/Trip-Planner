import React from 'react'
import { Button } from '../ui/button'
const Header = () => {
  return (
    <div>
       <div className="flex flex-row justify-between items-center m-4">  
      <h2 className='font-extralight text-2xl p-2'>Project Planner</h2>
      <Button>Sign in</Button>
     </div>
    </div>
  )
}

export default Header
