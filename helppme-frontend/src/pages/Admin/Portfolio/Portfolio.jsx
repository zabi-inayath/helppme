import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EnrolForm from "./EnrollForm";
import DonateForm from "./DonateForm";
import Footer from "./Footer";
import styles from "./Portfolio.module.css"; // Import CSS Module
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Portfolio() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out"
    });
  }, []);

  const scrollToForm = (formId) => {
    const element = document.getElementById(formId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={styles.appContainer}>
        {/* Add enrollment section directly */}
        <div className={styles.enrolPage} id="enrol-form">
          {/* Logo at the top center */}
          <div className="flex justify-center mb-8">
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1750311061/Group_13_wvnpjb.png"
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>
          <div className={styles.enrolHeader}>
            <h1 className="dm-sans">Emergency Services Enrollment</h1>
            <p>
              Register your business or individual emergency services with
              Helppme.com to provide essential support in times of need. We
              welcome all emergency service providers, including medical
              services, utility services (plumbers, electricians, etc.),
              emergency vehicle services, and more.
            </p>
          </div>

          <div className={styles.enrolContent}>
            <EnrolForm />
          </div>
        </div>

        {/* Add donation section */}
        {/* <div className={styles.donateSection} id="donate-form">
                    <DonateForm />
                  </div> */}
      </div>

      <Footer />
    </>
  );
}

export default Portfolio;
