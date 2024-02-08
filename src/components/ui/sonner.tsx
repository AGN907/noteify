import { useTheme } from "@/providers/ThemeProvider";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border group-[.toast]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toast]:bg-success group-[.toast]:text-success-foreground",
          info: "group-[.toast]:bg-info group-[.toast]:text-info-foreground",
          error: "group-[.toast]:bg-error group-[.toast]:text-error-foreground",
          warning:
            "group-[.toast]:bg-warning group-[.toast]:text-warning-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
