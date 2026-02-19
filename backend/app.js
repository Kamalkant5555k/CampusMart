

const methodOverride = require("method-override");

require("dotenv").config();
const express = require("express");// express import
const cors = require("cors");// cors import
const ejs = require("ejs");// ejs import
const mongoose = require("mongoose");// mongoose import
const multer = require("multer");// multer 

const path = require("path");// path import
const app = express();// app create
const PORT = 8888;
app.set("view engine", "ejs");// view engine set
app.set("views", path.join(__dirname, "views"));// views folder path

const Listing = require("./Models/listings");// listings model import

// multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
const { storage } = require("./cloudConfig");

const upload = multer({ storage });

// const upload = multer({ storage });



// database connect
main().then(()=>{
    console.log("connection successfull with database CAMPUSMART-db");
})
.catch(err => console.log(err));

async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/CAMPUSMART-db');
}




// middlewares
app.use(cors());// cors middleware
app.use(express.json());// json body read
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));// form data read
app.use(express.static("public"));// static files serve
app.use(express.static(path.join(__dirname, "public")));


// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "public/uploads",
//     filename: (req, file, cb) =>
//       cb(null, Date.now() + path.extname(file.originalname))
//   })
// });



// POST: upload + save listing
app.post("/addNewList", upload.single("listing[image]"), async (req, res) => {
  try {

  console.log(JSON.stringify(req.body, null, 2));
console.log(JSON.stringify(req.file, null, 2));
 

    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      condition: req.body.condition,
      img: req.file.path
    });

    await newListing.save();

    console.log("Saved Successfully ✅");
    res.redirect("/listings");

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).send("Error saving listing to database");
  }
});




// listings route
app.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("expListings", { listings }); // ejs render with listings data
    console.log("Listings page rendered"); // log
  } catch (err) {
    console.log(err);
  }
});

// listing details route
app.get("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listingDetails", { listing }); // ejs render with listing data
  } catch (err) {
    console.log(err);
  }
});

//listing delete route
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing deleted successfully ✅");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting listing");
  }
});

//listing edit route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    } 
    res.render("editListing", { listing }); // ejs render with listing data
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching listing for edit");
  }
});

app.put("/listings/:id", upload.single("listing[image]"), async (req, res) => { 
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    } 
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.category = req.body.category;
    listing.condition = req.body.condition;
    if (req.file) {
      listing.img = req.file.path;
    }
    await listing.save();
    console.log("Listing updated successfully ✅");
    res.redirect("/listings");
  }
    catch (err) { 
      console.log(err);
      res.status(500).send("Error updating listing");
    }
});



// add listings route
app.get("/addListings", (req, res) => {
  res.render("addList"); // ejs render
  console.log("Add Listings page rendered"); // log
});

// home route
app.get("/", (req, res) => {
  res.send("Hello CampusMart"); // response
});

// server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // status
});
