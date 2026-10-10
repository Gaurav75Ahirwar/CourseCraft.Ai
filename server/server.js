const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dns = require("dns");
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

if (dnsServers?.length) {
    dns.setServers(dnsServers);
}

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "CourseCraft.Ai backend is running" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}...`);
    });
};

startServer();