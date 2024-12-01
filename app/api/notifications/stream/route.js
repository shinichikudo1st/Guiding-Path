import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const unreadCount = await getUnreadCount(sessionData);
          const data = `data: ${JSON.stringify({ unreadCount })}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        } catch (error) {
          console.error("Error sending notification update:", error);
        }
      };

      // Send initial count
      await sendUpdate();

      // Set up interval for updates
      const interval = setInterval(sendUpdate, 5000);

      // Cleanup on close
      return () => clearInterval(interval);
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

async function getUnreadCount(sessionData) {
  const roleConditions = [{ user_id: sessionData.id }];

  if (sessionData.role === "student") {
    roleConditions.push({ user_id: "000" });
  }

  if (sessionData.role === "student" || sessionData.role === "teacher") {
    roleConditions.push({ user_id: "001" });
  }

  const notifications = await prisma.notifications.findMany({
    where: {
      OR: roleConditions,
    },
    include: {
      notificationStatus: {
        where: {
          user_id: sessionData.id,
        },
      },
    },
  });

  return notifications.filter(
    (notification) => notification.notificationStatus.length === 0
  ).length;
}
