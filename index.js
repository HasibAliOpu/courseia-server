const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jw3mngb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    // collections
    const coursesCollection = client.db("courseia").collection("courses");
    const reviewsCollection = client.db("courseia").collection("reviews");

    await client.connect();

    app.get("/courses", async (req, res) => {
      const courses = await coursesCollection.find({}).toArray();
      res.send(courses);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const course = await coursesCollection.findOne({ _id: ObjectId(id) });
      res.send(course);
    });

    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.send(reviews);
    });
  } catch (error) {
    console.log(error);
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Courseia server is Running`);
});

app.listen(port, () => {
  console.log(`Courseia app listening on PORT ${port}`);
});
