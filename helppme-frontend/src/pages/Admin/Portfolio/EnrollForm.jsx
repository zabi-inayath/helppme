import { useState } from "react";
import styles from "./EnrollForm.module.css";
import toast from "react-hot-toast";

const categoriesRequiringAadhar = [
  "Electrician",
  "Plumber",
  "House Cleaner",
  "Car Rental",
  "Car Driver",
  "Tow Service",
  "Auto Mechanic",
  "Bike Repair Shop",
  "EV Power Hub",
  "Water Supplier"
];

const allowedBusinessCategories = {
  Medical: ["Hospital", "Pharmacy", "Clinic"],
  Utilities: ["Gas Agency", "Pest Control"],
  Travel: [
    "Car Rental",
    "Car Driver",
    "Travel Agency",
    "Auto Stand",
    "Residency"
  ],
  Public: [
    "Municipal Corporation",
    "Water Supplier",
    "Electricity Board",
    "E-Gov Center",
    "Postal Service"
  ],
  Vehicle: [
    "Tow Service",
    "Bike Repair Shop",
    "Auto Mechanic",
    "Local Petrol Shop",
    "EV Power Hub"
  ]
};

function EnrollForm() {
  const [showMedicalSpeciality, setShowMedicalSpeciality] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [phoneType, setPhoneType] = useState("mobile"); // "mobile" or "landline"

  const serviceCategories = {
    Emergency: [
      "Police",
      "Fire Department",
      "Disaster Management",
      "Women Helpline",
      "Child Helpline"
    ],
    Medical: ["Hospital", "Ambulance Service", "Pharmacy", "Clinic", "Doctor"],
    Utilities: [
      "Electrician",
      "Plumber",
      "Gas Agency",
      "House Cleaner",
      "Pest Control"
    ],
    Travel: [
      "Car Rental",
      "Car Driver",
      "Travel Agency",
      "Auto Stand",
      "Residency"
    ],
    Public: [
      "Municipal Corporation",
      "Water Supplier",
      "Electricity Board",
      "E-Gov Center",
      "Postal Service"
    ],
    Vehicle: [
      "Tow Service",
      "Bike Repair Shop",
      "Auto Mechanic",
      "Local Petrol Shop",
      "EV Power Hub"
    ]
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    serviceCategory: "",
    address: "",
    businessHours: "",
    imageUrl: "",
    message: "",
    aadhar: "",
    medicalSpeciality: "",
    hospitalName: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadhar") {
      const formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 12)
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setFormData({ ...formData, aadhar: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    if (!formData.name || !formData.phone || !formData.email) {
      setResponseMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      service_category: formData.serviceCategory,
      location: formData.address,
      business_hours: formData.businessHours,
      image: formData.imageUrl,
      service_type: accountType,
      hospitalName: formData.hospitalName,
      working_day: formData.working_day,
      googleMapLink: formData.googleMapLink,
      message: formData.message,
      ...(accountType === "individual" &&
        categoriesRequiringAadhar.includes(formData.serviceCategory) && {
        aadhar_id: formData.aadhar
      })
    };

    if (formData.serviceCategory === "Doctor") {
      dataToSend.medical_speciality = formData.medicalSpeciality;
    }

    console.log("Submitting data:", dataToSend);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to submit the form.");
        setResponseMessage(result.message || "Failed to submit the form.");
        setLoading(false);
        return;
      }

      toast.success("Form submitted successfully!");
      setResponseMessage("Form sent for approval!");
      setIsSubmitted(true);
      setShowForm(false); // <-- add this line

      setFormData({
        name: "",
        phone: "",
        email: "",
        category: "",
        serviceCategory: "",
        address: "",
        businessHours: "",
        imageUrl: "",
        message: "",
        aadhar: "",
        medicalSpeciality: "",
        hospitalName: "",
        googleMapLink: ""
      });
    } catch (error) {
      setResponseMessage(
        error.message || "Failed to submit the form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openWidget = () => {
    toast("Please wait 3s for File Upload Widget", { duration: 4000 });

    try {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "unsigned_helppme_upload",
          cropping: true,
          croppingAspectRatio: 1,
          showSkipCropButton: false,
          croppingCoordinatesMode: "custom",
          folder: "profile_pics"
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setFormData({ ...formData, imageUrl: result.info.secure_url });
            toast.success("Image uploaded successfully!");
          } else if (error) {
            toast.error("Failed to upload image.");
          }
        }
      );
      widget.open();
    } catch (error) {
      console.log("Error on EnrollForm.jsx", error);
    }
  };

  return (
    <div className={styles.enrollPage} id="enrol-form">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center min-h-[350px]">
          <img
            src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1750310021/Vector_dokjco.png"
            alt="Success"
            className="w-auto h-20 mb-6"
          />
          <h2 className="text-s md:text-xl font-semibold text-gray-700 mb-2">
            Application has been submitted
          </h2>
          <p className="text-gray-500 text-xs md:text-xl text-center">
            You’ll be notified once your application is approved
          </p>
          <button
            className="mt-6 px-6 py-2 bg-[#0075f2] text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              setIsSubmitted(false);
              setShowForm(true);
            }}
          >
            New Application
          </button>
        </div>
      ) : (
        <>
          {responseMessage && (
            <p className="font-medium text-2xl text-center mb-4">
              Backend: &nbsp;
              {responseMessage}
            </p>
          )}

          {showForm && (
            <>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  className={`${accountType === "individual"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                    } py-2 px-4 rounded`}
                  onClick={() => setAccountType("individual")}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`${accountType === "business"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                    } py-2 px-4 rounded`}
                  onClick={() => setAccountType("business")}
                >
                  Business
                </button>
              </div>

              <form className={styles.enrollForm} onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>
                    {accountType === "business" ? "Business Name" : "Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={`Enter your ${accountType === "business" ? "Business Name" : "Full Name"
                      }`}
                    value={formData.name}
                    maxLength={36}
                    onChange={handleChange}
                    className={styles.formGroupInput}
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Phone</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                      value={phoneType}
                      onChange={e => {
                        setPhoneType(e.target.value);
                        setFormData({ ...formData, phone: "" }); // reset phone on type change
                      }}
                      className={styles.formGroupSelect}
                      style={{ width: "80px", minWidth: "60px" }}
                    >
                      <option value="mobile">+91</option>
                      <option value="landline">0</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={
                        phoneType === "mobile"
                          ? "Enter your mobile number"
                          : "Enter your landline number"
                      }
                      value={
                        phoneType === "mobile"
                          ? formData.phone
                          : formData.phone
                      }
                      onChange={e => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (phoneType === "mobile") {
                          // Mobile: 10 digits only
                          if (value.length > 10) value = value.slice(0, 10);
                        } else {
                          // Landline: allow up to 11 digits, must start with 0
                          if (!value.startsWith("0")) value = "0" + value;
                          if (value.length > 11) value = value.slice(0, 11);
                        }
                        setFormData({ ...formData, phone: value });
                      }}
                      className={styles.formGroupInput}
                      style={{ flex: 1 }}
                      maxLength={phoneType === "mobile" ? 10 : 11}
                      required
                    />
                  </div>
                  <small style={{ color: "#888" }}>
                    {phoneType === "mobile"
                      ? "Mobile numbers must be 10 digits."
                      : "Landline numbers must start with 0 and can be up to 11 digits."}
                  </small>
                </div>

                {/* Email Field */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.formGroupInput}
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        serviceCategory: ""
                      });
                    }}
                    required
                    className={styles.formGroupSelect}
                  >
                    <option value="">Select a category</option>
                    {Object.keys(
                      accountType === "business"
                        ? allowedBusinessCategories
                        : serviceCategories
                    ).map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Category Dropdown */}
                {formData.category && (
                  <div className={styles.formGroup}>
                    <label className={styles.formGroupLabel}>Service Category</label>
                    <select
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, serviceCategory: value });

                        if (value === "Doctor") {
                          setShowMedicalSpeciality(true);
                        } else {
                          setShowMedicalSpeciality(false);
                        }
                      }}
                      required
                      className={styles.formGroupSelect}
                    >
                      <option value="">Select a service category</option>
                      {(accountType === "business"
                        ? allowedBusinessCategories[formData.category]
                        : serviceCategories[formData.category]
                      )?.map((service, index) => (
                        <option key={index}>{service}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Medical Speciality Dropdown */}
                {showMedicalSpeciality && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formGroupLabel}>
                        Medical Speciality
                      </label>
                      <select
                        name="medicalSpeciality"
                        value={formData.medicalSpeciality || ""}
                        onChange={handleChange}
                        className={styles.formGroupSelect}
                        required
                      >
                        <option value="">Select speciality</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                        <option value="Dentist">Dentist</option>
                        <option value="General Physician">General Physician</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Diabetologist">Diabetologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Urologist">Urologist</option>
                      </select>
                    </div>

                    {/*Hospital Name */}
                    <div className={styles.formGroup}>
                      <label className={styles.formGroupLabel}>Hospital Name</label>
                      <input
                        type="text"
                        name="hospitalName"
                        placeholder="Enter Hospital Name"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        maxLength={46}
                        className={styles.formGroupInput}
                        required
                      />
                    </div>

                    {/*Working Days Combination */}
                    <div className={styles.formGroup}>
                      <label className={styles.formGroupLabel}>Working Days</label>
                      <select
                        name="working_day"
                        value={formData.working_day || ""}
                        onChange={handleChange}
                        className={styles.formGroupSelect}
                        required
                      >
                        <option value="">Select working days</option>
                        <option value="Mon-Sat">Mon - Sat</option>
                        <option value="Mon-Fri">Mon - Fri</option>
                        <option value="All Days">All Days</option>
                        <option value="Sunday Only">Sunday Only</option>
                        <option value="Mon-Sun">Mon - Sun</option>
                        <option value="Mon, Wed, Fri">Mon, Wed, Fri</option>
                        <option value="Tue, Thu, Sat">Tue, Thu, Sat</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <small style={{ color: "#888" }}>
                        For custom working days, please mention in the message box below
                      </small>
                    </div>
                  </>
                )}

                {/* Address Field */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>
                    {accountType === "business" ? "Business Address" : "Address"}
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder={`Enter ${accountType === "business" ? "Business Address" : "your Address"
                      }`}
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={60}
                    className={styles.formGroupInput}
                    required
                  />
                </div>

                {/* Aadhar Field */}
                {accountType === "individual" &&
                  categoriesRequiringAadhar.includes(formData.serviceCategory) && (
                    <div className={styles.formGroup}>
                      <label className={styles.formGroupLabel}>Aadhar ID</label>
                      <input
                        type="text"
                        name="aadhar"
                        placeholder="0000 0000 0000"
                        value={formData.aadhar}
                        onChange={handleChange}
                        className={styles.formGroupInput}
                      />
                    </div>
                  )}

                {/* Google Map Field */}
                {accountType === "business" && (
                  <div className={styles.formGroup}>
                    <label className={styles.formGroupLabel}>Google Map Link</label>
                    <input
                      type="url"
                      name="googleMapLink"
                      placeholder="https://maps.app.goo.gl/PwVnNWUoH3KMtdCe7"
                      value={formData.googleMapLink}
                      onChange={handleChange}
                      className={styles.formGroupInput}
                      required
                    />
                  </div>
                )}

                {/* Business Hours Dropdown */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Business Hours</label>
                  <select
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleChange}
                    className={styles.formGroupSelect}
                    required
                  >
                    <option value="">Select business hours</option>
                    <option value="24/7">24/7</option>
                    {/* 6 AM */}
                    <option value="6.00 A.M - 7.00 A.M">6.00 A.M - 7.00 A.M</option>
                    <option value="6.00 A.M - 8.00 A.M">6.00 A.M - 8.00 A.M</option>
                    <option value="6.00 A.M - 9.00 A.M">6.00 A.M - 9.00 A.M</option>
                    <option value="6.00 A.M - 10.00 A.M">6.00 A.M - 10.00 A.M</option>
                    <option value="6.00 A.M - 11.00 A.M">6.00 A.M - 11.00 A.M</option>
                    <option value="6.00 A.M - 12.00 P.M">6.00 A.M - 12.00 P.M</option>
                    <option value="6.00 A.M - 1.00 P.M">6.00 A.M - 1.00 P.M</option>
                    <option value="6.00 A.M - 2.00 P.M">6.00 A.M - 2.00 P.M</option>
                    <option value="6.00 A.M - 3.00 P.M">6.00 A.M - 3.00 P.M</option>
                    <option value="6.00 A.M - 4.00 P.M">6.00 A.M - 4.00 P.M</option>
                    <option value="6.00 A.M - 5.00 P.M">6.00 A.M - 5.00 P.M</option>
                    <option value="6.00 A.M - 6.00 P.M">6.00 A.M - 6.00 P.M</option>
                    <option value="6.00 A.M - 7.00 P.M">6.00 A.M - 7.00 P.M</option>
                    <option value="6.00 A.M - 8.00 P.M">6.00 A.M - 8.00 P.M</option>
                    <option value="6.00 A.M - 9.00 P.M">6.00 A.M - 9.00 P.M</option>
                    <option value="6.00 A.M - 10.00 P.M">6.00 A.M - 10.00 P.M</option>
                    <option value="6.00 A.M - 11.00 P.M">6.00 A.M - 11.00 P.M</option>
                    <option value="6.00 A.M - 12.00 A.M">6.00 A.M - 12.00 A.M</option>
                    {/* 7 AM */}
                    <option value="7.00 A.M - 8.00 A.M">7.00 A.M - 8.00 A.M</option>
                    <option value="7.00 A.M - 9.00 A.M">7.00 A.M - 9.00 A.M</option>
                    <option value="7.00 A.M - 10.00 A.M">7.00 A.M - 10.00 A.M</option>
                    <option value="7.00 A.M - 11.00 A.M">7.00 A.M - 11.00 A.M</option>
                    <option value="7.00 A.M - 12.00 P.M">7.00 A.M - 12.00 P.M</option>
                    <option value="7.00 A.M - 1.00 P.M">7.00 A.M - 1.00 P.M</option>
                    <option value="7.00 A.M - 2.00 P.M">7.00 A.M - 2.00 P.M</option>
                    <option value="7.00 A.M - 3.00 P.M">7.00 A.M - 3.00 P.M</option>
                    <option value="7.00 A.M - 4.00 P.M">7.00 A.M - 4.00 P.M</option>
                    <option value="7.00 A.M - 5.00 P.M">7.00 A.M - 5.00 P.M</option>
                    <option value="7.00 A.M - 6.00 P.M">7.00 A.M - 6.00 P.M</option>
                    <option value="7.00 A.M - 7.00 P.M">7.00 A.M - 7.00 P.M</option>
                    <option value="7.00 A.M - 8.00 P.M">7.00 A.M - 8.00 P.M</option>
                    <option value="7.00 A.M - 9.00 P.M">7.00 A.M - 9.00 P.M</option>
                    <option value="7.00 A.M - 10.00 P.M">7.00 A.M - 10.00 P.M</option>
                    <option value="7.00 A.M - 11.00 P.M">7.00 A.M - 11.00 P.M</option>
                    <option value="7.00 A.M - 12.00 A.M">7.00 A.M - 12.00 A.M</option>
                    <option value="7.00 A.M - 1.00 A.M">7.00 A.M - 1.00 A.M</option>
                    {/* 8 AM */}
                    <option value="8.00 A.M - 9.00 A.M">8.00 A.M - 9.00 A.M</option>
                    <option value="8.00 A.M - 10.00 A.M">8.00 A.M - 10.00 A.M</option>
                    <option value="8.00 A.M - 11.00 A.M">8.00 A.M - 11.00 A.M</option>
                    <option value="8.00 A.M - 12.00 P.M">8.00 A.M - 12.00 P.M</option>
                    <option value="8.00 A.M - 1.00 P.M">8.00 A.M - 1.00 P.M</option>
                    <option value="8.00 A.M - 2.00 P.M">8.00 A.M - 2.00 P.M</option>
                    <option value="8.00 A.M - 3.00 P.M">8.00 A.M - 3.00 P.M</option>
                    <option value="8.00 A.M - 4.00 P.M">8.00 A.M - 4.00 P.M</option>
                    <option value="8.00 A.M - 5.00 P.M">8.00 A.M - 5.00 P.M</option>
                    <option value="8.00 A.M - 6.00 P.M">8.00 A.M - 6.00 P.M</option>
                    <option value="8.00 A.M - 7.00 P.M">8.00 A.M - 7.00 P.M</option>
                    <option value="8.00 A.M - 8.00 P.M">8.00 A.M - 8.00 P.M</option>
                    <option value="8.00 A.M - 9.00 P.M">8.00 A.M - 9.00 P.M</option>
                    <option value="8.00 A.M - 10.00 P.M">8.00 A.M - 10.00 P.M</option>
                    <option value="8.00 A.M - 11.00 P.M">8.00 A.M - 11.00 P.M</option>
                    <option value="8.00 A.M - 12.00 A.M">8.00 A.M - 12.00 A.M</option>
                    <option value="8.00 A.M - 1.00 A.M">8.00 A.M - 1.00 A.M</option>
                    {/* 9 AM */}
                    <option value="9.00 A.M - 10.00 A.M">9.00 A.M - 10.00 A.M</option>
                    <option value="9.00 A.M - 11.00 A.M">9.00 A.M - 11.00 A.M</option>
                    <option value="9.00 A.M - 12.00 P.M">9.00 A.M - 12.00 P.M</option>
                    <option value="9.00 A.M - 1.00 P.M">9.00 A.M - 1.00 P.M</option>
                    <option value="9.00 A.M - 2.00 P.M">9.00 A.M - 2.00 P.M</option>
                    <option value="9.00 A.M - 3.00 P.M">9.00 A.M - 3.00 P.M</option>
                    <option value="9.00 A.M - 4.00 P.M">9.00 A.M - 4.00 P.M</option>
                    <option value="9.00 A.M - 5.00 P.M">9.00 A.M - 5.00 P.M</option>
                    <option value="9.00 A.M - 6.00 P.M">9.00 A.M - 6.00 P.M</option>
                    <option value="9.00 A.M - 7.00 P.M">9.00 A.M - 7.00 P.M</option>
                    <option value="9.00 A.M - 8.00 P.M">9.00 A.M - 8.00 P.M</option>
                    <option value="9.00 A.M - 9.00 P.M">9.00 A.M - 9.00 P.M</option>
                    <option value="9.00 A.M - 10.00 P.M">9.00 A.M - 10.00 P.M</option>
                    <option value="9.00 A.M - 11.00 P.M">9.00 A.M - 11.00 P.M</option>
                    <option value="9.00 A.M - 12.00 A.M">9.00 A.M - 12.00 A.M</option>
                    <option value="9.00 A.M - 1.00 A.M">9.00 A.M - 1.00 A.M</option>
                    {/* 10 AM */}
                    <option value="10.00 A.M - 11.00 A.M">10.00 A.M - 11.00 A.M</option>
                    <option value="10.00 A.M - 12.00 P.M">10.00 A.M - 12.00 P.M</option>
                    <option value="10.00 A.M - 1.00 P.M">10.00 A.M - 1.00 P.M</option>
                    <option value="10.00 A.M - 2.00 P.M">10.00 A.M - 2.00 P.M</option>
                    <option value="10.00 A.M - 3.00 P.M">10.00 A.M - 3.00 P.M</option>
                    <option value="10.00 A.M - 4.00 P.M">10.00 A.M - 4.00 P.M</option>
                    <option value="10.00 A.M - 5.00 P.M">10.00 A.M - 5.00 P.M</option>
                    <option value="10.00 A.M - 6.00 P.M">10.00 A.M - 6.00 P.M</option>
                    <option value="10.00 A.M - 7.00 P.M">10.00 A.M - 7.00 P.M</option>
                    <option value="10.00 A.M - 8.00 P.M">10.00 A.M - 8.00 P.M</option>
                    <option value="10.00 A.M - 9.00 P.M">10.00 A.M - 9.00 P.M</option>
                    <option value="10.00 A.M - 10.00 P.M">10.00 A.M - 10.00 P.M</option>
                    <option value="10.00 A.M - 11.00 P.M">10.00 A.M - 11.00 P.M</option>
                    <option value="10.00 A.M - 12.00 A.M">10.00 A.M - 12.00 A.M</option>
                    <option value="10.00 A.M - 1.00 A.M">10.00 A.M - 1.00 A.M</option>
                    {/* 11 AM */}
                    <option value="11.00 A.M - 12.00 P.M">11.00 A.M - 12.00 P.M</option>
                    <option value="11.00 A.M - 1.00 P.M">11.00 A.M - 1.00 P.M</option>
                    <option value="11.00 A.M - 2.00 P.M">11.00 A.M - 2.00 P.M</option>
                    <option value="11.00 A.M - 3.00 P.M">11.00 A.M - 3.00 P.M</option>
                    <option value="11.00 A.M - 4.00 P.M">11.00 A.M - 4.00 P.M</option>
                    <option value="11.00 A.M - 5.00 P.M">11.00 A.M - 5.00 P.M</option>
                    <option value="11.00 A.M - 6.00 P.M">11.00 A.M - 6.00 P.M</option>
                    <option value="11.00 A.M - 7.00 P.M">11.00 A.M - 7.00 P.M</option>
                    <option value="11.00 A.M - 8.00 P.M">11.00 A.M - 8.00 P.M</option>
                    <option value="11.00 A.M - 9.00 P.M">11.00 A.M - 9.00 P.M</option>
                    <option value="11.00 A.M - 10.00 P.M">11.00 A.M - 10.00 P.M</option>
                    <option value="11.00 A.M - 10.00 P.M">11.00 A.M - 11.00 P.M</option>
                    <option value="11.00 A.M - 12.00 A.M">11.00 A.M - 12.00 A.M</option>
                    <option value="11.00 A.M - 1.00 A.M">11.00 A.M - 1.00 A.M</option>
                    {/* 12 PM */}
                    <option value="12.00 P.M - 1.00 P.M">12.00 P.M - 1.00 P.M</option>
                    <option value="12.00 P.M - 2.00 P.M">12.00 P.M - 2.00 P.M</option>
                    <option value="12.00 P.M - 3.00 P.M">12.00 P.M - 3.00 P.M</option>
                    <option value="12.00 P.M - 4.00 P.M">12.00 P.M - 4.00 P.M</option>
                    <option value="12.00 P.M - 5.00 P.M">12.00 P.M - 5.00 P.M</option>
                    <option value="12.00 P.M - 6.00 P.M">12.00 P.M - 6.00 P.M</option>
                    <option value="12.00 P.M - 7.00 P.M">12.00 P.M - 7.00 P.M</option>
                    <option value="12.00 P.M - 8.00 P.M">12.00 P.M - 8.00 P.M</option>
                    <option value="12.00 P.M - 9.00 P.M">12.00 P.M - 9.00 P.M</option>
                    <option value="12.00 P.M - 10.00 P.M">12.00 P.M - 10.00 P.M</option>
                    <option value="12.00 P.M - 11.00 P.M">12.00 P.M - 11.00 P.M</option>
                    <option value="12.00 P.M - 12.00 A.M">12.00 P.M - 12.00 A.M</option>
                    <option value="12.00 P.M - 1.00 A.M">12.00 P.M - 1.00 A.M</option>
                    {/* 1 PM */}
                    <option value="1.00 P.M - 2.00 P.M">1.00 P.M - 2.00 P.M</option>
                    <option value="1.00 P.M - 3.00 P.M">1.00 P.M - 3.00 P.M</option>
                    <option value="1.00 P.M - 4.00 P.M">1.00 P.M - 4.00 P.M</option>
                    <option value="1.00 P.M - 5.00 P.M">1.00 P.M - 5.00 P.M</option>
                    <option value="1.00 P.M - 6.00 P.M">1.00 P.M - 6.00 P.M</option>
                    <option value="1.00 P.M - 7.00 P.M">1.00 P.M - 7.00 P.M</option>
                    <option value="1.00 P.M - 8.00 P.M">1.00 P.M - 8.00 P.M</option>
                    <option value="1.00 P.M - 9.00 P.M">1.00 P.M - 9.00 P.M</option>
                    <option value="1.00 P.M - 10.00 P.M">1.00 P.M - 10.00 P.M</option>
                    <option value="1.00 P.M - 11.00 P.M">1.00 P.M - 11.00 P.M</option>
                    <option value="1.00 P.M - 12.00 A.M">1.00 P.M - 12.00 A.M</option>
                    <option value="1.00 P.M - 1.00 A.M">1.00 P.M - 1.00 A.M</option>
                    {/* 2 PM */}
                    <option value="2.00 P.M - 3.00 P.M">2.00 P.M - 3.00 P.M</option>
                    <option value="2.00 P.M - 4.00 P.M">2.00 P.M - 4.00 P.M</option>
                    <option value="2.00 P.M - 5.00 P.M">2.00 P.M - 5.00 P.M</option>
                    <option value="2.00 P.M - 6.00 P.M">2.00 P.M - 6.00 P.M</option>
                    <option value="2.00 P.M - 7.00 P.M">2.00 P.M - 7.00 P.M</option>
                    <option value="2.00 P.M - 8.00 P.M">2.00 P.M - 8.00 P.M</option>
                    <option value="2.00 P.M - 9.00 P.M">2.00 P.M - 9.00 P.M</option>
                    <option value="2.00 P.M - 10.00 P.M">2.00 P.M - 10.00 P.M</option>
                    <option value="2.00 P.M - 11.00 P.M">2.00 P.M - 11.00 P.M</option>
                    <option value="2.00 P.M - 12.00 A.M">2.00 P.M - 12.00 A.M</option>
                    <option value="2.00 P.M - 1.00 A.M">2.00 P.M - 1.00 A.M</option>
                    {/* 3 PM */}
                    <option value="3.00 P.M - 4.00 P.M">3.00 P.M - 4.00 P.M</option>
                    <option value="3.00 P.M - 5.00 P.M">3.00 P.M - 5.00 P.M</option>
                    <option value="3.00 P.M - 6.00 P.M">3.00 P.M - 6.00 P.M</option>
                    <option value="3.00 P.M - 7.00 P.M">3.00 P.M - 7.00 P.M</option>
                    <option value="3.00 P.M - 8.00 P.M">3.00 P.M - 8.00 P.M</option>
                    <option value="3.00 P.M - 9.00 P.M">3.00 P.M - 9.00 P.M</option>
                    <option value="3.00 P.M - 10.00 P.M">3.00 P.M - 10.00 P.M</option>
                    <option value="3.00 P.M - 11.00 P.M">3.00 P.M - 11.00 P.M</option>
                    <option value="3.00 P.M - 12.00 A.M">3.00 P.M - 12.00 A.M</option>
                    <option value="3.00 P.M - 1.00 A.M">3.00 P.M - 1.00 A.M</option>
                    {/* 4 PM */}
                    <option value="4.00 P.M - 5.00 P.M">4.00 P.M - 5.00 P.M</option>
                    <option value="4.00 P.M - 6.00 P.M">4.00 P.M - 6.00 P.M</option>
                    <option value="4.00 P.M - 7.00 P.M">4.00 P.M - 7.00 P.M</option>
                    <option value="4.00 P.M - 8.00 P.M">4.00 P.M - 8.00 P.M</option>
                    <option value="4.00 P.M - 9.00 P.M">4.00 P.M - 9.00 P.M</option>
                    <option value="4.00 P.M - 10.00 P.M">4.00 P.M - 10.00 P.M</option>
                    <option value="4.00 P.M - 11.00 P.M">4.00 P.M - 11.00 P.M</option>
                    <option value="4.00 P.M - 12.00 A.M">4.00 P.M - 12.00 A.M</option>
                    <option value="4.00 P.M - 1.00 A.M">4.00 P.M - 1.00 A.M</option>
                    {/* 5 PM */}
                    <option value="5.00 P.M - 6.00 P.M">5.00 P.M - 6.00 P.M</option>
                    <option value="5.00 P.M - 7.00 P.M">5.00 P.M - 7.00 P.M</option>
                    <option value="5.00 P.M - 8.00 P.M">5.00 P.M - 8.00 P.M</option>
                    <option value="5.00 P.M - 9.00 P.M">5.00 P.M - 9.00 P.M</option>
                    <option value="5.00 P.M - 10.00 P.M">5.00 P.M - 10.00 P.M</option>
                    <option value="5.00 P.M - 11.00 P.M">5.00 P.M - 11.00 P.M</option>
                    <option value="5.00 P.M - 12.00 A.M">5.00 P.M - 12.00 A.M</option>
                    <option value="5.00 P.M - 1.00 A.M">5.00 P.M - 1.00 A.M</option>
                    {/* 6 PM */}
                    <option value="6.00 P.M - 7.00 P.M">6.00 P.M - 7.00 P.M</option>
                    <option value="6.00 P.M - 8.00 P.M">6.00 P.M - 8.00 P.M</option>
                    <option value="6.00 P.M - 9.00 P.M">6.00 P.M - 9.00 P.M</option>
                    <option value="6.00 P.M - 10.00 P.M">6.00 P.M - 10.00 P.M</option>
                    <option value="6.00 P.M - 11.00 P.M">6.00 P.M - 11.00 P.M</option>
                    <option value="6.00 P.M - 12.00 A.M">6.00 P.M - 12.00 A.M</option>
                    <option value="6.00 P.M - 1.00 A.M">6.00 P.M - 1.00 A.M</option>
                    {/* 7 PM */}
                    <option value="7.00 P.M - 8.00 P.M">7.00 P.M - 8.00 P.M</option>
                    <option value="7.00 P.M - 9.00 P.M">7.00 P.M - 9.00 P.M</option>
                    <option value="7.00 P.M - 10.00 P.M">7.00 P.M - 10.00 P.M</option>
                    <option value="7.00 P.M - 11.00 P.M">7.00 P.M - 11.00 P.M</option>
                    <option value="7.00 P.M - 12.00 A.M">7.00 P.M - 12.00 A.M</option>
                    <option value="7.00 P.M - 1.00 A.M">7.00 P.M - 1.00 A.M</option>
                    {/* 8 PM */}
                    <option value="8.00 P.M - 9.00 P.M">8.00 P.M - 9.00 P.M</option>
                    <option value="8.00 P.M - 10.00 P.M">8.00 P.M - 10.00 P.M</option>
                    <option value="8.00 P.M - 11.00 P.M">8.00 P.M - 11.00 P.M</option>
                    <option value="8.00 P.M - 12.00 A.M">8.00 P.M - 12.00 A.M</option>
                    <option value="8.00 P.M - 1.00 A.M">8.00 P.M - 1.00 A.M</option>
                    {/* 9 PM */}
                    <option value="9.00 P.M - 10.00 P.M">9.00 P.M - 10.00 P.M</option>
                    <option value="9.00 P.M - 11.00 P.M">9.00 P.M - 11.00 P.M</option>
                    <option value="9.00 P.M - 12.00 A.M">9.00 P.M - 12.00 A.M</option>
                    <option value="9.00 P.M - 1.00 A.M">9.00 P.M - 1.00 A.M</option>
                    {/* 10 PM */}
                    <option value="10.00 P.M - 11.00 P.M">10.00 P.M - 11.00 P.M</option>
                    <option value="10.00 P.M - 12.00 A.M">10.00 P.M - 12.00 A.M</option>
                    <option value="10.00 P.M - 1.00 A.M">10.00 P.M - 1.00 A.M</option>
                    {/* 11 PM */}
                    <option value="11.00 P.M - 12.00 A.M">11.00 P.M - 12.00 A.M</option>
                    <option value="11.00 P.M - 1.00 A.M">11.00 P.M - 1.00 A.M</option>
                    {/* 12 AM */}
                    <option value="12.00 A.M - 1.00 A.M">12.00 A.M - 1.00 A.M</option>
                    {/* other */}
                    {/* <option value="10.00 A.M - 4.00 P.M">10.00 A.M - 4.00 P.M</option>
                    <option value="5.00 P.M - 10.00 P.M">5.00 P.M - 10.00 P.M</option> */}
                  </select>
                </div>

                {/* Profile Picture Upload */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>
                    Upload your profile picture here
                  </label>
                  <button type="button" onClick={openWidget}>
                    <img
                      src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741011318/uplaod_v9cawi.svg"
                      alt="Upload"
                      className="m-6 ml-24 h-10 w-10 xs:ml-36"
                    />
                  </button>
                  {formData.imageUrl && (
                    <div style={{ marginTop: "10px", position: "relative" }}>
                      <img
                        src={formData.imageUrl}
                        alt="Uploaded Profile"
                        width="200"
                        height="200"
                      />
                      <button
                        type="button"
                        className="cursor-pointer text-lg text-red-700 mt-10 ml-10"
                        onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Message */}
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Additional Message</label>
                  <textarea
                    name="message"
                    placeholder="Enter any additional information"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textareaMessage}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Details"}
                </button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default EnrollForm;
