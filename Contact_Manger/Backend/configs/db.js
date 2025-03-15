const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const contact = require("../model/contact");

let io; 
let changeStream;

async function connectDB(app) {
    try {
        const server = http.createServer(app);
        io = socketIo(server);

        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log("✅ Connected to Database");

        if (mongoose.connection.readyState !== 1) {
            console.warn("⚠️ MongoDB connection is not ready.");
            return;
        }
        mongoose.connection.on('disconnected', () => {
            console.error("⚠️ MongoDB Disconnected! Reconnecting...");
            setTimeout(connectDB, 5000, app);
        });

        try {
            const adminDb = mongoose.connection.db.admin();
            const status = await adminDb.serverStatus();
            const isReplicaSet = status.repl !== undefined;

            if (isReplicaSet) {
                console.log("✅ MongoDB is running as a replica set, enabling Change Streams.");
                startChangeStream();
            } else {
                console.warn("⚠️ MongoDB is not running as a replica set, skipping Change Streams.");
            }
        } catch (err) {
            console.error("❌ Error checking replica set status:", err.message);
        }

    } catch (error) {
        if (error.name === "MongoNetworkError") {
            console.error("❌ Database connection failed: Internet Not Found");
        } else {
            console.error("❌ Database connection failed:", error.message);
        }
        setTimeout(connectDB, 5000, app); 
    }
}

function startChangeStream() {
    if (changeStream) {
        changeStream.close();
    }

    changeStream = contact.watch();
    
    changeStream.on('change', (change) => {
        io.emit('contactUpdated', change);
    });

    changeStream.on('error', (err) => {
        console.error("❌ Change Stream Error:", err.message);
        console.warn("🔄 Restarting Change Stream...");
        setTimeout(startChangeStream, 5000); 
    });

    console.log("🔄 Change Stream started...");
}

process.on('SIGINT', async () => {
    console.log("🛑 Server shutting down...");
    if (changeStream) {
        await changeStream.close();
        console.log("🔌 Change Stream closed.");
    }
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
});

module.exports = connectDB;
