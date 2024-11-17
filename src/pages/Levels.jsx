
import { useState, useEffect } from 'react';
import Level from '@/components/Level'
import ConversationClass from '../components/ConversationClass';
import { getConversations, getLevels } from '../api/class-wrapper';
import { Link } from "wouter"

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [conversations, setConversations] = useState([]);
  const params = new URLSearchParams()

  // styles
  const h3Style = "text-3xl font-extrabold"
  const descriptionStyle = "font-light text-lg"
  const sectionStyle = "mb-12"
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

  if (levels.length == 0 || conversations.length == 0) {
    return <></>
  }

  return (
    <div className="xl:px-16 md:px-6 px-4 py-10">
      <section className={sectionStyle}>
        <h1 className='text-4xl font-extrabold'>Browse Classes</h1>
        <p className={descriptionStyle}>Dillar Academy offers classes at a variety of levels, based on your English skill level! Browse all the levels and classes here.</p>
      </section>
      <section className={sectionStyle}>
        <h3 className={h3Style}>Levels</h3>
        <p className={descriptionStyle}>Browse levels to determine which one is most suitable for you!</p>
        <div className={`${courseDivStyle} lg:grid-cols-3 md:grid-cols-2 flex flex-col`}>
          {levels.map((level, levelIndex) => {
            params.set("level", level.level)
            return (
              <Link href={`/classes?${params.toString()}`}>
                <Level key={levelIndex} level={level} />
              </Link>
            )
          })}
        </div>
      </section>
      <section className={sectionStyle}>
        <h3 className={h3Style}>Conversations</h3>
        <p className={descriptionStyle}>Practice your English conversation skills with native speakers.</p>
        <div className={`${courseDivStyle} lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 flex flex-col`}>
          {conversations.map((conversation, conversationIndex) => (
            <ConversationClass key={conversationIndex} conversation={conversation} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Levels