import { forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"

export interface SubmitButtonProps 
  extends ButtonProps {
  text: string
  isPending: boolean
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, text, isPending, ...props}, ref) => {

    if (!isPending) {
      return (
        <Button
          type="submit"
          ref={ref}
          {...props}
        >
          {text}
        </Button>
      )
    }

    if (isPending) {
      return (
        <Button
          disabled
          ref={ref}
          {...props}
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )
    }
  }
)
SubmitButton.displayName = "SubmitButton"
export { SubmitButton }