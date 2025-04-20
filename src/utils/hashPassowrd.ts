import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
