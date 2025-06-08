type FormType = "sign-in" | "sign-up";

type Props = {
  type: FormType;
};

export default function AuthForm({ type }: Props) {
  return <>{type === "sign-in" ? "Sign In Form" : "Sign Up Form"}</>;
}
