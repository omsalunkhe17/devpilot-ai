import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import testRouter from "./routes/test.routes.js"
import authRouter from "./routes/auth.routes.js";
import workspaceRouter from "./routes/workspace.routes.js";
import documentRouter from "./routes/document.routes.js";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/test", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/documents", documentRouter);

export default app;