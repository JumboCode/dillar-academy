
import { useState } from 'react';
import { postContact } from '@/api/contact-wrapper';
import Form from "@/components/Form/Form"
import FormInput from '@/components/Form/FormInput';
import FormSubmit from '@/components/Form/FormSubmit';
import Alert from "@/components/Alert";
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [alertData, setAlertData] = useState({ message: "" })


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postContact(formData);

      if (response.ok) {
        alert("Message submitted successfully!");
      } else {
        const errorResponse = await response.json();
        setAlertData({ message: `Failed to send message: ${errorResponse.message}` })
      }
    } catch (err) {
      // console.error('Error in handleSubmit:', err);
      setAlertData({ message: "" });
      setTimeout(() => {
        setAlertData({ message: "Error: " + (error.message || "There was an error submitting the inquiry.") });
      }, 10);
    }
  };

  return (
    <div className="w-full h-full py-12 sm:py-32 bg-[url('/images/ice_water.png')] bg-no-repeat bg-center bg-cover flex flex-col sm:flex-row justify-center items-center">
      {alertData.message && <Alert message={alertData.message} />}
      {/* form box */}
      <Form width="w-4/5 md:w-3/5">
        <h3 className="font-extrabold mb-2">{t("contact_heading")}</h3>
        <p className="text-base sm:text-lg mb-4 text-gray-600 opacity-70">
          {t("contact_form_description")}
        </p >
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <FormInput
            type="text"
            name="name"
            placeholder={t("name_field")}
            value={formData.name}
            onChange={handleChange}
            isRequired={true}
          />
          <FormInput
            type="email"
            name="email"
            placeholder={t("email_field")}
            value={formData.email}
            onChange={handleChange}
            isRequired={true}
          />
          <FormInput
            type="text"
            name="subject"
            placeholder={t("subject_field")}
            value={formData.subject}
            onChange={handleChange}
            isRequired={true}
          />
          <FormInput
            type="textarea"
            name="message"
            placeholder={t("message_field")}
            value={formData.message}
            onChange={handleChange}
            required
          />
          <FormSubmit label={t("submit_button")} />
        </form>
      </Form>
    </div >
  );
}




