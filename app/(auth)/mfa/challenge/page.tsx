import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ChallengeMFAForm from "./ChallengeMFAForm"

const ChallengeMFA = () => {
  return (
    <Card className="mx-auto max-w-lg" data-testid="ChallengeMFA-card">
    <CardHeader>
      <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
      <CardDescription>
        Enter the code from your authenticator app to complete the process.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChallengeMFAForm />
    </CardContent>
    </Card>
  )
}
export default ChallengeMFA