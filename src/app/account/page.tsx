"use client";
import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User, Mail, MapPin, Edit2, Plus, Trash2, LogOut, ShoppingBag, Phone,
  Calendar, Globe, Building2, Home, Briefcase, Navigation, Save, Menu, X
} from "lucide-react";

type UserType = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  joinDate: string;
  totalOrders: number;
};

type AddressType = {
  id: number;
  name: string;
  address: string;
  phone: string;
  landmark: string;
  type: string;
  isDefault: boolean;
};

const fallbackUser: UserType = {
  name: "Suman Kumar",
  email: "suman@email.com",
  phone: "+91 9876543210",
  avatar: "https://ui-avatars.com/api/?name=Suman+Kumar&background=3b82f6&color=fff&size=128",
  dob: "1998-07-15",
  gender: "Male",
  city: "Patna",
  state: "Bihar",
  country: "India",
  pincode: "800001",
  joinDate: "2023-01-15",
  totalOrders: 24,
};

const fallbackAddresses: AddressType[] = [
  {
    id: 1,
    name: "Home",
    address: "123, Main Street, Patna, Bihar, 800001",
    phone: "+91 9876543210",
    landmark: "Near Gandhi Maidan",
    type: "Home",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    address: "456, Corporate Park, Ranchi, Jharkhand, 834001",
    phone: "+91 9123456780",
    landmark: "Opposite Big Bazaar",
    type: "Office",
    isDefault: false,
  },
];

const TABS = [
  { key: "profile", label: "Personal Info", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "contact", label: "Contact", icon: Phone },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editProfile, setEditProfile] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [user, setUser] = useState<UserType>(fallbackUser);
  const [addresses, setAddresses] = useState<AddressType[]>(fallbackAddresses);
  const [editAddressId, setEditAddressId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressType>({
    id: 0, name: "", address: "", phone: "", landmark: "", type: "Home", isDefault: false,
  });
  const [contactForm, setContactForm] = useState<Omit<UserType, "avatar" | "joinDate" | "totalOrders" | "name" | "dob" | "gender">>({
    email: fallbackUser.email,
    phone: fallbackUser.phone,
    city: fallbackUser.city,
    state: fallbackUser.state,
    country: fallbackUser.country,
    pincode: fallbackUser.pincode,
  });

  // Fetch user and addresses from API, fallback to mock if fails
  useEffect(() => {
    (async () => {
      try {
        // Replace with your API endpoints
        const [userRes, addrRes] = await Promise.all([
          fetch("/user"),
          fetch("/addresses"),
        ]);
        if (userRes.ok) setUser(await userRes.json());
        if (addrRes.ok) setAddresses(await addrRes.json());
      } catch {
        setUser(fallbackUser);
        setAddresses(fallbackAddresses);
      }
    })();
  }, []);

  // Handlers
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleProfileSave = () => setEditProfile(false);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox" && "checked" in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setNewAddress({ ...newAddress, [name]: fieldValue });
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.phone) return;
    const addr = { ...newAddress, id: Date.now() };
    setAddresses(a =>
      addr.isDefault ? a.map(x => ({ ...x, isDefault: false })).concat(addr) : [...a, addr]
    );
    setShowAddForm(false);
    setNewAddress({ id: 0, name: "", address: "", phone: "", landmark: "", type: "Home", isDefault: false });
  };

  const handleSaveAddress = () => {
    setAddresses(a =>
      a.map(x =>
        x.id === editAddressId
          ? { ...newAddress }
          : newAddress.isDefault ? { ...x, isDefault: false } : x
      )
    );
    setEditAddressId(null);
    setNewAddress({ id: 0, name: "", address: "", phone: "", landmark: "", type: "Home", isDefault: false });
  };

  const handleDeleteAddress = (id: number) => setAddresses(a => a.filter(x => x.id !== id));
  const handleEditAddress = (addr: AddressType) => {
    setEditAddressId(addr.id);
    setNewAddress({ ...addr });
  };

  const getAddressIcon = (type: string) =>
    type === "Home" ? <Home size={16} /> : type === "Office" ? <Briefcase size={16} /> : <Navigation size={16} />;

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  const handleContactSave = () => {
    setUser({ ...user, ...contactForm });
    setEditContact(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            </div>
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <Image src={user.avatar} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 bg-white rounded-xl border border-gray-200 h-fit p-6">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="relative">
                <Image src={user.avatar} alt="Avatar" width={64} height={64} className="w-16 h-16 rounded-full border-2 border-blue-100" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user.totalOrders} Orders</span>
                  <span className="text-xs text-gray-500">Since {new Date(user.joinDate).getFullYear()}</span>
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.key ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              <Link href="/account/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                <ShoppingBag size={20} />
                <span className="font-medium">My Orders</span>
              </Link>
              <Link href="/contact" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                <Phone size={20} />
                <span className="font-medium">Contact Support</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4">
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <Image src={user.avatar} alt="Avatar" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-blue-100" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                    {TABS.map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setActiveTab(tab.key);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeTab === tab.key ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <tab.icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <section className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    {!editProfile && (
                      <button
                        onClick={() => setEditProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                  {editProfile ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: "Full Name", name: "name", type: "text" },
                          { label: "Date of Birth", name: "dob", type: "date" },
                          { label: "Gender", name: "gender", type: "select" },
                          { label: "Phone Number", name: "phone", type: "tel" },
                          { label: "City", name: "city", type: "text" },
                          { label: "State", name: "state", type: "text" },
                          { label: "Country", name: "country", type: "text" },
                          { label: "PIN Code", name: "pincode", type: "text" },
                        ].map(field =>
                          field.type === "select" ? (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                              <select
                                name={field.name}
                                value={user[field.name as keyof UserType]}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          ) : (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                              <input
                                type={field.type}
                                name={field.name}
                                value={user[field.name as keyof UserType]}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleProfileSave}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditProfile(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium text-gray-900">{user.dob}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Globe className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium text-gray-900">{user.gender}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">
                              {user.city}, {user.state}, {user.country} - {user.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <section className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Addresses</h2>
                    {!showAddForm && (
                      <button
                        onClick={() => {
                          setShowAddForm(true);
                          setEditAddressId(null);
                          setNewAddress({ id: 0, name: "", address: "", phone: "", landmark: "", type: "Home", isDefault: false });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        Add Address
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {addresses.map(addr =>
                      editAddressId === addr.id ? (
                        <div key={addr.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                              <input
                                type="text"
                                name="name"
                                value={newAddress.name}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Home, Office, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                name="type"
                                value={newAddress.type}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <textarea
                              name="address"
                              value={newAddress.address}
                              onChange={handleAddressChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter complete address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Contact number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                              <input
                                type="text"
                                name="landmark"
                                value={newAddress.landmark}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nearby landmark"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={newAddress.isDefault}
                              onChange={handleAddressChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm text-gray-700">Set as default address</label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveAddress}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditAddressId(null)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={addr.id} className="flex items-start justify-between border border-blue-100 rounded-lg p-4 bg-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getAddressIcon(addr.type)}
                              <h3 className="font-semibold text-gray-900">{addr.name}</h3>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{addr.type}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-1">{addr.address}</p>
                            <p className="text-gray-500 text-sm">{addr.phone}</p>
                            {addr.landmark && <p className="text-gray-400 text-sm">Near {addr.landmark}</p>}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                    {showAddForm && (
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                              <input
                                type="text"
                                name="name"
                                value={newAddress.name}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Home, Office, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                name="type"
                                value={newAddress.type}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <textarea
                              name="address"
                              value={newAddress.address}
                              onChange={handleAddressChange}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter complete address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Contact number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                              <input
                                type="text"
                                name="landmark"
                                value={newAddress.landmark}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nearby landmark"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={newAddress.isDefault}
                              onChange={handleAddressChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm text-gray-700">Set as default address</label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddAddress}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Add Address
                            </button>
                            <button
                              onClick={() => {
                                setShowAddForm(false);
                                setNewAddress({ id: 0, name: "", address: "", phone: "", landmark: "", type: "Home", isDefault: false });
                              }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <section className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Phone size={28} className="text-blue-600" />
                      <h2 className="text-2xl font-bold">Contact Details</h2>
                    </div>
                    {!editContact && (
                      <button
                        onClick={() => setEditContact(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    )}
                  </div>
                  {editContact ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "Email", name: "email", type: "email" },
                          { label: "Phone", name: "phone", type: "tel" },
                          { label: "City", name: "city", type: "text" },
                          { label: "State", name: "state", type: "text" },
                          { label: "Country", name: "country", type: "text" },
                          { label: "PIN Code", name: "pincode", type: "text" },
                        ].map(field => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={contactForm[field.name as keyof typeof contactForm]}
                              onChange={handleContactChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleContactSave}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditContact(false);
                            setContactForm({
                              email: user.email,
                              phone: user.phone,
                              city: user.city,
                              state: user.state,
                              country: user.country,
                              pincode: user.pincode,
                            });
                          }}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-lg">
                        <Mail size={20} className="text-blue-600" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-lg">
                        <Phone size={20} className="text-blue-600" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-lg">
                        <Building2 size={20} className="text-blue-600" />
                        <span>
                          {user.city}, {user.state}, {user.country} - {user.pincode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
     );
}