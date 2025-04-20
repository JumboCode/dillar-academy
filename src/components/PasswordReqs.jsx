import PasswordChecklist from "react-password-checklist"
import { useTranslation } from "react-i18next";

const PasswordReqs = ({ formData, setIsValid }) => {
    const { t } = useTranslation();

    return (
        <PasswordChecklist
            rules={[
                "minLength",
                "number",
                "specialChar",
                "match"
            ]}
            minLength={8}
            value={formData.password}
            valueAgain={formData.retypedPassword}
            onChange={(isValid) => setIsValid(isValid)}
            messages={{
                minLength: t("password_req_chars"),
                number: t("password_req_number"),
                specialChar: t("password_req_special_chars"),
                match: t("password_req_match"),
            }}
        />
    )
}

export default PasswordReqs;