import userModel from "../models/userModel.js";
import itemModel from "../models/itemModel.js";
import deletedItemModel from "../models/deletedItemModel.js";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";

import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    if (!name || !email || !password || !phone || !department) {
      return res.json({
        success: false,
        message: "Lütfen tüm alanları doldurunuz",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const userData = {
      name,
      email,
      password,
      phone,
      department,
    };

    const newUser = new userModel(userData);
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcılar alınırken bir hata oluştu: " + error.message,
    });
  }
};

export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Lütfen tüm alanları doldurunuz",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Şifre yanlış" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: "Giriş başarılı",
      token: token,
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Kullanıcı ID'si bulunamadı" });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    res.json({ success: true, userData: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, serialNumber, brandName, quantity, location, price, description } =
      req.body;
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("name");



    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }
    const userName = user.name;

    const now = new Date();

    const formatted = now.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemData = {
      name,
      serialNumber,
      brandName,
      quantity,
      location,
      price, // fiyatı ekledik
      addedOn: formatted,
      addedBy: userName,
      lastUpdatedOn: formatted,
      lastUpdatedBy: userName,
      allUpdates: [
        {
          updatedBy: userName,
          updatedAt: formatted,
        },
      ],
      description,
    };

    const newItem = new itemModel(itemData);
    await newItem.save();

    res.json({
      success: true,
      message: "Item added successfully",
      userId,
      userName,
      formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("name");
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Kullanıcı bulunamadı" });
  }

  const itemId = req.body.itemId;
  const item = await itemModel.findById(itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item bulunamadı" });
  }

  const now = new Date();

  const formatted = now.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  await item.deleteOne();

  const deletedItem = new deletedItemModel({
    ...item.toObject(),
    deletedOn: formatted,
    deletedBy: user.name,
    isDeleted: true,
  });

  await deletedItem.save();

  res.json({ success: true, message: "Item deleted successfully" });
};

export const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find().sort({ addedOn: -1 }); // en son eklenen en üstte

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    console.error("getAllItems error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching items.",
    });
  }
};

export const getDeletedItems = async (req, res) => {
  try {
    const deletedItems = await deletedItemModel
      .find({ isDeleted: true })
      .sort({ deletedOn: -1 });

    res.status(200).json({
      success: true,
      items: deletedItems,
    });
  } catch (error) {
    console.error("getDeletedItems error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching deleted items.",
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const itemId = req.body.itemId;
    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const itemData = {
      id: item._id,
      name: item.name,
      serialNumber: item.serialNumber,
      brandName: item.brandName,
      quantity: item.quantity,
      location: item.location,
      price: item.price, // fiyatı ekledik
      addedOn: item.addedOn,
      addedBy: item.addedBy,
      lastUpdatedOn: item.lastUpdatedOn,
      lastUpdatedBy: item.lastUpdatedBy,
      allUpdates: item.allUpdates,
      description: item.description || "", // yeni alan
    };

    res.json({ success: true, item: itemData });
  } catch (error) {
    console.error("getItem error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching item." });
  }
};

export const updateItem = async (req, res) => {
  try {
    const {
      itemId,
      name,
      serialNumber,
      brandName,
      location,
      quantity,
      description,
    } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("name");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    const item = await itemModel.findById(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item bulunamadı" });
    }

    const now = new Date();

    const formatted = now.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formData = {
      name,
      serialNumber,
      brandName,
      quantity,
      location,
      lastUpdatedOn: formatted,
      lastUpdatedBy: user.name,
      allUpdates: [
        ...item.allUpdates,
        {
          updatedBy: user.name,
          updatedAt: formatted,
        },
      ],
      description: description || item.description,
    };

    await itemModel.findByIdAndUpdate(itemId, formData, { new: true });

    res.json({
      success: true,
      message: "Item updated successfully",
      userId,
      userName: user.name,
    });
  } catch (err) {
    console.error("updateItem error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error while updating item." });
  }
};

// export const uploadExcelItems = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const user = await userModel.findById(userId).select("name");
  
//       if (!user) {
//         return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
//       }
  
//       const now = new Date();
//       const formatted = now.toLocaleString('tr-TR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
  
//       const workbook = xlsx.readFile(req.file.path);
//       const sheetName = workbook.SheetNames[0];
//       const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
//         defval: "", // boşlar için "" koy
//       });

      
  
//       // 🔍 Başlıklar Excel'de Türkçe ve boşluklu → temizleyelim
//       const itemsToInsert = rawRows.map((row) => {
//         const name = row["Item Name"]?.toString().trim();
//         const serialNumber = row["Serial Number"]?.toString().trim();
//         const brandName = row["Brand Name"]?.toString().trim();
//         const quantity = parseInt(row["Quantity"]) || 0;
//         const location = row["Location"]?.toString().trim();
//         const description = row["Description"]?.toString().trim();
  
//         return {
//           name,
//           serialNumber,
//           brandName,
//           quantity,
//           location,
//           description,
//           addedOn: formatted,
//           addedBy: user.name,
//           lastUpdatedOn: formatted,
//           lastUpdatedBy: user.name,
//           allUpdates: [{
//             updatedBy: user.name,
//             updatedAt: formatted
//           }]
//         };
//       });
  
//       // 🔐 Eksik alan varsa hata almamak için filtrele (gerekirse)
//       const validItems = itemsToInsert.filter(item =>
//         item.name && item.serialNumber && item.brandName && item.location
//       );
  
//       if (validItems.length === 0) {
//         return res.status(400).json({ success: false, message: "Excel verisi geçerli item içermiyor." });
//       }
  
//       await itemModel.insertMany(validItems);
//       fs.unlinkSync(req.file.path); // geçici dosyayı sil
  
//       res.status(200).json({ success: true, message: `${validItems.length} item başarıyla eklendi!` });

   
//     } catch (error) {
//       console.error("uploadExcelItems error:", error);
//       res.status(500).json({ success: false, message: "Server error while uploading Excel items." });
//     }
//   };
  

export const uploadExcelItems = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await userModel.findById(userId).select("name");
  
      if (!user) {
        return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
      }
  
      const now = new Date();
      const formatted = now.toLocaleString("tr-TR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  
      // Excel dosyasını oku
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "", // boş hücreler için
      });
  
      // Dosyayı temizle
      fs.unlinkSync(req.file.path);
  
      // Başlıkları normalize et ve itemları hazırla
      const itemsToInsert = rows.map((row) => {
        const normalized = {};
        Object.keys(row).forEach((key) => {
          const cleanKey = key.toLowerCase().replace(/\s+/g, "");
          normalized[cleanKey] = row[key];
        });
  
        return {
          name: normalized["itemname"]?.toString().trim(),
          serialNumber: normalized["serialnumber"]?.toString().trim(),
          brandName: normalized["brandname"]?.toString().trim(),
          quantity: parseInt(normalized["quantity"]) || 0,
          location: normalized["location"]?.toString().trim(),
          description: normalized["description"]?.toString().trim(),
          price: parseFloat(normalized["price"]) || 0, // fiyatı ekledik
          addedOn: formatted,
          addedBy: user.name,
          lastUpdatedOn: formatted,
          lastUpdatedBy: user.name,
          allUpdates: [
            {
              updatedBy: user.name,
              updatedAt: formatted,
            },
          ],
        };
      });
  
      // Boş gelenleri ayıkla
      const validItems = itemsToInsert.filter(
        (item) =>
          item.name &&
          item.serialNumber &&
          item.brandName &&
          item.location
      );
  
      if (validItems.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Excel verisi geçerli item içermiyor." });
      }
  
      await itemModel.insertMany(validItems);
  
      res.json({
        success: true,
        message: `${validItems.length} item başarıyla eklendi!`,
      });
    } catch (error) {
      console.error("uploadExcelItems error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error while uploading Excel items." });
    }
  };    