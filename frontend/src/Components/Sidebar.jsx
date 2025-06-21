import React, { useContext } from 'react'

import { NavLink } from 'react-router-dom'
import { AppContext } from '../Context/AppContext.jsx'



const Sidebar = () => {

    const {token} = useContext(AppContext)
 
  return (
    <div className='min-h-screen bg-white border-r'>
          {  
           token && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive}) => `flex ittems-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/dashboard'}>
                    {/* <img src={assets.home_icon} alt="" /> */}
                    <p className="hidden md:block">Dashboard</p>
                </NavLink>

                <NavLink  className={({isActive}) => `flex ittems-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}  to={'/items-list'}>
                    {/* <img src={assets.appointment_icon} alt="" /> */}
                    <p className="hidden md:block">Items List</p>
                </NavLink>

                <NavLink  className={({isActive}) => `flex ittems-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}  to={'/deleted-items'}>
                    {/* <img src={assets.add_icon} alt="" /> */}
                    <p className="hidden md:block">Deleted Items</p>
                </NavLink>

                <NavLink  className={({isActive}) => `flex ittems-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}  to={'/add-item'}>
                    {/* <img src={assets.people_icon} alt="" /> */}
                    <p className="hidden md:block">Add Item</p>
                </NavLink>

                <NavLink  className={({isActive}) => `flex ittems-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}  to={'/add-excel-list'}>
                    {/* <img src={assets.people_icon} alt="" /> */}
                    <p className="hidden md:block">Add Excel</p>
                </NavLink>
            </ul>

        }
        

        
    </div>
  )
}

export default Sidebar