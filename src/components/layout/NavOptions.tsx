"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const categories = [
	"Battery",
	"Pallet Truck",
	"Stacker",
	"Manual Platform Trolly",
	"Platform Truck",
	"Tow Truck",
	"Dock Leveller",
	"Scissors Lift",
	"Electric Pallet Truck (BOPT)",
	"Reach Truck",
];

const subCategories = [
	"Racking System",
	"Order Picker",
	"Very Narrow Aisle Truck",
	"Automated Guided Vehicle",
	"Container Handler",
	"Forklift Attachment",
	"Safety Solutions",
	"Spare Parts",
	"Charger",
	"Explosionproof Mhe Solution",
];

const batteryProducts = [
	{
		title: "Lithium-Ion Battery",
		count: 12,
		image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=120&h=120&fit=crop&crop=center",
	},
	{
		title: "Lead-Acid Traction Battery",
		count: 7,
		image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&crop=center",
	},
];

export default function CategoryMenu({ isOpen }: { isOpen: boolean }) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className="absolute left-0 top-full z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
				>
					<div className="flex min-w-[800px]">
						{/* Left Categories Column */}
						<div className="w-64 bg-gray-50 border-r border-gray-200">
							<div className="p-2">
								{categories.map((category, index) => (
									<div
										key={index}
										className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-white hover:text-orange-600 cursor-pointer rounded transition-colors ${
											category === "Battery"
												? "bg-white text-orange-600 font-medium"
												: "text-gray-700"
										}`}
									>
										<span>{category}</span>
										<ChevronRight className="w-4 h-4" />
									</div>
								))}
							</div>
						</div>

						{/* Middle Categories Column */}
						<div className="w-64 bg-gray-50 border-r border-gray-200">
							<div className="p-2">
								{subCategories.map((category, index) => (
									<div
										key={index}
										className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-orange-600 cursor-pointer rounded transition-colors"
									>
										<span>{category}</span>
										<ChevronRight className="w-4 h-4" />
									</div>
								))}
							</div>
						</div>

						{/* Right Products Column */}
						<div className="w-80 bg-white p-4">
							<div className="space-y-4">
								{batteryProducts.map((product, index) => (
									<div
										key={index}
										className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
									>
										<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
											<Image
												src={product.image}
												alt={product.title}
												width={64}
												height={64}
												className="w-full h-full object-cover"
												unoptimized
											/>
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-gray-900 text-sm mb-1">
												{product.title}
											</h4>
											<div className="inline-flex items-center justify-center bg-orange-100 text-orange-700 rounded-full px-2 py-1 text-xs font-medium min-w-[24px]">
												{product.count.toString().padStart(2, "0")}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}