import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/app/libs/prismadb";

export const POST = async (request: Request) => {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { name, image } = body;

        if(!currentUser?.id){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const updateUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name,
                image: image
            },
        });

        return NextResponse.json(updateUser)
    } catch (error) {
        console.log("SETTINGS_ERROR", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}