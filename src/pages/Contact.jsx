
import { useState } from 'react';
import { postContact } from '@/api/contact-wrapper';
import Form from "@/components/Form/Form"
import FormInput from '@/components/Form/FormInput';
import FormSubmit from '@/components/Form/FormSubmit';
import { useTranslation } from "react-i18next";


export default function Contact() {
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
      const response = await postContact(formData)

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json()
      console.log(json)
      alert("Inquiry submitted successfully!")

    } catch (err) {
      console.error(error.message)
      alert("There was an error submitting the inquiry.")
    }
  };
    const { t } = useTranslation();


  return (
    <div className="w-full h-full bg-white flex flex-col sm:flex-row justify-center items-center">
      <div className="sm:w-1/3 w-full p-8">
        <h2 className="text-3xl font-semibold mb-6">{t("contact_heading")}</h2>
        <p className="mb-2 text-lg">
        {t("email_field")}:
          <a href="mailto:dillarenglish@gmail.com" className="text-black">
            dillarenglish@gmail.com
          </a>
        </p>
        <p className="text-lg">
        {t("instagram_text")}
          <a href="https://www.instagram.com/dillarenglish" className="text-black">
            @dillarenglish
          </a>
        </p>
      </div>

      <div className="sm:w-2/3 w-full bg-blue-200 p-10 flex justify-center">
        {/* form box */}
        <Form width="w-3/5">
          <h2 className="text-2xl font-semibold mb-2">{t("form_heading")}</h2>
          <p className="mb-4 text-gray-600 opacity-70">
          {t("form_description")}
          </p>
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
      </div>
    </div>
  );
}




