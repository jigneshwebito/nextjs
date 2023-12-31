import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/modules/common/server/auth";
import { sendApiError } from "@/modules/common/server/error";
import { getTeam, isTeamMember, getTeamMembers } from "@/modules/teams";
import { throwMethodNotAllowed } from "@/modules/common/server/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        await handleGET(req, res);
        break;
      default:
        throwMethodNotAllowed(res, method, ["GET"]);
    }
  } catch (error: any) {
    sendApiError(res, error);
  }
}

// Get all members of a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { teamSlug } = req.query as {
    teamSlug: string;
  };

  const currentUser = await getCurrentUser(req);
  const team = await getTeam(teamSlug);

  if (!(await isTeamMember(currentUser, team))) {
    throw new Error("You do not have permission to access this team");
  }

  const members = await getTeamMembers(team);

  res.status(200).json({
    data: members,
  });
};
