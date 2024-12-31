import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { addNewCompany } from "@/api/apiCompanies";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only Images are allowed" }
    ),
});

function AddCompanyDrawer({ fetchCompanies }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddComapany,
    error: errorAddComapny,
    data: dataAddComapny,
    fn: fnAddComapny,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    fnAddComapny({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddComapny?.length > 0) fetchCompanies();
  }, [loadingAddComapany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="sm" type="button">
          {" "}
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Comapny</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Company name" {...register("name")} />
          <Input
            type="file"
            accept="image/"
            className="file:text-gray-500 "
            {...register("logo")}
          />
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorAddComapny?.message && (
          <p className="text-red-500">{errorAddComapny?.message}</p>
        )}
        {loadingAddComapany && <BarLoader width={"100%"} color="#36d7b7" />}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddCompanyDrawer;
