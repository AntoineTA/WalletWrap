import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EnrollMFAForm from "./EnrollMFAForm";

const EnrollMFA = () => {
  return (
    <Card className="mx-auto max-w-lg" data-testid="EnrollMFA-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Add Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Scan the QR code below with your authenticator app to enable 2FA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnrollMFAForm />
      </CardContent>
    </Card>
  );
};
export default EnrollMFA;
