import { config } from "dotenv";
config();

export const PORT = 5000;
export const SECRET_STRIPE=process.env.STRIPE_KEY;