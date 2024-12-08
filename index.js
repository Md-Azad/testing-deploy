const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn37c5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const equipmentCollection = client.db("e-Sports").collection("equipments");
    // const userCollection =client.db("e-Sports").collection("users");

    app.get("/all-equipment", async (req, res) => {
      const equipments = equipmentCollection.find();
      const result = await equipments.toArray();
      res.send(result);
    });

    app.get("/mylist", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };
      const cursor = equipmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(query);
      res.send(result);
    });

    app.put("/equipments", async (req, res) => {
      const data = req.body;
      const result = await equipmentCollection.insertOne(data);
      res.send(result);
    });

    app.put("/all-equipment/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedDoc = {
        $set: {
          itemName: data.itemName,
          category: data.category,
          description: data.description,
          price: data.price,
          rating: data.rating,
          processing_time: data.processing_time,
          stock: data.stock,
          photo: data.photo,
          customization: data.customization,
        },
      };

      const result = await equipmentCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`the server is running on: "http://localhost:${port}"`);
});
