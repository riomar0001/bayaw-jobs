import express, { Response, Request } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import companyRoutes from "./routes/companyRoutes";
import applicantRoutes from "./routes/applicantRoutes";
import jobRoutes from "./routes/jobRoutes";
import { notFound, errorHandler } from "@middlewares/errorHandler";

dotenv.config();

const app = express();

// Allowed Origins
const allowedOrigins = ["http://localhost:5173"];

// CORS
app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/company", companyRoutes);
app.use("/api/applicant", applicantRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req: Request, res: Response) => {
  //@ts-expect-error
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, "../frontend/dist", "index.html");

  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  } else {
    return res.json({ message: "Hello World" });
  }
});

app.use(notFound);
app.use(errorHandler);

export default app;
