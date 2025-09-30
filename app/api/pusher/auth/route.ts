import { pusherServer } from "@/app/libs/pusher";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Check for an active session
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Extract channel_name and socket_id from the request body
  const formData = await req.formData();
  const socketId = formData.get("socket_id") as string;
  const channelName = formData.get("channel_name") as string;
  const userId = session.user?.email;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = { user_id: userId };

  // Authorize the user for the private channel
  const authorizedResponse = pusherServer.authorizeChannel(socketId, channelName, data);

  return NextResponse.json(authorizedResponse);
}