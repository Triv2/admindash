import prismadb from "@/lib/prismadb";
import { TestimonialForm } from "./components/testimonial-form";

const TestimonialPage = async ({
  params
} : {
  params: {testimonialId: string}
}) => {

  const testimonial = await prismadb.testimonial.findUnique({
    where:{
      id: params.testimonialId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TestimonialForm
         initialData={testimonial}
        />
      </div>
    </div>
  )
}

export default TestimonialPage;