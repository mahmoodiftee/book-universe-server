require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fc0zsls.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fc0zsls.mongodb.net/?retryWrites=true&w=majority";
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

    const BooksCollection = client.db('Library-Management-System').collection('Books');
    const RecommendationCollection = client.db('Library-Management-System').collection('Recommendations');
    const BorrowCollection = client.db('Library-Management-System').collection('BorrowedBooks');


    // Get all data from BorrowCollection
    app.get('/borrowedBooks', async (req, res) => {
      const cursor = BorrowCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // insert book in the BooksCollection
    app.post('/borrowedBooks', async (req, res) => {
      const book = req.body;
      console.log(book);
      const result = await BorrowCollection.insertOne(book);
      res.send(result);
    })





    // Update the quantity of a book by its ID
    app.patch('/books/:id', async (req, res) => {
      const bookId = req.params.id;
      const newQuantity = req.body.quantity;
      const filter = { _id: new ObjectId(bookId) };
      const update = {
        $set: { quantity: newQuantity }
      };

      try {
        const result = await BooksCollection.updateOne(filter, update);
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Book quantity updated successfully' });
        } else {
          res.status(404).json({ message: 'Book not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    // Get all books from Recommendations collection 
    app.get('/recommendation', async (req, res) => {
      const cursor = RecommendationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Get single data by id from BooksCollection
    app.get('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await BooksCollection.findOne(query);
      res.send(result);
    })

    // Get all data from BooksCollection
    app.get('/books', async (req, res) => {
      const cursor = BooksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // insert book in the BooksCollection

    app.post('/books', async (req, res) => {
      const book = req.body;
      console.log(book);
      const result = await BooksCollection.insertOne(book);
      res.send(result);
    })
    //update
    app.put('/books/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedBook = req.body;
      const Book = {
        $set: {
          title: updatedBook.title,
          author: updatedBook.author,
          category: updatedBook.category,
          quantity: updatedBook.quantity,
          img: updatedBook.img,
          rating: updatedBook.rating,
          short_description: updatedBook.short_description
        }
      }
      const result = await BooksCollection.updateOne(filter, Book, options);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Library server is running');
});

app.listen(port, () => {
  console.log(`Library server is running on port ${port}`);
});