import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History & Heritage | Zimbabwe Rugby Union",
  description: "The rich history of rugby in Zimbabwe, from 1895 to the present day.",
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
