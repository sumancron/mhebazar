"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";

const ComparePage = () => {
  return (
<>
  {/* Breadcrumb */}
       <div className="w-full px-4 sm:px-8 pt-6">
         <Breadcrumb
           items={[
             { label: "Home", href: "/" },
             { label: "Compare", href: "/compare" },
           ]}
         />
       </div>
</>
  );
};

export default ComparePage;