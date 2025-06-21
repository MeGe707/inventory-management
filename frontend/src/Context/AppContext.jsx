import { createContext, useEffect } from "react";
import { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { assets } from '../assets/assets.js'


export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [items, setItems] = useState([])
    const [deletedItems, setDeletedItems] = useState([])
    const [itemData, setItemData] = useState({})

    const getAllItems = async () => {

        try {
            const data = await axios.get("https://inventory-management-2-t8hh.onrender.com/user/get-all-items", {headers:{token}})
            if (data.data.success) {
                setItems(data.data.items)
            
            } else {
                toast.error(data.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

      

    }

    const deleteItem = async (itemId) => {
        try {
            const data = await axios.post('https://inventory-management-2-t8hh.onrender.com/user/delete-item', {itemId}, {headers:{token}})
            if (data.data.success) {
                toast.success(data.data.message)
                getAllItems()
            } else {
                toast.error(data.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDeletedItems = async () => {
        try {
            const data = await axios.get('https://inventory-management-2-t8hh.onrender.com/user/get-deleted-items', {headers:{token}})
            if (data.data.success) {
                setDeletedItems(data.data.items)
              
            }
        } catch (error) {
            toast.error(error.message)
        }y
    }

    const getItem = async (itemId) => {
        console.log(itemId)
        try {
            const data = await axios.post('https://inventory-management-2-t8hh.onrender.com/user/get-item', {itemId}, {headers:{token}})
            if (data.data.success) {
                setItemData(data.data.item)
            } else {
                toast.error(data.data.message)
            }
        } catch (error) {   
            toast.error("yoyoyoy")
            
        }
       

    }

    

    
    const value = {
        assets,
        token,
        setToken,
        items,
        getAllItems,
        setItems,
        deleteItem,
        getDeletedItems,
        setDeletedItems,
        deletedItems,
        itemData,
        setItemData,
        getItem,

    }

    return (
        <AppContext.Provider value={value}> 
            {props.children}
        </AppContext.Provider>
    )

   
}

export default AppContextProvider;