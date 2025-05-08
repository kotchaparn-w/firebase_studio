import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { mockSpaPackages } from '../lib/mockData'; // Import mock data

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT not set in .env

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Gift Spa API Server is running!');
});

// Placeholder for MongoDB connection
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Error: MONGODB_URI is not defined in the .env file');
  process.exit(1); // Exit if MongoDB URI is missing
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // You can add database setup or initial checks here if needed

  } catch (err) {
      console.error("Failed to connect to MongoDB", err);
       // In a real app, you might want more robust error handling or retry logic
       // For now, we'll log the error and let the server start, but DB operations will fail.
  }
  // We don't close the client here immediately, keep it open for API routes
  // Consider closing it gracefully on server shutdown (e.g., using process.on('SIGINT', ...))
}

// Connect to MongoDB before starting the server
connectDB().then(() => {
    // Example API route (placeholder - replace with actual routes)
    // This uses the established MongoDB client connection
    app.get('/api/giftcards', async (req: Request, res: Response) => {
        try {
            const db = client.db("giftspa"); // Use your database name
            const collection = db.collection('purchased_cards'); // Use your collection name
            // Example: find all cards (add query parameters, pagination etc. later)
            const cards = await collection.find({}).toArray();
            res.json(cards);
        } catch (error) {
            console.error("Error fetching gift cards:", error);
            res.status(500).json({ message: "Error fetching data from database" });
        }
    });

     // API route to fetch spa packages
     // In a real app, this would fetch from MongoDB: db.collection('spa_packages').find().toArray()
     app.get('/api/spa-packages', async (req: Request, res: Response) => {
        try {
            // Simulate fetching from DB or just return mock data for now
            // TODO: Replace with actual MongoDB query
            // const db = client.db("giftspa");
            // const collection = db.collection('spa_packages');
            // const packages = await collection.find({}).toArray();
            // res.json(packages);

             // Returning mock data for demonstration
             res.json(mockSpaPackages);
        } catch (error) {
            console.error("Error fetching spa packages:", error);
            res.status(500).json({ message: "Error fetching spa packages" });
        }
    });


    // Add more routes here for creating, updating, deleting gift cards, managing designs etc.
    // e.g., app.post('/api/giftcards', ...)
    // e.g., app.get('/api/admin/designs', ...)
    // e.g., app.post('/api/admin/spa-packages', ...) // For admin to add/edit packages


    // Start the Express server
    app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    });

}).catch(console.dir); // Catch errors during initial DB connection


// Graceful shutdown (optional but recommended)
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing MongoDB connection');
  await client.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing MongoDB connection');
  await client.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
