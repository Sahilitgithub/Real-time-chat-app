import bcrypt from 'bcryptjs'
import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const { name, email, password } = body;
        
        if(!name || !email || !password){
            return new NextResponse("Missing Fields", { status: 401 })
        }

        const hashPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashPassword
            }
        });


        return NextResponse.json(user, {status: 201})

    } catch (error) {
        console.log("Error for registration", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}