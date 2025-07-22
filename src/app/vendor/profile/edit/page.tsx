/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save as SaveIcon, Upload, X, Camera } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface BannerImage {
  id?: string;
  url: string;
  file?: File;
  isNew?: boolean;
}

export default function Frame() {
  const [formData, setFormData] = useState({
    username: "",
    profilePhoto: "",
    gstNumber: "",
    pcode: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    brand: "",
    description: "",
  });

  const [data, setData] = useState();
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    // fetch vendor data to pre-fill the form
    api.get(`/vendor/me/`)
      .then((res) => {
        const data = res.data;
        setData(res.data);
        setFormData({
          username: data.user_info?.username || "",
          profilePhoto: data.user_info?.profile_photo || "",
          gstNumber: data.gst_no || "",
          pcode: data.pcode || "",
          companyName: data.company_name || "",
          companyEmail: data.company_email || "",
          companyPhone: data.company_phone || "",
          brand: data.brand || "",
          description: data.user_info?.description || "",
        });

        // Set existing profile photo preview
        if (data.user_info?.profile_photo) {
          setProfilePhotoPreview(data.user_info.profile_photo);
        }

        // Set existing banner images (assuming they come in the response)
        console.log(user)
        if (user?.user_banner && Array.isArray(user?.user_banner)) {
          setBannerImages(user?.user_banner.map((img: any) => ({
            id: img.id,
            url: img.url || img.image,
            isNew: false
          })));
        }
      })
      .catch((err) => console.error("Failed to fetch vendor profile:", err));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setProfilePhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    // Create preview URLs and add to banner images
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newBanner: BannerImage = {
          url: e.target?.result as string,
          file: file,
          isNew: true
        };
        setBannerImages(prev => [...prev, newBanner]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = '';
  };

  const removeBannerImage = async (index: number) => {
    const bannerToRemove = bannerImages[index];
    if (!bannerToRemove.id) {
      // Just remove locally if not uploaded yet
      setBannerImages(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await api.delete(`/users/${userId}/delete_banner/${bannerToRemove.id}/`);
      setBannerImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const uploadProfilePhoto = async (): Promise<string | null> => {
    if (!profilePhotoFile) return null;

    const formData = new FormData();
    formData.append('profile_photo', profilePhotoFile);

    try {
      const response = await api.post(`/users/${user?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.profile_photo || response.data.user_info?.profile_photo;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  };

  const uploadBannerImages = async (userId: number) => {
    const newBanners = bannerImages.filter(banner => banner.isNew && banner.file);

    if (newBanners.length === 0) return bannerImages;

    try {
      const uploadPromises = newBanners.map(async (banner) => {
        if (!banner.file) return null;

        const formData = new FormData();
        formData.append('user_banner', banner.file);

        const response = await api.patch(`/users/${userId}/upload_banner/`, formData
         );

        return {
          index: bannerImages.findIndex(b => b === banner),
          data: response.data
        };
      });

      const results = await Promise.all(uploadPromises);

      const updated = [...bannerImages];
      results.forEach(result => {
        if (result && result.index !== -1) {
          updated[result.index] = {
            ...updated[result.index],
            isNew: false,
            url: result.data.url || result.data.image || updated[result.index].url,
            file: undefined
          };
        }
      });
      // Return it instead
      return updated;

    } catch (error) {
      console.error('Error uploading banners:', error);
      throw error;
    }

  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      // First update basic profile data
      const payload = {
        username: formData.username,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        company_phone: formData.companyPhone,
        brand: formData.brand,
        gst_no: formData.gstNumber,
        pcode: formData.pcode,
        description: formData.description,
      };

      await api.patch(`/vendor/${data?.id}/`, payload);

      // Upload profile photo if changed
      if (profilePhotoFile) {
        await uploadProfilePhoto();
      }

      // Upload new banner images
      let finalBannerImages = bannerImages; // Start with current banners
      if (userId) {
        // The function now returns the updated banner list
        finalBannerImages = await uploadBannerImages(userId);
      }

      setBannerImages(finalBannerImages);

      toast.success("Profile updated successfully!");

      // Instead of reloading, refetch the data to update state
      // This is better than window.location.reload()
      const response = await api.get(`/vendor/me/`);
      const updatedData = response.data;
      setData(updatedData);

      // Update form data with fresh data
      setFormData({
        username: updatedData.user_info?.username || "",
        profilePhoto: updatedData.user_info?.profile_photo || "",
        gstNumber: updatedData.gst_no || "",
        pcode: updatedData.pcode || "",
        companyName: updatedData.company_name || "",
        companyEmail: updatedData.company_email || "",
        companyPhone: updatedData.company_phone || "",
        brand: updatedData.brand || "",
        description: updatedData.user_info?.description || "",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formFields = [
    { id: "username", label: "Username", value: formData.username },
    { id: "companyName", label: "Company Name", value: formData.companyName },
    { id: "companyPhone", label: "Company Phone", value: formData.companyPhone },
    { id: "companyEmail", label: "Company Email", value: formData.companyEmail },
    { id: "brand", label: "Brand name", value: formData.brand },
    { id: "gstNumber", label: "GST Number", value: formData.gstNumber },
    { id: "pcode", label: "P Code", value: formData.pcode },
  ];

  const API_BASE_URL = "http://localhost:8000/";

  return (
    <div className="flex flex-col w-full max-w-7xl items-start gap-6 px-10 py-0">
      <header className="flex items-center gap-[95px] relative self-stretch w-full">
        <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-2xl">
          My Profile
        </h1>
      </header>

      <main className="flex w-full max-w-[1049px] items-start gap-16 pl-[60px] pr-4 py-0">
        <section className="flex flex-col items-center gap-[7px]">
          {/* Profile Photo Upload */}
          <div className="relative w-[250px] h-[250px] overflow-hidden rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {profilePhotoPreview ? (
              <img
                className="w-full h-full object-cover"
                alt="Profile photo"
                src={
                  profilePhotoPreview.startsWith("data:")
                    ? profilePhotoPreview
                    : API_BASE_URL + profilePhotoPreview
                }
              />
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No photo uploaded</p>
              </div>
            )}
          </div>

          <label className="text-[#018cfc] text-[13px] [font-family:'Inter-Regular',Helvetica] underline cursor-pointer hover:text-blue-700">
            Upload Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </label>
        </section>

        <section className="flex flex-col items-start gap-8 flex-1">
          <div className="flex flex-col items-start gap-6 w-full">
            {formFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col items-start justify-center gap-2 w-full"
              >
                <label
                  htmlFor={field.id}
                  className="[font-family:'Inter-Regular',Helvetica] font-normal text-black text-base"
                >
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  value={field.value}
                  onChange={handleChange}
                  className="p-4 [font-family:'Inter-Regular',Helvetica] text-[13px]"
                />
              </div>
            ))}

            <div className="flex flex-col items-start justify-center gap-2 w-full">
              <label
                htmlFor="description"
                className="[font-family:'Inter-Regular',Helvetica] font-normal text-black text-base"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="h-[104px] p-4 [font-family:'Inter-Regular',Helvetica] text-[13px] text-[#a0a1a1]"
              />
            </div>

            {/* Banner Images Section */}
            <div className="flex flex-col items-start gap-4 w-full">
              <label className="[font-family:'Inter-Regular',Helvetica] font-normal text-black text-base">
                Banner Images
              </label>

              {/* Display existing banner images */}
              {bannerImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-4">
                  {bannerImages.map((banner, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={banner.url}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeBannerImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {banner.isNew && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload new banner images */}
              <Card className="w-full border-dashed border-[#cfcccc] hover:border-blue-300 transition-colors">
                <CardContent className="flex flex-col h-[126px] items-center justify-center gap-3 p-4">
                  <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center">
                    <div className="relative w-[54px] h-[54px] flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#666869] text-[13px]">
                      Upload Banner Images (Multiple files allowed)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBannerImagesChange}
                      className="hidden"
                    />
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isUploading}
            className="flex items-center justify-center gap-2.5 px-6 py-4 w-full bg-[#5ca131] rounded-lg h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveIcon className="w-[18px] h-[18px]" />
            <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base">
              {isUploading ? "Saving..." : "Save"}
            </span>
          </Button>
        </section>
      </main>
    </div>
  );
}