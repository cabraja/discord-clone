import { initalProfile } from "@/lib/inital-profile";
import {redirect} from 'next/navigation'
import db from '@/lib/db'
import InitialModal from "@/components/modals/inital-modal";

const SetupPage = async() => {
    const profile = await initalProfile();

    const server = await db.server.findFirst({
        where:{
            Member:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`)
    }

    return (
        <div><InitialModal /></div>
    );
}
 
export default SetupPage;