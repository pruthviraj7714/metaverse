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
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function SignInPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/signin`, {
        username : values.username,
        password : values.password
      })
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      toast.success('Successfully Signed in!')
      router.push('/home');
    } catch (error : any) {
      console.log(error);
      toast.error(error.response.data.message);

    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
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
                      <Input
                        placeholder="Enter your username here"
                        {...field}
                      />
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
                      <Input
                        placeholder="Enter your password here"
                        type="password"
                        {...field}
                      />
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
            <span>Don't have an Account?</span>{" "}
            <Link
              href={"/auth/signup"}
              className="text-blue-500 underline cursor-pointer hover:text-blue-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-red-400 h-full flex items-center justify-center">
        Here is the image
      </div>
    </div>
  );
}
