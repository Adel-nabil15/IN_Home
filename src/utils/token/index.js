import jwt from "jsonwebtoken";

export const GeneratToken = async ({ payload = {}, SEGNETURE, expiren }) => {
  return jwt.sign(payload, SEGNETURE, expiren);
};


export const VerifyToken = async (token, SEGNETURE) => {
  return jwt.verify(token, SEGNETURE);
};
