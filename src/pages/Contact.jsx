
import { useState } from 'react';
import { postContact } from '@/api/contact-wrapper';
import Form from "@/components/Form/Form"
import FormInput from '@/components/Form/FormInput';
import FormSubmit from '@/components/Form/FormSubmit';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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
        alert(`Failed to send message: ${errorResponse.message}`);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert("There was an error submitting the inquiry.");
    }
  };

  return (
    <div className="w-full h-full py-12 bg-[url('/images/ice_water.png')] bg-no-repeat bg-center bg-cover flex flex-col sm:flex-row justify-center items-center">
      {/* form box */}
      <Form width="w-1/3 sm: w-3/4">
        <h2 className="text-2xl sm: text-1xl font-semibold mb-2">{t("contact_heading")}</h2>
        <p className="mb-4 text-gray-600 opacity-70">
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




