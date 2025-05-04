import * as React from "react";

export type HeadProps = Partial<React.ComponentProps<"head">>;

export const Head: React.FC<HeadProps> = ({ lang = "en", ...props }) => (
  <head {...props} />
);
