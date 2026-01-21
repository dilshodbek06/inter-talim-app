import Header from "@/components/Header";
import ContactForm from "./contact-form";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      <ContactForm />
    </div>
  );
};

export default ContactPage;
