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
          const [referralCount, appointmentCount, todayAppointmentCount] =
            await Promise.all([
              prisma.referrals.count({
                where: {
                  status: "pending",
                  counselor_id: sessionData.id,
                },
              }),
              prisma.appointment_Requests.count(),
              prisma.Appointments.count({
                where: {
                  date_time: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                  },
                },
              }),
            ]);

          const data = `data: ${JSON.stringify({
            referralCount,
            appointmentCount,
            todayAppointmentCount,
          })}\n\n`;

          controller.enqueue(new TextEncoder().encode(data));
        } catch (error) {
          console.error("Error sending quickview update:", error);
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
