import React from 'react'
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className='sticky acn text-white'>
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
            <div className='hidden md:flex items-center space-x-4'>
                <a href="#" className="hover:text-gray-300">
                    <TbBrandMeta className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-gray-300">
                    <IoLogoInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-gray-300">
                    <RiTwitterXLine className="h-5 w-5" />
                </a>
                <Link to="/message-status/:id" className="text-sm hover:text-gray-300">
  Check Status
</Link>
            </div>
            <div className="text-sm text-center grow">
                <span>We deliver nationwide - Fast and reliable shipping!</span>
            </div>
            <div className="text-sm hidden md:block">
                <a href="tel: +234 813 700 4669" className="hover:text-gray-300">
                    + (234) 813-700-4669
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar