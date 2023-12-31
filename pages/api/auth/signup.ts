import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendApiError,
  throwMethodNotAllowed,
} from "@/modules/common/server/error";
import { createUserAccount, signUpSchema } from "@/modules/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        await handlePOST(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["POST"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
  }
}

// Create a new user account
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, firstName, lastName, password } = signUpSchema.parse(req.body);

  const newUser = await createUserAccount({
    email,
    firstName,
    lastName,
    password,
  });

  res.status(201).json({
    data: newUser,
  });
};
