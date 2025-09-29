import jwt from "jsonwebtoken"
const genToken = async (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.cookie("token", token,
      {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production"

      }
    );
  } catch (error) {
    console.log("Token error");

  }
}

export default genToken;