import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return new Response("Unauthorized", { status: 401 });
  }

  let isStreamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        if (isStreamClosed) return;

        try {
          const currentUser = await prisma.users.findUnique({
            where: {
              user_id: sessionData.id,
            },
            select: {
              name: true,
              role: true,
              profilePicture: true,
            },
          });

          const user = {
            name: currentUser.name,
            role: currentUser.role,
            profilePicture: currentUser.profilePicture,
          };

          const data = `data: ${JSON.stringify({ user })}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        } catch (error) {
          if (!error.message.includes("Invalid state")) {
            console.error("Error sending navbar update:", error);
          }
        }
      };

      // Send initial data
      await sendUpdate();

      // Set up interval for updates
      const interval = setInterval(sendUpdate, 5000);

      // Cleanup on close
      return () => {
        isStreamClosed = true;
        clearInterval(interval);
      };
    },
    cancel() {
      isStreamClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
