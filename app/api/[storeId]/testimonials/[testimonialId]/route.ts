import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params} : { params: {  testimonialId: string } },
) {
  try{
    
    if(!params.testimonialId){
      return new NextResponse("Testimonial id is required", {
        status: 400,
      });
    }

    const testimonial = await prismadb.testimonial.findUnique({
      where: {
        id:params.testimonialId,
      },
    });

    return NextResponse.json(testimonial);

  } catch (error) {
    console.log(`[TESTIMONIAL_GET]`, error);
    return new NextResponse("Internal Error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params} : { params: { storeId: string, testimonialId: string } },
) {
  try{
    const { userId } = auth();
    const body = await req.json();
    const { name, title, message, rating, imageUrl } = body;

    if(!userId){
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if(!name){
      return new NextResponse("Name is required", {
        status: 400,
      });
    }

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

    if(!params.testimonialId){
      return new NextResponse("testimonial id is required", {
        status: 400,
      });
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


    const testimonial = await prismadb.testimonial.updateMany({
      where: {
        id:params.testimonialId,
      },
      data: {
          name,
          title,
          message,
          rating,
          imageUrl
        }
    });

    return NextResponse.json(testimonial);

  } catch (error) {
    console.log(`[TESTIMONIAL_PATCH]`, error);
    return new NextResponse("Internal Error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params} : { params: { storeId: string, testimonialId: string } },
) {
  try{
    const { userId } = auth();
    
    
    if(!userId){
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if(!params.testimonialId){
      return new NextResponse("Testimonial id is required", {
        status: 400,
      });
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

    const testimonial = await prismadb.testimonial.deleteMany({
      where: {
        id:params.testimonialId,
      },
    });

    return NextResponse.json(testimonial);

  } catch (error) {
    console.log(`[TESTIMONIAL_DELETE]`, error);
    return new NextResponse("Internal Error", {status: 500})
  }
}