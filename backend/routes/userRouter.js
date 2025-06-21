import express from "express"
import multer from "multer";
import {
  addItem,
  deleteItem,
  getAllItems,
  getAllUsers,
  getDeletedItems,
  getItem,
  getUProfile,
  logInUser,
  registerUser,
  updateItem,
  uploadExcelItems
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();
const upload = multer({ dest: 'uploads/' }); // dosya geçici buraya kaydedilir

userRouter.post('/register-user', registerUser)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.post('/login-user', logInUser)
userRouter.post('/add-item', authUser, addItem)
userRouter.post('/delete-item', authUser, deleteItem)
userRouter.get('/get-profile', authUser, getUProfile)
userRouter.get('/get-all-items', authUser, getAllItems)
userRouter.get('/get-deleted-items', authUser, getDeletedItems)
userRouter.post('/get-item', authUser, getItem)
userRouter.post('/update-item', authUser, updateItem)

// 📌 BURASI ÖNEMLİ: multer middleware eklendi
userRouter.post('/upload-excel-items', authUser, upload.single("file"), uploadExcelItems)

export default userRouter;
