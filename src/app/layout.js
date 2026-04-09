
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Parcel - Enterprise Logistics",
  description: "Next Generation courier and delivery management system.",
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
