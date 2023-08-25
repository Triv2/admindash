import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { TestimonialsClient } from "./components/client";
import { TestimonialColumn } from "./components/columns";

const TestimonialsPage = async ({
  params
}:{
  params: {storeId: string}
}) => {
  const testimonials = await prismadb.testimonial.findMany({
    where:{
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedTestimonials:TestimonialColumn[] = testimonials.map ((item) =>({
    id: item.id,
    name:item.name,
    title: item.title,
    rating:item.rating,
    imageUrl: item.imageUrl,
    message: item.message,
    createdAt: format (item.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TestimonialsClient data={formattedTestimonials}/>
      </div>
    </div>

  );
}

export default TestimonialsPage;