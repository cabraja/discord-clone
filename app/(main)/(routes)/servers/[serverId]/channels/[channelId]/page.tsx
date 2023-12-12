import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import db from '@/lib/db';
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";

type ChannelIdPageProps = {
  params:{
    serverId:string;
    channelId:string;
  }
}

async function ChannelIdPage({params}:ChannelIdPageProps) {

  const profile = await currentProfile();

  if(!profile){
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where:{
      id: params.channelId
      
    }
  })

  const member = await db.member.findFirst({
    where:{
      serverId:params.serverId,
      profileId:profile.id
    }
  })

  if(!channel || !member){
    redirect('/');
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
     <ChatHeader name={channel.name} serverId={params.serverId} type="channel"/>

     <div className="flex-1">
        Future messages
     </div>

     <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages"
     query={{
      channelId:channel.id,
      serverId:channel.serverId
     }}/>
    </div>
  )
}

export default ChannelIdPage