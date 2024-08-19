import { buttonVariants } from "@/components/ui/button";

const UnenrollSuccess = () => {
  return (
    <div className="text-center">
      <h2>Two-Factor Authentication Removed</h2>
      <p>You have removed Two-Factor Authentication from your account.</p>
      <a href="/settings" className={buttonVariants({ variant: "default" })}>
        Go to Settings
      </a>
    </div>
  );
};
export default UnenrollSuccess;
