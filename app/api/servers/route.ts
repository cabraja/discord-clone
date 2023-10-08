import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db'
import {v4 as uuidv4} from 'uuid'
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req:Request) {
    try {
        const {name,imageUrl} = await req.json();
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", {status:401});
        }

        const server = await db.server.create({
            data:{
                name:name,
                imageUrl:imageUrl,
                profileId:profile.id,
                inviteCode: uuidv4(),
                Channel:{
                    create:[
                        {name:'general',profileId:profile.id}
                    ]
                },
                Member:{
                    create:[
                        {role:MemberRole.ADMIN, profileId:profile.id}
                    ]
                }
            }
        })

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal error",{status:500});
    }
}