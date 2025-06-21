import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';

const AddItem = () => {
  const { token } = useContext(AppContext);

  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [brandName, setBrandName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(1);
  const [description, setDescription] = useState('');
 
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const itemData = {
        name,
        serialNumber,
        brandName,
        quantity,
        location,
        price,
        description
      };

      const { data } = await axios.post('https://inventory-management-2-t8hh.onrender.com/user/add-item', itemData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setName('');
        setSerialNumber('');
        setBrandName('');
        setQuantity(0);
        setLocation('');
        setPrice(0);
        setDescription('');
       
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while adding item.');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full max-w-7xl'>
      <p className='mb-3 text-lg font-medium'>Add Item</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-3xl'>

        <div className='flex flex-col gap-4'>

          <input type='text' placeholder='Item Name' className='border rounded px-3 py-2' value={name} onChange={(e) => setName(e.target.value)} required />

          <input type='text' placeholder='Serial Number' className='border rounded px-3 py-2' value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />

          <input type='text' placeholder='Brand Name' className='border rounded px-3 py-2' value={brandName} onChange={(e) => setBrandName(e.target.value)} required />

          <input type='number' placeholder='Quantity' className='border rounded px-3 py-2' value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />

          <input type='text' placeholder='Location' className='border rounded px-3 py-2' value={location} onChange={(e) => setLocation(e.target.value)} required />

          <input type='number' placeholder='Price' className='border rounded px-3 py-2' value={price} onChange={(e) => setPrice(e.target.value)} min="1" required />

          <input type='text' placeholder='Description' className='border rounded px-3 py-2' value={description} onChange={(e) => setDescription(e.target.value)} required />


         

          <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Item</button>

        </div>
      </div>
    </form>
  );
};

export default AddItem;
