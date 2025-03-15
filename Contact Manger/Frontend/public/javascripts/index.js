window.onload = function () {
    document.getElementById("loading-screen").classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("splash-screen").style.opacity = "0";

        setTimeout(() => {
            document.getElementById("splash-screen").style.display = "none";
        }, 1000);
    }, 5000);
    const saveForm = document.getElementById("save-form");
    const contactTableBody = document.getElementById("contact-list-data");
    const noContactsMessage = document.getElementById("no-contacts");
    const searchInput = document.getElementById("search");
    const clearSearch = document.getElementById("clear-search")
   
    document.getElementById("add-contact").addEventListener("click", () => toggleModal(true));
    document.getElementById("cancel-dialog").addEventListener("click", () => toggleModal(false));

    function toggleModal(show) {
        const modalOverlay = document.getElementById("modal-overlay");
        const dialogBox = document.getElementById("center-panel");
        const saveForm = document.getElementById("save-form");
    
        if (!show) {
            saveForm.reset();
    
            const hideElement = (id) => {
                const element = document.getElementById(id);
                if (element && !element.classList.contains("hidden")) {
                    element.classList.add("hidden");
                }
            };
    
            hideElement("email");
            hideElement("relationship");
            hideElement("address-section");
            hideElement("birthday-section");
            hideElement("user_note");
    
            const phoneSection = document.getElementById("phone-section");
            phoneSection.innerHTML = `
                <div class="phone-entry">
                    <select name="phone-type" class="phone-type">
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="text" name="custom-type" class="custom-type hidden" placeholder="Enter Custom Type" autocomplete="off">
                    <input type="number" name="phone-number" placeholder="Phone Number" autocomplete="off" spellcheck="false" required>
                    <button type="button" class="remove-phone">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>            
                    </button>
                </div>
            `;
        } else {
            if (document.getElementById("email").value) {
                document.getElementById("email").classList.remove("hidden");
            }
            if (document.getElementById("relationship").value) {
                document.getElementById("relationship").classList.remove("hidden");
            }
            if (document.getElementById("address-section").value) {
                document.getElementById("address-section").classList.remove("hidden");
            }
            if (document.getElementById("birthday").value) {
                document.getElementById("birthday-section").classList.remove("hidden");
            }
        }
    
        modalOverlay.style.display = show ? "block" : "none";
        dialogBox.classList.toggle("hidden", !show);
    }    

    document.getElementById("add-phone").addEventListener("click", () => {
        const phoneSection = document.getElementById("phone-section");
        phoneSection.insertAdjacentHTML(
            "beforeend",
            `<div class="phone-entry">
                <select name="phone-type" class="phone-type">
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                    <option value="custom">Custom</option>
                </select>
                <input type="text" name="custom-type" class="custom-type hidden" placeholder="Enter Custom Type" autocomplete="off">
                <input type="number" name="phone-number" placeholder="Phone Number" autocomplete="off" required>
                    <button type="button" class="remove-phone">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>            
                    </div>`
        );
    });

    document.getElementById("phone-section").addEventListener("click", (e) => {
        const button = e.target.closest(".remove-phone");
        if (button) {
            const phoneEntries = document.querySelectorAll(".phone-entry"); 
            if (phoneEntries.length > 1) {
                button.parentElement.remove(); 
            }
        }
    });
    const toggleButtons = {
        "show_email_option": "email",
        "show_relationship_option": "relationship",
        "show_address_option": "address-section",
        "show_birthday_option": "birthday-section",
        "show_note_option": "user_note"
    };
    
    Object.entries(toggleButtons).forEach(([buttonId, elementId]) => {
        document.getElementById(buttonId).addEventListener("click", () => {
            const element = document.getElementById(elementId);
            element.classList.toggle("hidden");
    
            let inputField;
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                inputField = element; 
            } else {
                inputField = element.querySelector("input, textarea");
            }
            if (inputField && inputField.value.trim() === "") {
                element.classList.add("hidden");
            }
            console.log(inputField.value.trim() === "")
        });
    });
    
    Object.values(toggleButtons).forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;
    
        let inputField;
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
            inputField = element;
        } else {
            inputField = element.querySelector("input, textarea");
        }
    
        if (!inputField) return;
    
        inputField.addEventListener("blur", () => {
            if (inputField.value.trim() === "") {
                element.classList.add("hidden");
            }
        });
    });
    
    const birthdaySection = document.getElementById("birthday-section");
    if (birthdaySection) {
        const birthdayInput = document.getElementById("birthday");
        birthdayInput.addEventListener("blur", () => {
            if (birthdayInput.value.trim() === "") {
                birthdaySection.classList.add("hidden");
            }
        });
    }
    
    saveForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const formData = new FormData(this);
        const jsonData = {};
        let isValid = true;
        let errorMessage = "";
        let phoneNumbers = [];
    
        formData.forEach((value, key) => {
            const formattedKey = key.replace(/-/g, "_");
            let trimmedValue = value.trim();
            const inputElement = document.querySelector(`[name="${key}"]`);
            if (trimmedValue.toUpperCase() === "N/A") {
                trimmedValue = "";
                if (inputElement && !inputElement.classList.contains("hidden")) {
                    inputElement.classList.add("hidden");
                }
            }    
            if (inputElement && inputElement.dataset.originalValue === trimmedValue) {
                return;
            }
            if (formattedKey === "first_name" && !trimmedValue) {
                isValid = false;
                errorMessage += "First name is required.\n";
            }
    
            if (formattedKey === "phone_number") {
                if (!trimmedValue) {
                    if (phoneNumbers.length === 0) { 
                        isValid = false;
                        errorMessage += "At least one phone number is required.\n";
                    }
                } else if (!/^\d{10}$/.test(trimmedValue)) {
                    isValid = false;
                    errorMessage += "Invalid phone number. It must be 10 digits.\n";
                }
                phoneNumbers.push(trimmedValue);
            }
    
            if (formattedKey === "email" && trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
                isValid = false;
                errorMessage += "Invalid email format.\n";
            }
    
            if (formattedKey === "phone_number" || formattedKey === "phone_type") {
                if (!jsonData[formattedKey]) {
                    jsonData[formattedKey] = [];
                }
                jsonData[formattedKey].push(trimmedValue);
            } else {
                jsonData[formattedKey] = jsonData[formattedKey] ? [...jsonData[formattedKey], trimmedValue] : trimmedValue;
            }
        });
    
        if (!isValid) {
            alert(errorMessage);
            return;
        }
    
        const contactId = document.getElementById("contact-id").value;
    
        if (Object.keys(jsonData).length === 0) {
            alert("No changes detected.");
            return;
        }
    
        try {
            const response = await fetch(contactId ? `/contacts/update-contact/${contactId}` : "/contacts/save-contact", {
                method: contactId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });
    
            const result = await response.json();
            alert(result.message);
            fetchContacts();
            toggleModal(false);
        } catch (error) {
            console.error("Error saving contact:", error);
        }
    });    
    
    async function fetchContacts() {
        try {
            const response = await fetch("/contacts/data");
            const contacts = await response.json();
            populateContactsTable(contacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    function populateContactsTable(contacts) {
        contactTableBody.innerHTML = contacts.length 
            ? contacts.map((contact, index) => contactTemplate(contact, index)).join("") 
            : "";
        noContactsMessage.style.display = contacts.length ? "none" : "block";
    }
    
    function contactTemplate(contact, index) {
        let phoneNumbers = "-";
        if (Array.isArray(contact.phone_numbers) && contact.phone_numbers.length > 0) {
            phoneNumbers = contact.phone_numbers.map(p => `${p.number} (${p.type || "Unknown"})`).join("<br>");
        }    
        let formattedBirthday = contact.birthday 
            ? new Date(contact.birthday).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) 
            : "-";
    
        return `<tr data-id="${contact.contact_id}">
            <td>${index + 1}</td> <!-- Serial number -->
            <td>${contact.first_name}</td>
            <td>${contact.last_name || "-"}</td>
            <td>${phoneNumbers}</td>
            <td>${contact.email || "-"}</td>
            <td>${contact.relationship || "-"}</td>
            <td>${contact.address || "-"}</td>
            <td>${formattedBirthday}</td>
            <td>
                <button class="edit-contact" data-id="${contact.contact_id}">✏️</button>
                <button class="delete-contact" data-id="${contact.contact_id}">🗑️</button>
            </td>
        </tr>`;
    }
    
    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        filterContacts(searchText);
    });

    function filterContacts(searchText) {
        const rows = contactTableBody.querySelectorAll("tr");

        rows.forEach((row) => {
            const name = row.children[0].textContent.toLowerCase(); 
            const lastName = row.children[1].textContent.toLowerCase(); 
            const phoneNumber = row.children[2].textContent.toLowerCase(); 
            const email = row.children[3].textContent.toLowerCase(); 

            if (
                name.includes(searchText) ||
                lastName.includes(searchText) ||
                phoneNumber.includes(searchText) ||
                email.includes(searchText)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
    clearSearch.addEventListener('click', () => {
        searchInput.value = ""
        fetchContacts()
    })

    contactTableBody.addEventListener("click", async (event) => {
        if (event.target.classList.contains("edit-contact")) {
            const contactId = event.target.getAttribute("data-id");
            await editContact(contactId);
        } else if (event.target.classList.contains("delete-contact")) {
            const contactId = event.target.getAttribute("data-id");
            await deleteContact(contactId);
        }
    });
    
    async function editContact(contactId) {
        try {
            const response = await fetch(`/contacts/get-contact/${contactId}`);
            const contact = await response.json();
    
            if (!contact) {
                alert("Error: Contact not found!");
                return;
            }
    
            document.getElementById("contact-id").value = contactId;
            document.getElementById("first-name").value = contact.first_name || "";
            document.getElementById("last-name").value = contact.last_name || "";
    
            const emailField = document.getElementById("email");
            emailField.value = contact.email || "";
            if (contact.email) emailField.classList.remove("hidden");
    
            const relationshipField = document.getElementById("relationship");
            relationshipField.value = contact.relationship || "";
            if (contact.relationship) relationshipField.classList.remove("hidden");
    
            const addressField = document.getElementById("address-section");
            const addressInputField = document.getElementById("address");
            console.log(contact.address)
            addressInputField.value = contact.address || "";
            if (contact.address) addressField.classList.remove("hidden");
    
            const birthdayField = document.getElementById("birthday");
            birthdayField.value = contact.birthday || "";
            if (contact.birthday) birthdayField.classList.remove("hidden");
    
            const phoneSection = document.getElementById("phone-section");
            phoneSection.innerHTML = contact.phone_numbers?.map(phone => `
                <div class="phone-entry">
                    <select name="phone-type" class="phone-type">
                        <option value="personal" ${phone.type === "personal" ? "selected" : ""}>Personal</option>
                        <option value="work" ${phone.type === "work" ? "selected" : ""}>Work</option>
                        <option value="other" ${phone.type === "other" ? "selected" : ""}>Other</option>
                        <option value="custom" ${!["personal", "work", "other"].includes(phone.type) ? "selected" : ""}>Custom</option>
                    </select>
                    <input type="text" name="custom-type" class="custom-type ${["personal", "work", "other"].includes(phone.type) ? "hidden" : ""}" 
                           placeholder="Enter Custom Type" value="${phone.type}" autocomplete="off">
                    <input type="number" name="phone-number" placeholder="Phone Number" value="${phone.number}" autocomplete="off" required>
                    <button type="button" class="remove-phone">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join("") || "";
    
            toggleModal(true);
        } catch (error) {
            console.error("Error fetching contact details:", error);
        }
    }
    
    
    async function deleteContact(contactId) {
        try {
            const response = await fetch(`/contacts/delete-contact/${contactId}`, { method: "DELETE" });
            if (response.ok) fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    }

    
    fetchContacts();
});
