import bcrypt from "bcrypt";

export const HACH = async (password, SOLD_NUMBER) => {
  return bcrypt.hashSync(password, SOLD_NUMBER);
};

export const ComparePass = async (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};
