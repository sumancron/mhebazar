import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import React, { JSX } from "react";
import Image from 'next/image';


const productData = {
  title: "Hand Pallet Truck",
  quantity: 1,
  lockInPeriod: "2 months",
  location:
    "No: 21, Greams Lane, Off, Greams Road, Chennai, Tamil Nadu 600006, India",
  description:
    "MHEBazar Rentals' hand pallet trucks are a cost-effective and reliable solution for material handling needs. With top-quality equipment and maintenance-included costing, you can enjoy hassle-free ownership. Trained operators and technical consulting are available, and renting eliminates obsolescence and depreciation costs. Choose the Opex model for capital savings and transform fixed assets into flexible business expenditures. With comprehensive maintenance included offerings, you can rely on MHEBazar Rentals for faster and consistent solutions for all your MHE needs.",
};

const formFields = [
  { id: "fullName", placeholder: "Full name", type: "text" },
  { id: "companyName", placeholder: "Company name", type: "text" },
  { id: "email", placeholder: "Email", type: "email" },
  { id: "phone", placeholder: "Phone", type: "tel" },
];

const QuoteForm = (): JSX.Element => {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-[736px] p-0 border-none">
        <Card className="border-none">
          <CardContent className="flex flex-col w-full items-start gap-6 p-6 relative bg-white">
            <div className="flex-col items-start gap-6 self-stretch w-full flex">
              <div className="items-start gap-8 self-stretch w-full flex">
                <Image
                  src={"/no-product.png"} // Replace `imageUrl` with actual variable
                  alt="Hand Pallet Truck"
                  width={329}
                  height={262}
                  className="relative object-cover"
                />
                <div className="flex-col items-start gap-2 pt-4 pb-0 px-0 flex-1 grow flex">
                  <h2 className="self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[normal]">
                    {productData.title}
                  </h2>

                  <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#434344] text-base tracking-[0] leading-6">
                    Qty : {productData.quantity}
                  </p>

                  <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#434344] text-base tracking-[0] leading-6">
                    Lock In period: {productData.lockInPeriod}
                  </p>

                  <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#434344] text-base tracking-[0] leading-6">
                    <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#434344] text-base tracking-[0] leading-6">
                      Location: {productData.location}
                    </span>
                  </p>
                </div>
              </div>

              <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#434344] text-base tracking-[0] leading-6">
                {productData.description}
              </p>

              <div className="flex-col items-start gap-4 self-stretch w-full flex">
                <h3 className="self-stretch mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal]">
                  Get a Quote
                </h3>

                <div className="items-center gap-6 self-stretch w-full flex">
                  <div className="flex-1">
                    <Input
                      className="h-[52px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]"
                      placeholder={formFields[0].placeholder}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      className="h-[52px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]"
                      placeholder={formFields[1].placeholder}
                    />
                  </div>
                </div>

                <div className="items-center gap-6 self-stretch w-full flex">
                  <div className="flex-1">
                    <Input
                      className="h-[52px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]"
                      placeholder={formFields[2].placeholder}
                      type="email"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      className="h-[52px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]"
                      placeholder={formFields[3].placeholder}
                      type="tel"
                    />
                  </div>
                </div>

                <div className="self-stretch w-full">
                  <Textarea
                    className="min-h-[72px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]"
                    placeholder="Message"
                  />
                </div>
              </div>
            </div>

            <DialogClose className="absolute w-6 h-6 top-3.5 right-3.5 flex items-center justify-center">
              <X className="w-[18px] h-[18px]" />
            </DialogClose>

            <Button className="w-full h-auto items-center justify-center gap-3 p-4 bg-[#5ca131] rounded-md hover:bg-hover">
              <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-white text-[13px] tracking-[0] leading-[normal]">
                Submit
              </span>
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteForm;
