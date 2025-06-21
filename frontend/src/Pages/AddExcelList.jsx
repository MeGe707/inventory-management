import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext.jsx";

const AddExcelList = () => {
  const { token, getAllItems } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  

  const handleUpload = async () => {
    setMessage("");
    setError("");

    if (!file) {
      setError("Lütfen bir Excel dosyası seçin.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/user/upload-excel-items",
        formData,
        {
          headers: {
           token
          },
        }

        
      );

      setMessage(response.data.message || "Yükleme başarılı!");
      getAllItems?.(); // varsa güncelle
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "Bir hata oluştu, lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Excel ile Ürün Yükle</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Excel Yükle
      </button>

      {message && (
        <p className="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 p-2 bg-red-100 text-red-800 rounded text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddExcelList;
