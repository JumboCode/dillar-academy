import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClasses, getLevels, getConversations } from '@/api/class-wrapper';

const AdminTranslations = () => {
  const { user } = useContext(UserContext);
  const { isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();
  const [levels, setLevels] = useState([]);
  const [classes, setClasses] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allowRender, setAllowRender] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const allLevels = await getLevels();
      setLevels(allLevels);
      const allClasses = await getClasses();
      setClasses(allClasses);
      const allConversations = await getConversations();
      setConversations(allConversations);
      setAllowRender(true);
    }

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchData();
      }
    }
  }, [isLoaded, isSignedIn, user])

  if (!allowRender) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-9">
      <div>
        <h1 className="font-extrabold">Edit Translations</h1>
        <h3>Edit translations for levels and classes</h3>
      </div>

      <div>
        <h2 className="font-extrabold">Levels</h2>

      </div>

      <div>
        <h2 className="font-extrabold">Classes</h2>

      </div>

      <div>
        <h2 className="font-extrabold">Conversations</h2>

      </div>
      {/* <TranslationTable
        label={"Levels"}
        translations={[]}
      />
      <TranslationTable
        label={"Classes"}
        translations={[]}
      />
      <TranslationTable
        label={"Conversation Classes"}
        translations={[]}
      />
      <TranslationTable
        label={"IELTs"}
        translations={[]}
      /> */}
    </div>
  )
}

// const TranslationTable = ({ label, translations }) => {
//   return (
//     <div className="flex flex-col rounded-md border border-dark-blue-800">
//       <h3 className="self-center">{label}</h3>
//     </div>
//   )
// }

export default AdminTranslations;