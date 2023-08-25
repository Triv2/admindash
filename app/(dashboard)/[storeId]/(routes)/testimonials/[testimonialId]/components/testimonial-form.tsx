'use client'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";

import * as z from "zod";
import { Testimonial } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";


import ImageUpload from "@/components/ui/image-upload";

const formSchema= z.object({
  name: z.string().min(1),
  title:z.string().min(1),
  message:z.string().min(1),
  rating:z.string().min(1),
  imageUrl:z.string().min(1),
});

type TestimonialFormValues = z.infer<typeof formSchema>

interface TestimonialFormProps {
  initialData:Testimonial | null;
}

export const TestimonialForm: React.FC<TestimonialFormProps>= ({
  initialData
}) => {
  const params = useParams();
  const router=useRouter();
  

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Testimonial" : "Create Testimonial";
  const description = initialData ? "Edit Testimonial" : "Add a new Testimonial";
  const toastMessage = initialData ? "Testimonial updated." : "Testimonial created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<TestimonialFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues: initialData || {
      name:'',
      title:'',
      message:'',
      rating:'',
      imageUrl:'',
    },
  });

  const onSubmit = async (data:TestimonialFormValues) => {
    try {
      setLoading(true);

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/testimonials/${params.testimonialId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/testimonials`, data)
      }
      router.refresh();
      router.push(`/${params.storeId}/testimonials`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try{
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/testimonials/${params.testimonialId}`);
      router.refresh();
      router.push(`/${params.storeId}/testimonials`);
      toast.success("Testimonial deleted successfully");
    } catch (error) {
      toast.error("Something went wrong with testimonial deletion.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return(
    <>
    <AlertModal
    isOpen={open}
    onClose={()=> setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
      />
    <div className="flex items-center justify-between">
      <Heading
      title={title}
      description={description}
      />
      {initialData && (
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={()=>{setOpen(true)}}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      )}
    </div>
    <Separator/>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  w-full">
        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Avatar Image
                </FormLabel>
                <FormControl>
                <ImageUpload 
                  value={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={()=> field.onChange("")}
                />
                </FormControl>
                <FormMessage/>
              </FormItem>
              )}
          />
       <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>
              <FormControl>
               <Input disabled={loading} placeholder="Testimonial user name" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
              </FormLabel>
              <FormControl>
               <Input disabled={loading} placeholder="Testimonial user title" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message
              </FormLabel>
              <FormControl>
               <Input disabled={loading} placeholder="Testimonial message" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Rating
              </FormLabel>
              <FormControl>
               <Input disabled={loading} placeholder="Rated 0 to 5 stars" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
        />
        
       </div>
       <Button disabled={loading} className="ml-auto" type="submit">
        {action}
       </Button>
      </form>
    </Form>
   
    
  </>
  );
};
export default TestimonialForm;