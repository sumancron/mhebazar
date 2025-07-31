import HomeBanner from "@/components/layout/HomeBanner";
import CategoryButtons from "@/components/home/CategoryButtons";
import MostPopular from "@/components/home/MostPopular";
import NewArrivalsAndTopSearches from "@/components/home/NewArrivalsAndTopSearches";
import SpareParts from "@/components/home/SparepartsFeatured";
import VendorProductsFeatured from "@/components/home/VendorProdcutsFeatured";
import ExportProductsFeatured from "@/components/home/ExportProdcutsFeatured";
import TestimonialsCarousel from "@/components/elements/Testimonials";
import Marquee from "react-fast-marquee";
// import ProductForm from "@/components/forms/uploadForm/ProductForm";
// import CategoryForm from "@/components/forms/uploadForm/CategoryForm";
// import SubcategoryForm from "@/components/forms/uploadForm/SubcategoryForm";
// import ProductCards from "@/components/test/card";
// import MheWriteAReview from "@/components/test/reviewCard";

export default function HomePage() {
  return (
    <>

      {/* Home page hero/banner */}
      <HomeBanner />

      {/* Category buttons section */}

      <div className="max-w-[90vw] mx-auto">
        <CategoryButtons />

        <div className="flex flex-col md:flex-row gap-4 md:gap-14 w-full py-8 mx-auto justify-center items-start px-4 md:px-0">
          <div className="flex-1 w-full">
            <MostPopular />
          </div>
          <div className="flex-1 w-full">
            <NewArrivalsAndTopSearches />
          </div>
        </div>

        <SpareParts />


        <VendorProductsFeatured />

        <ExportProductsFeatured />

        <Marquee className="my-4">
          <img src={"/logos/AEPL.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Asmita.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Bolzoni1.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/BYD Forklift.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Cascade.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Godrej.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Greentech India.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Logisnext.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Logisnext-1.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Logisnext-2.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Logisnext-3.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Manasi Engineering.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/manasi-engineering.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/MHE Bazar.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/PHL.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Speciality Urethanes Pvt Ltd.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Stackon.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/STW.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Tallboy.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Troax.png"} alt="AEP Logo" className="h-16 mx-4" />
          <img src={"/logos/Unik.png"} alt="AEP Logo" className="h-16 mx-4" />
        </Marquee>

        <TestimonialsCarousel />

        {/* <ProductCards />
        <MheWriteAReview  /> */}

        {/* <h1 className="mb-10 text-center">Category</h1>
        <CategoryForm />

        <h1 className="mb-10 text-center">Subcategory</h1>
        <SubcategoryForm />

        <h1 className="mb-10 text-center">Product</h1>
        <ProductForm /> */}
      </div>

    </>
  );
}
