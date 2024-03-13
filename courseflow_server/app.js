import express from 'express';

import { userRouter, courseRouter, assignmentRouter, publicRouter, learningRouter, adminRouter } from './routers/index.js'

import { PrismaClient } from '@prisma/client'
import { checkJwt, checkLearnerScopes } from './middlewares/auth.js'
import cors from 'cors'
import dotenv from "dotenv";
import https from 'https';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

dotenv.config();

// Prisma
export const prisma = new PrismaClient();

// HTTPS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const privateKey = fs.readFileSync(join(__dirname, '/ssl-certs/private.key'), 'utf8');
const certificate = fs.readFileSync(join(__dirname, '/ssl-certs/certificate.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };



const app = express();
const port = 5111

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"))

app.use('/public', publicRouter);
app.use('/course', courseRouter);
app.use('/assignment', assignmentRouter);
app.use('/learning', checkJwt, learningRouter)
app.use('/user', checkJwt, userRouter);
app.use('/admin', checkJwt, adminRouter);


app.post('/auth-check', checkJwt, function (req, res) {
  console.log("User id:", req.auth.payload.sub)
  return res.json({ message: "hooray!" })

})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

