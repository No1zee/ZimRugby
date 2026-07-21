"use client";

import { Mail } from "lucide-react";

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

        {/* Right Group (Form) */}
        <form className="flex w-full lg:w-auto mt-4 lg:mt-0" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="bg-white text-black px-6 py-4 w-full lg:w-80 rounded-l-md outline-none placeholder:text-gray-400 font-medium text-sm"
            required
          />
          <button 
            type="submit"
            className="bg-[#E5F2C9] text-[#00452A] font-black tracking-widest uppercase px-8 py-4 rounded-r-md hover:bg-white transition-colors text-xs shrink-0"
          >
            SUBSCRIBE
          </button>
        </form>

      </div>
    </section>
  );
}
