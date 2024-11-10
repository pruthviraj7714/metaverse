import express from "express"
import { adminRouter } from "./routes/admin";
import { spaceRouter } from "./routes/space";
import { userRouter } from "./routes/user";
import { availableRouter } from "./routes/available";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/available',availableRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/space', spaceRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on PORT 3000!");
})
