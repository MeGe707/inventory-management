import { useState } from 'react'

import './App.css'
import Login from './Pages/Login.jsx'
import { Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer, toast} from 'react-toastify'
import Sidebar from './Components/Sidebar.jsx'
import Navbar from './Components/Navbar.jsx'
import ProtectedRoute from './Context/ProtectedRoute.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Items from './Pages/Items.jsx'
import DeletedItems from './Pages/DeletedItems.jsx'
import AddItem from './Pages/AddItem.jsx'
import AddExcelList from './Pages/AddExcelList.jsx'

function App() {


  return (
    <>
      <ToastContainer/>
      
      <Navbar></Navbar>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
              <Route path='/items-list' element={<Items/>}></Route>
              <Route path='/deleted-items' element={<DeletedItems/>}></Route>
              <Route path='/add-item' element={<AddItem/>}></Route>
              <Route path='/add-excel-list' element={<AddExcelList/>}></Route>
            </Routes>
          </ProtectedRoute>

          
          } />
        </Routes>
      </div>


      {/* <Navbar></Navbar>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
        
        <Route path="/login" element={<Login />} />

      </Routes>
      </div> */}
    </>
  )
}

export default App
