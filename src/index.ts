import express from "express";
import { bootstrap } from "./bootstrap";

const app = express();
bootstrap(app);

const PORT = Number(process.env.PORT || 5001);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App listening on port ${PORT}`);
});
