import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

// POST = CREATE FROM CRUD, GET = READ FROM CRUD, PUT/PATCH = UPDATE FROM CRUD, DELETE = DELETE FROM CRUD


export async function POST(
  req: Request,
  {params} : {params: {storeId: string}}
) {
  try {
    // Get userId from Clerk auth middleware, body = user input, and name is the variable for use.
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
  
    // Check if userId exists and is logged in.
    if (!userId) {
      return new NextResponse("Unauthenticated",{ status: 401 });
    }
    // Check if name input is valid.
    if (!name) {
      return new NextResponse("Name is required",{ status: 400 });
    }
    // Check if imageUrl input is valid.
    if (!value) {
      return new NextResponse("Value is required",{ status: 400 });
    }

    if(!params.storeId) {
      return new NextResponse("Store id is required",{ status: 400 });
    }

    //Check that the user is the owner of the store.
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if(!storeByUserId) {
      return new NextResponse("Unauthorized",{ status: 403 });
    }

    // Create a color in the database.
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLORS_POST]', error);
    return new NextResponse("Internal Error", {status:500});
  }
}

export async function GET(
  req: Request,
  {params} : {params: {storeId: string}}
) {
  try {
    
    if(!params.storeId) {
      return new NextResponse("Store id is required",{ status: 400 });
    }

    
    // Get a color from the database.
    const colors = await prismadb.color.findMany({
      where:{
        storeId: params.storeId,
      }
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_GET]', error);
    return new NextResponse("Internal Error", {status:500});
  }
}