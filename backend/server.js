const express=require("express");
const cors=require("cors");
const db = require("./config/db");
const eventRoutes=require("./routes/eventRoutes");
const registrationRoutes=require("./routes/registrationRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/events",eventRoutes);
app.use("/api/registrations",registrationRoutes);
app.use("/api/dashboard",dashboardRoutes);

app.get("/",(req,res)=>{
    res.json({
        message:"Event management api is running"
    });
});
const port =5000;
app.listen(port,()=>{
    console.log(`server running on ${port}`);
});