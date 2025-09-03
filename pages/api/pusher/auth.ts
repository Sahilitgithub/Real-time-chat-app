import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { pusherServer } from "@/app/lib/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    res.status(401).end(); // Don't return response object
    return;
  }

  const { socket_id, channel_name } = req.body;

  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, data);

  res.send(authResponse);
}
