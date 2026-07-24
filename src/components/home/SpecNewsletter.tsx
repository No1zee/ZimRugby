import { Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function SpecNewsletter() {
  return (
    <section className="bg-rich-black w-full px-8 pb-16">
      <div className="max-w-[1600px] mx-auto bg-[#00452A] text-white py-12 px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between rounded-3xl gap-8">
        
        {/* Left Group */}
        <div className="flex items-center gap-6 lg:gap-8 w-full lg:w-auto">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading text-2xl lg:text-3xl uppercase mb-2">SUBSCRIBE TO OUR NEWSLETTER</h2>
            <p className="font-body text-sm text-white/80 max-w-md">
              Subscribe to our newsletter and be the first to receive the latest news, ticket offers, and exclusive merchandise drops.
            </p>
          </div>
        </div>

        {/* Right Group (Standalone Client Form Component) */}
        <NewsletterForm />

      </div>
    </section>
  );
}
