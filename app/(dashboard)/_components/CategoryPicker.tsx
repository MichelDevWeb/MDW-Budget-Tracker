"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface Props {
  onChange: (value: string) => void;
}
const CategoryPicker = ({ onChange }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (!value) return;
    // When the value changes, call the onChange callback
    onChange(value);
  }, [value, onChange]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return response.json();
    },
  });

  const successCallback = React.useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select a category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog successCallback={successCallback} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data?.map((category: Category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name);
                    setOpen((prev) => !prev);
                  }}
                >
                  <CategoryRow category={category} />
                  <Check
                    className={cn(
                      "ml-2 w-4 h-4 opacity-0",
                      value === category.name && "opacity-100"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
