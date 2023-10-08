import { ElementType, HTMLAttributes } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AutoAnimateOptions } from "@formkit/auto-animate";

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const AutoAnimate: React.FC<Props> = ({
  as: Tag = "div",
  children,
  ...rest
}) => {
  const options: AutoAnimateOptions = {
    duration: 300,
    easing: "ease-in-out",
    disrespectUserMotionPreference: true,
  };
  const [ref] = useAutoAnimate<HTMLElement>();
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
};
