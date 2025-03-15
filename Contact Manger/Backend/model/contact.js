const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); 

const contactSchema = new mongoose.Schema({
    contact_id: { type: String, unique: true, default: uuidv4 }, 
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    phone_numbers: [
        {
            type: { type: String, enum: ["personal", "work", "other", "custom"], required: false },
            number: { type: String, required: true },
            custom_type: { type: String }
        }
    ],
    email: { type: String },
    relationship: { type: String },
    address: { type: String },
    birthday: { type: Date },
    note: { type: String },
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
