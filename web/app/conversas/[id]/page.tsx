import { getConversaById } from "@/app/_actions/conversas";
import ConversaTemplate from "@/app/components/conversa-template";

const ConversasPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const conversa = await getConversaById(Number(id));
  return <ConversaTemplate conversa={conversa.resultado} />;
};

export default ConversasPage;
