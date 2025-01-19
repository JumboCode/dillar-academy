
import founder from '../assets/founder.jpg';
import { useTranslation } from "react-i18next";

function About() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row-reverse sm:justify-between h-full xl:px-16 md:px-6 px-4">
            <div className="flex items-center justify-center sm:w-1/3">
                <img src={founder} alt="dummy-founder-image" title="dummy-image"></img>
            </div>
            <div className="my-auto sm:w-7/12 sm:text-lg">
                <h1 className="text-4xl py-5 sm:text-5xl text-center sm:text-left">{t("about_heading")}</h1>
                <p>Dillar English Academy was founded by Dilnawa and Dilziba Dilmurat
                    Kizghin to help Uyghurs around the world learn English without cost.
                    With the help and commitment of our volunteer teachers, our goal is
                    to bridge the educational disparity gap among Uyghurs worldwide.
                    <br /><br />
                    Dillar Academy has grown exponentially in a short time! Recognizing a
                    need in the international Uyghur community, we have recruited Uyghur
                    college students in America to volunteer their time and teach various
                    levels of English. Although our teachers are not certified English
                    language instructors, they are native English speakers who invest
                    time into teaching the best information that they can.
                </p>
            </div>
        </div>
    )
}

export default About;
