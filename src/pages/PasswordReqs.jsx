import PasswordChecklist from "react-password-checklist"
import { useTranslation } from "react-i18next";

const PasswordReqs = ({ formData, setIsValid }) => {
    const { t } = useTranslation();

    return (
        <PasswordChecklist
            rules={[
                "minLength",
                "capitalAndLowercase",
                "number",
                "specialChar",
                "match"
            ]}
            minLength={8}
            value={formData.password}
            valueAgain={formData.retypedPassword}
            onChange={(isValid) => setIsValid(isValid)}
            messages={{
                minLength: t("password_qual1_text"),
                number: t("password_qual3_text"),
                specialChar: t("password_qual4_text"),
                match: t("password_qual5_text"),
            }}
        />
    )
}

export default PasswordReqs;