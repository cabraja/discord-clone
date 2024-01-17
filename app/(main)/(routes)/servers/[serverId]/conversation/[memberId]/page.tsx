import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const coversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!coversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { MemberOne, MemberTwo } = coversation;

  const otherMember =
    MemberOne.profileId === profile.id ? MemberTwo : MemberOne;

  return (
    <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        type="conversation"
        serverId={params.serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={coversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={coversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: coversation.id,
        }}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: coversation.id,
        }}
      />
    </div>
  );
}

export default MemberIdPage;
