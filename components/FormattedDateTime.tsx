import { cn, formatDateTime } from "@/lib/utils";

type Props = {
  date: string | null;
  className?: string;
};

export default function FormattedDateTime({ date, className }: Props) {
  return (
    <time className={cn("body-1 text-light-200", className)}>
      {formatDateTime(date)}
    </time>
  );
}
