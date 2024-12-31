"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, TrashIcon } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Category } from ".prisma/client";
import DeleteCategoryDialog from "@/app/(dashboard)/_components/DeleteCategoryDialog";

const page = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetch(`/api/categories`).then((res) => res.json()),
  });
  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <>
      {/* HEADER */}
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6 px-6 mx-auto">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      {/* END HEADER */}
      <div className="container flex flex-col gap-4 p-4 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    Categories
                    <div className="text-sm text-muted-foreground">
                      Sorted by name
                    </div>
                  </div>
                </div>

                <CreateCategoryDialog
                  successCallback={() => categoriesQuery.refetch()}
                  trigger={
                    <Button className="gap-2 text-sm">
                      <PlusCircle className="h-4 w-4" />
                      Create category
                    </Button>
                  }
                />
              </CardTitle>
            </CardHeader>
            <Separator />
            {!dataAvailable && (
              <div className="flex h-40 w-full flex-col items-center justify-center">
                <p>No categories yet</p>
                <p className="text-sm text-muted-foreground">
                  Create one to get started
                </p>
              </div>
            )}
            {dataAvailable && (
              <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoriesQuery.data.map((category: Category) => (
                  <CategoryCard category={category} key={category.name} />
                ))}
              </div>
            )}
          </Card>
        </SkeletonWrapper>
      </div>
    </>
  );
};

export default page;

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}
