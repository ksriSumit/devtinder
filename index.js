const app = require("./src/app"); // Import Express app
const connectDB = require("./src/config/database"); // Import DB connection
require("dotenv").config();

const PORT = process.env.PORT;

// Start the DB first, then run the server
connectDB()
  .then(() => {
    console.log("✅ Connection Established to Database");
    app.listen(PORT, () => {
      console.log("🚀 Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.error("❌ Database Connection Failed:", error.message);
  });
