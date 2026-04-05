import { Loader2 } from "lucide-react";
export default function LoadingButton({ isLoading, children, className, ...props }) {
  return (
    <button disabled={isLoading} className={className} {...props}>
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
}
