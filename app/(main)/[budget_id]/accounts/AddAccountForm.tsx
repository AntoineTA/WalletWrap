import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { insertAccount } from "./actions";
import { ErrorAlert, type Error } from "@/components/ui/error-alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  starting_balance: z.coerce.number(),
});

type AddAccountFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  budget_id: number;
};

export const AddAccountButton = ({ budget_id }: { budget_id: number }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-52">
      <Card
        onClick={() => setIsAdding(true)}
        className="flex justify-center items-center text-slate-600 h-24 border-dashed hover:shadow-lg hover:border-solid hover:text-black cursor-pointer"
      >
        <span className="flex gap-2">
          <Plus size={24} />
          New Account
        </span>
      </Card>
      <AddAccountForm
        open={isAdding}
        setOpen={setIsAdding}
        budget_id={budget_id}
      />
    </div>
  );
};

export const AddAccountForm = ({
  open,
  setOpen,
  budget_id,
}: AddAccountFormProps) => {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "checking",
      starting_balance: 0,
    },
    mode: "onTouched",
  });

  const addAccount = async (values: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    const newAccount = { ...values, budget_id: budget_id };

    const { error } = await insertAccount(newAccount);

    setPending(false);

    if (error) {
      setError({
        title: "We could not add the account.",
        message: error.message,
        code: error.code,
      });
    }
    if (!error) {
      setOpen(false);
      location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(addAccount)}
            aria-label="add account form"
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right col-span-1">Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        fieldState.error &&
                          "border-destructive focus-visible:ring-destructive",
                        "col-span-3",
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right col-span-1">
                    Account Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="checking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">checking</SelectItem>
                      <SelectItem value="savings">savings</SelectItem>
                      <SelectItem value="credit card">credit card</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="starting_balance"
              render={({ field, fieldState }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right col-span-1">
                    Balance
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn(
                        fieldState.error &&
                          "border-destructive focus-visible:ring-destructive",
                        "col-span-3",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="space-x-3">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <SubmitButton
                  text={"Save"}
                  isPending={isPending}
                  disabled={!form.formState.isValid}
                />
              </div>
            </DialogFooter>
          </form>
          {error && <ErrorAlert {...error} />}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
