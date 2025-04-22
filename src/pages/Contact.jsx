
import { useState } from 'react';
import { postContact } from '@/api/contact-wrapper';
import Form from "@/components/Form/Form"
import FormInput from '@/components/Form/FormInput';
import Button from '@/components/Button/Button';
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
  const [alertMessage, setAlertMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postContact(formData);
      setSuccessMessage('contact_success_alert');
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting message:', err);
      setAlertMessage(`Error: ${err.response.data.message}`); // TODO: translations
      setTimeout(() => {
        setAlertMessage("");
      }, 4000);
    }
  };

  return (
    <>
      {alertMessage && <Alert message={alertMessage} />}
      {successMessage && <Alert message={successMessage} isSuccess />}
      <div className="page-format bg-[url('/images/ice_water.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center">
        {/* form box */}
        <div className="max-w-[96rem] w-full flex justify-center">
          <Form width="lg:w-3/5">
            <h1 className="font-extrabold mb-2">{t("contact_text")}</h1>
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
                placeholder={t("email")}
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
              <Button
                type="submit"
                label={t("submit_button")}
              />
            </form>
          </Form>
        </div>
      </div >
    </>
  );
}




