import { getConversaById } from "@/app/_actions/conversas";
import ConversaTemplate from "@/app/components/conversas/conversa-template";
import { cookies } from "next/headers";

const ConversasPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    const conversa = await getConversaById(Number(id));
    return <ConversaTemplate conversaInicial={conversa.resultado} />;
  }
};

export default ConversasPage;
