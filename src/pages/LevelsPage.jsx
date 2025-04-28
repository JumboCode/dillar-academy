
import { useState, useEffect } from 'react';
import { Link } from "wouter"
import { useTranslation } from "react-i18next";
import { getConversations, getLevels } from '../api/class-wrapper';
import Level from '@/components/Class/Level'
import ConversationClass from '../components/Class/ConversationClass';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonLevel from '@/components/Skeletons/SkeletonLevel';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const LevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [ielts, setIelts] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const { t } = useTranslation();
  const showSkeleton = useDelayedSkeleton(!allowRender);

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
        <h1 className='font-extrabold mb-2 text-blue-700'>{allowRender ? t("browse_classes") : showSkeleton && <Skeleton width={"32%"} />}</h1>
        <p className={descriptionStyle}>{allowRender ? t("levelspage_description") : showSkeleton && <Skeleton />}</p>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">{allowRender ? t("levelspage_reg_class_heading") : showSkeleton && <Skeleton width={"32%"} />}</h2>
        <p className={descriptionStyle}>{allowRender ? t("levelspage_reg_class_description") : showSkeleton && <Skeleton />}</p>
        <div className={`${courseDivStyle} lg:grid-cols-3 md:grid-cols-2 auto-rows-fr`}>
          {allowRender
            ? levels.length > 0
              ? (levels
                .sort((l1, l2) => l1.level - l2.level)
                .map((level, levelIndex) => (
                  <Link key={levelIndex} href={`/levels/${encodeURIComponent(level.level)}/classes`}>
                    <Level level={level} />
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">{t("no_levels_available")}</p>
              )
            : showSkeleton && <SkeletonLevel count={6} />}
        </div>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">{allowRender ? t("levelspage_supp_class_heading") : showSkeleton && <Skeleton width={"32%"} />}</h2>
        <p className={descriptionStyle}>{allowRender ? t("levelspage_supp_class_description") : showSkeleton && <Skeleton />}</p>
        <section className='mt-8'>
          <h3 className='font-extrabold'>{allowRender ? t("levelspage_convo_class_heading") : showSkeleton && <Skeleton width={"32%"} />}</h3>
          <div className={`${courseDivStyle} lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 auto-rows-fr`}>
            {allowRender
              ? conversations.length > 0
                ? (conversations.map((conversation, conversationIndex) => (
                  <ConversationClass key={conversationIndex} conversation={conversation} />
                ))
                ) : (
                  <p className="text-gray-500">{t("no_conversations_available")}</p>
                )
              : showSkeleton && <SkeletonLevel count={4} />}
          </div>
        </section>
        <section className='mt-8'>
          <h3 className='font-extrabold'>{allowRender ? t("levelspage_ietl_class_heading") : showSkeleton && <Skeleton width={"32%"} />}</h3>
          <div className={`${courseDivStyle} lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 auto-rows-fr`}>
            {allowRender
              ? ielts.length > 0
                ? (ielts.map((cls, ieltsIndex) => (
                  <></>
                ))
                ) : (
                  <p className="text-gray-500">{t("no_ielts_available")}</p>
                )
              : showSkeleton && <SkeletonLevel count={4} />}
          </div>
        </section>
      </section>
    </div>
  );
}

export default LevelsPage;