import { buttonVariants } from "@/components/ui/button";

const EnrollSuccess = () => {
  return (
    <div className="text-center">
      <h2>Two-Factor Authentication Enabled</h2>
      <p>
        You have successfully enabled Two-Factor Authentication on your account.
      </p>
      <a href="/settings" className={buttonVariants({ variant: "default" })}>
        Go to Settings
      </a>
    </div>
  );
};
export default EnrollSuccess;
