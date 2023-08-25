import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

// POST = CREATE FROM CRUD, GET = READ FROM CRUD, PUT/PATCH = UPDATE FROM CRUD, DELETE = DELETE FROM CRUD


export async function POST(
  req: Request,
  {params} : {params: {storeId: string}}
) {
  try {
    
    const { userId } = auth();
    const body = await req.json();
    const { name, title, message, rating, imageUrl } = body;
  
    // Check if userId exists and is logged in.
    if (!userId) {
      return new NextResponse("Unauthenticated",{ status: 401 });
    }
    // Check if name input is valid.
    if (!name) {
      return new NextResponse("Name is required",{ status: 400 });
    }
    // Check if imageUrl input is valid.
    if (!title) {
      return new NextResponse("Title is required",{ status: 400 });
    }
    if (!message) {
      return new NextResponse("Message is required",{ status: 400 });
    }
    if (!rating) {
      return new NextResponse("Rating is required",{ status: 400 });
    }
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

    
    const testimonial = await prismadb.testimonial.create({
      data: {
        name,
        title,
        message,
        rating,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.log('[TESTIMONIALS_POST]', error);
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

    

    const testimonials = await prismadb.testimonial.findMany({
      where:{
        storeId: params.storeId,
      }
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.log('[TESTIMONIALS_GET]', error);
    return new NextResponse("Internal Error", {status:500});
  }
}