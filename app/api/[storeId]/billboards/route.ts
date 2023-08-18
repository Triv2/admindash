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
    const { label, imageUrl} = body;
  
    // Check if userId exists and is logged in.
    if (!userId) {
      return new NextResponse("Unauthenticated",{ status: 401 });
    }
    // Check if label input is valid.
    if (!label) {
      return new NextResponse("Label is required",{ status: 400 });
    }
    // Check if imageUrl input is valid.
    if (!imageUrl) {
      return new NextResponse("Image url is required",{ status: 400 });
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

    // Create a new billboard in the database.
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
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

    
    // Get a billboard from the database.
    const billboards = await prismadb.billboard.findMany({
      where:{
        storeId: params.storeId,
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal Error", {status:500});
  }
}