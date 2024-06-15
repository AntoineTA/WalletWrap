import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UnenrollMFAForm from "./UnenrollMFAForm"

const UnenrollMFA = () => {
  return (
    <Card className="mx-auto max-w-lg" data-testid="UnenrollMFA-card">
    <CardHeader>
      <CardTitle className="text-2xl">Remove Two-Factor Authentication</CardTitle>
      <CardDescription>
        Are you sure you want to remove two-factor authentication?
      </CardDescription>
    </CardHeader>
    <CardContent>
      <UnenrollMFAForm />
    </CardContent>
    </Card>
  )
}
export default UnenrollMFA