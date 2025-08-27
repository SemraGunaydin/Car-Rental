import imagekit from "../configs/imageKit.js";
import User from "../models/user.js";
import Car from "../models/Car.js";
import fs from "fs";
import Booking from "../models/Booking.js";

// Api change to user role
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Araba ekleme işlemi
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user; 
    let car = JSON.parse(req.body.carData); 
    const imageFile = req.file; 

    
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    // Upload Image to ImageKit'
    const fileBuffer = fs.readFileSync(imageFile.path); // Dosyayı oku
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // Upload yanıtını logla
    console.log("ImageKit Upload Response:", response);

    // Eğer filePath gelmediyse hata ver
    if (!response || !response.filePath) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to upload image to ImageKit",
        });
    }

    // Optimization generate images and videos
    const optimizedImageURL = imagekit.url({
      path: response.filePath, // file path
      transformation: [
        { width: 1280 }, // width resizing
        { quality: "auto" },  //auto compression
        { format: "webp" }, //convert to modern format
      ],
    });

    
    const image = optimizedImageURL; 
    await Car.create({ ...car, owner: _id, image }); 

    res.json({ success: true, message: "Car added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to list owner cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Api to Toggle Car Availability

export const toggleCarAvailibility = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // checking is car belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Api to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // checking is car belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

     // Sadece bu owner'ın arabalarını filtrele
    // const ownerBookings = bookings.filter(
    //  (b) => b.car && b.car.owner.toString() === _id.toString()
    // );

    const pendingBookings = await Booking.find({owner:_id, status:"pending"})

    const completedBookings = await Booking.find({owner:_id, status:"confirmed"})

    //calculate monthly revebue from bookings where status is confirmed
    const monthlyRevenue = bookings.slice()
    .filter(booking => booking.status === 'confirmed')
    .reduce((acc,booking)=> acc + booking.price,0)
      

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    // upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path); // read file
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // Optimizasyon yaparak URL'yi oluştur
    const optimizedImageURL = imagekit.url({
      path: response.filePath, // file path
      transformation: [
        { width: 400 }, // width resizing
        { quality: "auto" },  //auto compression
        { format: "webp" }, //convert to modern format
      ],
    });

    const image = optimizedImageURL;

    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log( error.message);
    res.json({ success: false, message: error.message });
  }
};
