const express = require("express")
const path = require("path")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./Backend/configs/.env" });
    console.log("DB_URL: ", process.env.DB_URL);
}

const indexRouter = require("./Backend/router/indexR")
const contactsRouter = require("./Backend/router/contactR");
const connectDB = require("./Backend/configs/db");

const app = express();
connectDB(app)
const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "FrontEnd", "views"));
app.set("layout", "layouts/layout");

app.use(express.urlencoded({ limit: "10gb", extended: false }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "FrontEnd", "public")));
app.use("/", indexRouter)
app.use("/contacts", contactsRouter);


let PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});
