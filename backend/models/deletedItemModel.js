import mongoose from "mongoose";

const deletedItemSchema = new mongoose.Schema({
    name: String,
    serialNumber: String,
    brandName: String,
    quantity: Number,
    location: String,
    price: Number,
    addedOn: String,
    addedBy: String,
    lastUpdatedOn: String,
    lastUpdatedBy: String,
    allUpdates: Array,
    deletedOn: { type: String},
    deletedBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
});

const deletedItemModel = mongoose.models.deletedItem || mongoose.model('deletedItem', deletedItemSchema)
export default deletedItemModel