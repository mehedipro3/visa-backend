const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000 ;

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ee44r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dataCollection = client.db('visa').collection('data');

     // GET all visa
     app.get("/datas", async (req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

     
     app.get("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

      
       app.post("/datas", async (req, res) => {
        const newUser = req.body;
        const result = await dataCollection.insertOne(newUser);
        const createdUser = { ...newUser, _id: result.insertedId };
        res.send(createdUser);
      });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);






app.get("/",(req,res)=>{
  res.send('visa server is running');
})

app.listen(port , ()=>{
  console.log(`visa server is running on port : ${port}`)
  
})
