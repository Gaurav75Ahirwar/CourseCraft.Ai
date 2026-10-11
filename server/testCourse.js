require("dotenv").config();

const dns = require("dns");
const mongoose = require("mongoose");
const Course = require("./models/Course");

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

if (dnsServers?.length) {
    dns.setServers(dnsServers);
}

const testCourse = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!!");

        const course = await Course.create({
            title: "Introduction to Machine Learning",
            description: "A beginner-friendly guide:)",
            creator: "test-user-123",
            tags: ["AI", "Machine Learning"]
        });

        console.log("Course saved successfully");
        console.log(course);
    } catch (err) {
        console.error("Test failed: ", err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

testCourse();