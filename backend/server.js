import express from "express"
import connectDB from "./config/mongoDB.js";
import 'dotenv/config';
import userRouter from "./routes/userRouter.js";
import cors from 'cors';

const app = express();
const port = process.env.port || 5000;

connectDB();

app.use(express.json())
app.use(cors());

app.use('/user', userRouter);

app.get('/', (req, res) => res.status(200).send('API Working')
)


app.listen(port, () => console.log(`Server is running on port: ${port}`))