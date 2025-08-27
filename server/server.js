import express from "express"; // Doğru yazım: express
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from './routes/userRouter.js';
import ownerRouter from "./routes/ownerRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

// Initialize Express App
const app = express(); 

// Connect Database
await connectDB();

// Middleware'
app.use(cors()); // CORS middleware
app.use(express.json()); // JSON veri işlemek için middleware

// Anasayfa (root) route'u
app.get('/', (req, res) => res.send("Server is running"));


app.use('/api/user', userRouter);  // Kullanıcı işlemleri için router
app.use('/api/owner', ownerRouter); // Sahip işlemleri için router
app.use('/api/bookings', bookingRouter); //car booking icin


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));