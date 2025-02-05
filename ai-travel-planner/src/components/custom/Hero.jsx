import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';


function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-5'>
      <h2 className='font-extrabold text-[55px] text-center mt-16'>
        <span className='text-[#b91c1c]'>Discover your Next Travel Destination:</span> AI enhanced Personalized Itineraries </h2>
        <p className='font-medium text-center text-[20px] text-[#57534e]'>Plan smarter, travel better—your AI-powered trip companion.</p>
        <Link to={'/create-trip'}>
        <Button>Get Started</Button>
        </Link>
        <img 
        src="images/herosectionintro.jpg" 
        alt="Travel Destination" 
        className="m-6 rounded-lg shadow-lg w-[800px] h-auto"
      />
    </div>
  )
}

export default Hero
