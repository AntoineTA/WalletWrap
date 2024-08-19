import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type Error = {
  title: string;
  message: string;
  code?: number;
};

export const ErrorAlert = (error: Error) => {
  const formattedCode = error.code ? ` (code ${error.code})` : "";

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>{error.title}</AlertTitle>
      <AlertDescription>
        {error.message} {formattedCode}
      </AlertDescription>
    </Alert>
  );
};
