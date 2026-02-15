
import { getGoogleAuthURL } from "../_lib/google.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const url = getGoogleAuthURL();
  res.redirect(url);
}