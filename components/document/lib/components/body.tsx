import * as React from "react";

export type BodyProps = Partial<React.ComponentProps<"body">>;

export const Body: React.FC<BodyProps> = (props) => <body {...props} />;
