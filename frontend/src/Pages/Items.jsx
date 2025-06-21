import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext.jsx";
import ItemModal from "../Components/ItemModal.jsx";
import * as XLSX from "xlsx";

export default function AllItems() {
  const { token, getAllItems, items, deleteItem } = useContext(AppContext);

  const [searchField, setSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (token) getAllItems();
  }, [token, getAllItems]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return setFilteredItems(items);
    setFilteredItems(
      items.filter((item) => {
        const val = String(item[searchField] || "").toLowerCase();
        return val.includes(q);
      })
    );
  }, [items, searchField, searchQuery]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item._id));
    }
  };

  const handleExport = () => {
    const selectedItems = items.filter((item) =>
      selectedIds.includes(item._id)
    );
    const data = selectedItems.map(
      ({ name, serialNumber, brandName, quantity, location, description }) => ({
        "Item Name": name,
        "Serial Number": serialNumber,
        "Brand Name": brandName,
        Quantity: quantity,
        Location: location,
        Description: description,
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedItems");
    XLSX.writeFile(workbook, "selected_items.xlsx");
  };

  return (
    <div className="w-full ml-9 max-w-7xl m-5">
      <p className="mb-3 text-lg font-medium">All Items</p>

      <div className="flex items-center gap-2 mb-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="name">Name</option>
          <option value="serialNumber">Serial Number</option>
          <option value="addedBy">Added By</option>
          <option value="lastUpdatedBy">Last Updated By</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="flex-1 border rounded px-3 py-2"
        />

        {selectedIds.length > 0 && (
          <div className="">
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Excel Çıktısı Al
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:grid grid-cols-[0.5fr_0.5fr_3fr_1fr_2fr_2fr_2fr_2fr_1fr] py-3 px-6 border-b font-semibold text-gray-700">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleSelectAll}
        />
        <p>#</p>
        <p>Item Name</p>
        <p>Qty</p>
        <p>Brand</p>
        <p>Location</p>
        <p>Added By</p>
        <p>Last Updated</p>
        <p>Actions</p>
      </div>

      <div className="bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {filteredItems.map((item, index) => (
          <div
            key={item._id}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_0.5fr_3fr_1fr_2fr_2fr_2fr_2fr_1fr] items-center cursor-pointer text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => toggleSelectItem(item._id)}
            />
            <p className="max-sm:hidden">{index + 1}</p>
            <p onClick={() => handleItemClick(item)}>{item.name}</p>
            <p className="text-center" onClick={() => handleItemClick(item)}>
              {item.quantity}
            </p>
            <p onClick={() => handleItemClick(item)}>{item.brandName}</p>
            <p onClick={() => handleItemClick(item)}>{item.location}</p>
            <p className="text-xs" onClick={() => handleItemClick(item)}>
              {item.addedBy}
            </p>
            <p className="text-xs" onClick={() => handleItemClick(item)}>
              {item.lastUpdatedOn || "—"}
            </p>
            <div className="flex gap-2 items-center justify-end">
              <button
                type="button"
                onClick={() => deleteItem(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 p-4">
            No items match your search.
          </p>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <ItemModal itemId={selectedItem._id} onClose={closeModal} />
      )}
    </div>
  );
}
