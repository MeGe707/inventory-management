import React, { useEffect, useContext } from 'react'
import { AppContext } from '../Context/AppContext.jsx'


const DeletedItems = () => {
  const { token, deletedItems, setDeletedItems, getDeletedItems } = useContext(AppContext)

  useEffect(() => {
    if (token) {
      getDeletedItems()
    }
  }, [token])

  return (
    <div className='w-full ml-9 max-w-7xl m-5'>
      <p className='mb-3 text-lg font-medium'>Deleted Items</p>

      <div className='bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_2fr_2fr_2fr] py-3 px-6 border-b font-semibold text-gray-700'>
          <p>#</p>
          <p>Item Name</p>
          <p>Qty</p>
          <p>Brand</p>
          <p>Location</p>
          <p>Added By</p>
          <p>Deleted On</p>
        </div>

        {deletedItems.map((item, index) => (
          <div
            key={item._id}
            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_2fr_2fr_2fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>
            <p>{item.name}</p>
            <p className='text-center'>{item.quantity}</p>
            <p>{item.brandName}</p>
            <p>{item.location}</p>
            <p className='text-xs'>{item.addedBy}</p>
            <p className='text-xs'>{item.deletedOn || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeletedItems
