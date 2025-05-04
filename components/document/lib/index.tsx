import * as React from "react";
import {
  Links,
  Meta,
  PrefetchPageLinks,
  Scripts,
  ScrollRestoration,
} from "react-router";

export type DocumentProps = Partial<React.ComponentPropsWithRef<"html">>;
export const Document: React.FC<DocumentProps> & {
  Body: React.FC<BodyProps>;
  Head: React.FC<HeadProps>;
} = ({ children, lang = "en", ...props }: DocumentProps) => (
  <html {...props} lang={lang}>
    {" "}
    <DocumentContext.Provider
      value={{
        charSet: "utf-8",
        viewportWidth: "device-width",
        viewportInitialScale: 1,
      }}
    >
      {children}
    </DocumentContext.Provider>
  </html>
);

export type BodyProps = Partial<React.ComponentProps<"body">>;
Document.Body = ({ children, ...props }) => (
  <body {...props}>
    {children}
    <ScrollRestoration />
    <Scripts />
  </body>
);
Document.Body.displayName = "Document.Body";

export type HeadProps = Partial<React.ComponentProps<"head">> & {
  charSet?: string;
  viewport?: { width?: string; initialScale?: number };
  prefetchPaths?: `/${string}`[];
};
Document.Head = ({
  charSet,
  children,
  lang = "en",
  prefetchPaths = [],
  viewport: viewportProps = {},
  ...props
}) => (
  <head {...props} lang={lang}>
    <Charset charSet={charSet} />
    <Viewport {...viewportProps} />
    {children}
    {prefetchPaths.map((path) => (
      <PrefetchPageLinks key={path} page={path} />
    ))}
    <Meta />
    <Links />
  </head>
);
Document.Head.displayName = "Document.Head";

type ViewportProps = { width?: string; initialScale?: number };
const Viewport: React.FC<ViewportProps> = ({
  width = "device-width",
  initialScale = 1,
}) => (
  <meta
    content={`width=${width}, initial-scale=${initialScale}`}
    name="viewport"
  />
);

type CharsetProps = { charSet?: string };
const Charset: React.FC<CharsetProps> = ({ charSet = "utf-8" }) => (
  <meta charSet={charSet} />
);

type DocumentContextValue = {
  charSet: string;
  viewportWidth: string;
  viewportInitialScale: number;
};
const DocumentContext = React.createContext<DocumentContextValue | null>(null);

const DocumentContextProvider: React.FC<
  React.FragmentProps & Partial<DocumentContextValue>
> = ({
  children,
  charSet = "utf-8",
  viewportWidth = "device-width",
  viewportInitialScale = 1,
}) => (
  <DocumentContext.Provider
    value={{
      charSet,
      viewportWidth,
      viewportInitialScale,
    }}
  >
    {children}
  </DocumentContext.Provider>
);

const useDocumentContext = () => {
  const context = React.useContext(DocumentContext);

  if (!context)
    throw new Error(
      "useDocumentContext must be used within a Document component",
    );

  return context;
};
