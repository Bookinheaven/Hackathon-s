const express = require("express");
const router = express.Router();
const Contact = require("../model/contact"); 

router.get("/data", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/update-contact/:contactId", async (req, res) => {
    const contactId = req.params.contactId;
    const updatedData = req.body;

    try {
        const existingContact = await Contact.findOne({ contact_id: contactId });
        if (!existingContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const updatedContact = await Contact.findOneAndUpdate(
            { contact_id: contactId },
            updatedData,
            { new: true }
        );

        res.json({
            message: "Contact updated successfully",
            contact: updatedContact,
        });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ message: "Server error while updating contact" });
    }
});

router.post("/save-contact", async (req, res) => {
    if ("username" in req.body) {
        console.log("❌ Unexpected username field detected! Removing...");
        delete req.body.username;
    }

    try {
        const { first_name, last_name, phone_number, phone_type, custom_type, email, relationship, address, birthday } = req.body;

        if (!first_name) {
            return res.status(400).json({ error: "First name is required!" });
        }

        let formattedBirthday = birthday && birthday !== "N/A" && birthday.trim() !== "" ? new Date(birthday) : null;

        const newContact = new Contact({
            first_name,
            last_name,
            phone_numbers: Array.isArray(phone_number) 
                ? phone_number.map((num, index) => ({
                    type: phone_type[index] || "Unknown", 
                    number: num,
                    custom_type: custom_type || ""
                })) 
                : [], 
            email: email || "",
            relationship: relationship || "",
            address: address || "",
            birthday: formattedBirthday,
        });
        
        await newContact.save();
        res.json({ message: "Contact saved successfully!", contact: newContact });

    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ error: error.message });
    }
});


router.delete("/delete-contact/:contactId", async (req, res) => {
    try {
        const { contactId } = req.params;
        const deletedContact = await Contact.findOneAndDelete({ contact_id: contactId });

        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        
        res.json({ message: "Contact deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/get-contact/:contactId", async (req, res) => {
    try {
        const { contactId } = req.params;
        const getContact = await Contact.findOne({ contact_id: contactId });
        console.log(getContact)
        if (getContact && Object.keys(getContact).length == 0) {
            return res.status(404).json({ message: "Contact not found" });
        }
        
        res.json(getContact); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
