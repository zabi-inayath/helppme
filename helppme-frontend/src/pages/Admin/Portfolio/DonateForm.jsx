import { useState } from "react";
import "./DonateForm.css";

function DonateForm() {
  const [donationData, setDonationData] = useState({
    name: "",
    phone: "",
    email: "",
    confirmEmail: "",
    amount: "100"
  });

  const handleAmountChange = (e) => {
    // Get raw input value without ₹ symbol
    let value = e.target.value.replace("₹", "").trim();

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setDonationData((prev) => ({
        ...prev,
        amount: value === "" ? "0" : value
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Format amount for display
  const displayAmount = `₹${parseFloat(donationData.amount || "0").toFixed(2)}`;

  return (
    <div className="donate-section" id="donate-form">
      <div className="donate-header">
        <h1>Support Our Mission</h1>
        <p>
          Help us connect people with essential emergency services.
          <br />
          Your donation ensures timely aid in critical situations.
        </p>
      </div>

      <div className="donate-container">
        <div className="donate-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={donationData.name}
              onChange={handleChange}
              placeholder="Aafaque.a"
            />
          </div>

          <div className="form-group">
            <label>Phone no</label>
            <input
              type="tel"
              name="phone"
              value={donationData.phone}
              onChange={handleChange}
              placeholder="9597105039"
            />
          </div>

          <div className="form-group">
            <label>Mail Id</label>
            <input
              type="email"
              name="email"
              value={donationData.email}
              onChange={handleChange}
              placeholder="aafaquea@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Confirm Mail Id</label>
            <input
              type="email"
              name="confirmEmail"
              value={donationData.confirmEmail}
              onChange={handleChange}
              placeholder="aafaquea@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Enter Amount</label>
            <input
              type="text"
              name="amount"
              value={`₹${donationData.amount}`}
              onChange={handleAmountChange}
              className="amount-input"
            />
          </div>

          <div className="button-group">
            <button className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </div>

        <div className="payment-options">
          <h3>
            We accept
            <br />
            different apps
          </h3>
          <div className="payment-icons">
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741592636/gpay_zyh6xh.svg"
              alt="Google Pay"
            />
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741592637/phonepay_rg9fsz.svg"
              alt="PhonePe"
            />
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741592636/paytm_gy5z5p.svg"
              alt="Paytm"
            />
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741592635/amazon_pay_fr87vd.svg"
              alt="Amazon Pay"
            />
          </div>
          <div className="qr-code">
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741592643/qr_helpme_zvc53w.svg"
              alt="QR Code"
            />
            <p>helppme@okicici.com</p>
            <h2>{`₹${parseFloat(donationData.amount).toFixed(2)}`}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonateForm;
