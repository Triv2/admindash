import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

// POST = CREATE FROM CRUD, GET = READ FROM CRUD, PUT = UPDATE FROM CRUD, DELETE = DELETE FROM CRUD


export async function POST(
  req: Request,
) {
  try {
    // Get userId from Clerk auth middleware, body = user input, and name is the variable for use.
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;
  
    // Check if userId exists and is logged in.
    if (!userId) {
      return new NextResponse("Unauthorized",{ status: 401 });
    }
    // Check if user input is valid.
    if (!name) {
      return new NextResponse("Name is required",{ status: 400 });
    }

    // Create a new store in the database.
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal Error", {status:500});
  }
}