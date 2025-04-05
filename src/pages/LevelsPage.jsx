
import { useState, useEffect } from 'react';
import Level from '@/components/Class/Level'
import ConversationClass from '../components/Class/ConversationClass';
import { getConversations, getLevels } from '../api/class-wrapper';
import { Link } from "wouter"

const LevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [conversations, setConversations] = useState([]);

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
    };
    fetchLevels();
  }, []);

  if (levels?.length == 0 || conversations?.length == 0) {
    return <></>
  }

  return (
    <div className="page-format max-w-[96rem] lg:py-24">
      <section className={sectionStyle}>
        <h1 className='font-extrabold mb-2 text-blue-700'>Browse Classes</h1>
        <p className={descriptionStyle}>Dillar Academy offers classes at a variety of levels, based on your English skill level! Browse all the levels and classes here.</p>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">Regular English Classes</h2>
        <p className={descriptionStyle}>Beginner-friendly English classes focused on reading, grammar, and speaking. Build confidence step by step, from alphabets to everyday conversations.</p>
        <div className={`${courseDivStyle} lg:grid-cols-3 md:grid-cols-2 flex flex-col`}>
          {levels.map((level, levelIndex) => (
            <Link key={levelIndex} href={`/levels/${encodeURIComponent(level.level)}/classes`}>
              <Level level={level} />
            </Link>
          ))}
        </div>
      </section>
      <section className={sectionStyle}>
        <h2 className="font-extrabold mb-1">Supplementary Classes</h2>
        <p className={descriptionStyle}>Extra practice for dedicated learners! Improve fluency with conversation classes led by native English speakers or prepare for the IELTS with targeted lessons.</p>
        <section className='mt-8'>
          <h3 className='font-extrabold'>Conversation Classes</h3>
          <div className={`${courseDivStyle} lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 flex flex-col`}>
            {conversations.map((conversation, conversationIndex) => (
              <ConversationClass key={conversationIndex} conversation={conversation} />
            ))}
          </div>
        </section>
        <section className='mt-8'>
          <h3 className='font-extrabold'>IELTS Classes</h3>
        </section>
      </section>
    </div>
  );
}

export default LevelsPage;