


const express = require("express");// express import
const cors = require("cors");// cors import
const ejs = require("ejs");// ejs import
const mongoose = require("mongoose");// mongoose import
const multer = require("multer");// multer import
const path = require("path");// path import
const app = express();// app create
const PORT = 8888;
app.set("view engine", "ejs");// view engine set
app.set("views", path.join(__dirname, "views"));// views folder path

const Listing = require("./Models/listings");// listings model import

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

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
app.use(express.urlencoded({ extended: true }));// form data read
app.use(express.static("public"));// static files serve
app.use(express.static(path.join(__dirname, "public")));


const upload = multer({
  storage: multer.diskStorage({
    destination: "public/uploads",
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname))
  })
});


// // POST: upload + save
// app.post("/addNewList", upload.single("listing[image]"), async (req, res) => {
//   try {
//     const newListing = new Listing({
//       title: req.body.title,
//       description: req.body.description,
//       price: req.body.price,
//       category: req.body.category,
//       condition: req.body.condition,
//       images: req.file ? ["/uploads/" + req.file.filename] : []
//     });

//     await newListing.save();
//     res.send("Listing saved successfully 🚀");
//     console.log("New listing saved:", newListing);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send("Error saving listing");
//   }
// });


// POST: upload + save listing
app.post("/addNewList", upload.single("listing[image]"), async (req, res) => {
  try {
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      condition: req.body.condition,
      images: req.file
        ? {
            url: "/uploads/" + req.file.filename,
            filename: req.file.filename,
          }
        : undefined,
    });

    await newListing.save();
    console.log("New listing saved:", newListing);
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error saving listing");
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

//add new listing route
app.post("/addNewList", (req, res) => {
  console.log("New listing added:", req.body);
//   res.redirect("/listings");

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
