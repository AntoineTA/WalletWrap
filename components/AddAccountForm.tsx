import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { SubmitButton } from "@/components/ui/submit-button";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useAccountsContext } from "@/contexts/AccountsContext";

type AddAccountFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  starting_balance: z.coerce.number(),
});

export const AddAccountForm = ({ open, setOpen }: AddAccountFormProps) => {
  const { error, isPending, insertAccount } = useAccountsContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "checking",
      starting_balance: 0,
    },
    mode: "onTouched",
  });

  const createAccount = async (values: z.infer<typeof formSchema>) => {
    await insertAccount({ ...values, id: undefined });
    if (!error) {
      form.reset();
      setOpen(false);
    }
    location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createAccount)}
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
