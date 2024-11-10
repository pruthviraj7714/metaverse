"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { redirect, useRouter } from "next/navigation";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(2, { message: "The Username should be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "The Password should be at least 6 characters" }),
});

export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    try {
      await axios.post(`${BACKEND_URL}/user/signup`, {
        username : values.username,
        password : values.password
      })
      toast.success('User Successfully Created', {description : "Now Sign in with your credentials"})
      router.push('/auth/signin');
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);

    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="bg-red-400 h-full flex items-center justify-center">
        Here is the image
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="tony43" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-center mt-1.5 gap-1.5">
            <span>Already have an Account?</span>{" "}
            <Link href={'/auth/signin'} className="text-blue-500 underline cursor-pointer hover:text-blue-600">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
