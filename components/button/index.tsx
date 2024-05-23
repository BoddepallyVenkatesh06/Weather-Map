import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

type IProps = { isLoading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  isLoading = false,
  ...rest
}: IProps) {
  return (
    <button
      {...rest}
      className={classNames(
        `py-[20px] px-[12px] rounded-[5px] bg-btn text-white bg-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed gap-4 `,
        className
      )}
    >
      {children}
    </button>
  );
}
