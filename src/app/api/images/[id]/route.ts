import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;

  const image = await prisma.image.findUnique({ where: { id } });

  if (!image || image.userId !== session.user.id) {
    return Response.json({ error: "无权操作" }, { status: 403 });
  }

  await prisma.image.delete({ where: { id } });

  return Response.json({ success: true });
}
