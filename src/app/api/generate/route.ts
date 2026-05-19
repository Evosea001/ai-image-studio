import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const STYLES: Record<string, string> = {
  comic: "转换为日系漫画风格，保留人物特征，使用鲜明的色块和轮廓线",
  "3d": "转换为3D渲染风格，细腻的光影效果，CG质感，高精度细节",
  oil: "转换为古典油画风格，厚重的笔触质感，温暖的色调，艺术大师风格",
  sketch: "转换为精细素描风格，黑白灰层次分明，铅笔手绘质感",
  cyberpunk: "转换为赛博朋克风格，霓虹灯光效，暗色调，未来科技感，保留原图构图",
  watercolor: "转换为水彩画风格，柔和的色彩晕染，透明的色彩层次，留白艺术",
};

const generateSchema = z.object({
  image: z.string().min(1),
  style: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { image, style } = generateSchema.parse(body);

    const stylePrompt = STYLES[style] || style;

    const response = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ARK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "doubao-seedream-4-5-251128",
          prompt: stylePrompt,
          image: image,
          size: "2K",
          response_format: "url",
          watermark: false,
          sequential_image_generation: "disabled",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || result.error) {
      const msg = result.error?.message || `火山引擎 API 错误 (${response.status})`;
      console.error("Ark API error:", JSON.stringify(result));
      return Response.json({ error: msg }, { status: 500 });
    }

    const resultUrl = result.data?.[0]?.url;
    if (!resultUrl) {
      console.error("Ark API no image URL:", JSON.stringify(result));
      return Response.json({ error: "AI 未返回图片" }, { status: 500 });
    }

    const imageRecord = await prisma.image.create({
      data: {
        originalUrl: image.startsWith("data:") ? "" : image,
        resultUrl,
        style,
        userId: session.user.id,
      },
    });

    return Response.json({
      id: imageRecord.id,
      resultUrl,
      style,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0].message }, { status: 400 });
    }
    return Response.json({ error: "生成失败" }, { status: 500 });
  }
}
