
import { useState, useEffect } from 'react';
import Level from '@/components/Class/Level'
import ConversationClass from '../components/Class/ConversationClass';
import { getConversations, getLevels } from '../api/class-wrapper';
import { Link } from "wouter"
import { useTranslation } from "react-i18next";
import SkeletonLevel from '@/components/Skeletons/SkeletonLevel';

const LevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const { t } = useTranslation();

  // styles
  const descriptionStyle = "font-light text-base sm:text-lg"
  const sectionStyle = "mb-8 sm:mb-12"
  const courseDivStyle = "mt-8 sm:grid gap-8"

  useEffect(() => {
    const fetchLevels = async () => {
      const levels = await getLevels();
      setLevels(levels);
      const conversations = await getConversations();
      setConversations(conversations);
      setAllowRender(true);
    };
    fetchLevels();
  }, []);

  return (
    <div className="page-format max-w-[96rem] lg:py-24">
      <section className={sectionStyle}>
        <h1 className='font-extrabold mb-2 text-blue-700'>{t("browse_classes")}</h1>
        <p className={descriptionStyle}>{t("levelspage_description")}</p>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">{t("levelspage_reg_class_heading")}</h2>
        <p className={descriptionStyle}>{t("levelspage_reg_class_description")}</p>
        <div className={`${courseDivStyle} lg:grid-cols-3 md:grid-cols-2 flex flex-col`}>
          {!allowRender && <SkeletonLevel count={6} />}
          {allowRender && levels.map((level, levelIndex) => (
            <Link key={levelIndex} href={`/levels/${encodeURIComponent(level.level)}/classes`}>
              <Level level={level} />
            </Link>
          ))}
        </div>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">{t("levelspage_supp_class_heading")}</h2>
        <p className={descriptionStyle}>{t("levelspage_supp_class_description")}</p>
        <section className='mt-8'>
          <h3 className='font-extrabold'>{t("levelspage_convo_class_heading")}</h3>
          <div className={`${courseDivStyle} lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 flex flex-col`}>
            {conversations.map((conversation, conversationIndex) => (
              <ConversationClass key={conversationIndex} conversation={conversation} />
            ))}
          </div>
        </section>
        <section className='mt-8'>
          <h3 className='font-extrabold'>{t("levelspage_ietl_class_heading")}</h3>
        </section>
      </section>
    </div>
  );
}

export default LevelsPage;