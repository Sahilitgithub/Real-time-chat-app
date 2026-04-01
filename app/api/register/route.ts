// import bcrypt from 'bcryptjs'
// import { prisma } from "@/app/libs/prismadb";
// import { NextResponse } from "next/server"

// export const POST = async (request: Request) => {
//     try {
//         const body = await request.json();
//         const { name, email, password } = body;
        
//         if(!name || !email || !password){
//             return new NextResponse("Missing Fields", { status: 401 })
//         }

//         const hashPassword = await bcrypt.hash(password, 12)

//         const user = await prisma.user.create({
//             data: {
//                 name,
//                 email,
//                 hashedPassword: hashPassword
//             }
//         });


//         return NextResponse.json(user, {status: 201})

//     } catch (error) {
//         console.log("Error for registration", error)
//         return new NextResponse("Internal Server Error", {status: 500})
//     }
// }

import bcrypt from 'bcryptjs'
import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // ✅ 1. Validate fields
    if (!name || !email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    // ✅ 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    // ✅ 3. Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // ✅ 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashPassword
      }
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error: unknown) {
    console.log("Error for registration", error);

    // ✅ 5. Optional: catch Prisma duplicate error (extra safety)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return new NextResponse("Email already exists", { status: 400 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}