import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getClasses, getLevels, getConversations } from '@/api/class-wrapper';
import SearchBar from '@/components/SearchBar';
import Overlay from '@/components/Overlay';
import Button from '@/components/Button/Button';
import { IoChevronDownOutline, IoCreateOutline } from "react-icons/io5";
// import { editTranslation } from '@/api/translation-wrapper';

const AdminTranslations = () => {
  const { user } = useContext(UserContext);
  const { isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();
  const [levels, setLevels] = useState([]);
  const [classes, setClasses] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const [translations, setTranslations] = useState({
    en: {},
    ru: {},
    tr: {},
    ug: {},
    zh: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      const allLevels = await getLevels();
      setLevels(allLevels);
      const allClasses = await getClasses();
      setClasses(allClasses);
      const allConversations = await getConversations();
      setConversations(allConversations);
      setAllowRender(true);

      await fetchTranslations();
    }

    const fetchTranslations = async () => {
      const enJson = await fetch("/locales/en/default.json").then(r => r.json());
      const trJson = await fetch("/locales/tr/default.json").then(r => r.json());
      const ruJson = await fetch("/locales/ru/default.json").then(r => r.json());
      const ugJson = await fetch("/locales/ug/default.json").then(r => r.json());
      const zhJson = await fetch("/locales/zh/default.json").then(r => r.json());
      setTranslations({
        en: enJson,
        tr: trJson,
        ru: ruJson,
        ug: ugJson,
        zh: zhJson,
      })
      // console.log(translations.en.about_body1)
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
    <div className="page-format max-w-[96rem] space-y-10">
      <div>
        <h1 className="font-extrabold">Edit Translations</h1>
      </div>

      <div className='space-y-6'>
        <h2 className='font-extrabold'>Edit translations for levels and classes</h2>
        <div>
          <h3 className="font-extrabold">Levels</h3>
        </div>
        <div>
          <h3 className="font-extrabold">Classes</h3>
        </div>
        <div>
          <h3 className="font-extrabold">Conversations</h3>
        </div>
      </div>

      <div>
        <h2 className='font-extrabold'>Edit general and student page translation</h2>
      </div>
      <TranslationTable
        label={"General and Student Page Translations"}
        translations={translations}
      />
    </div>
  )
}

const TranslationTable = ({ translations }) => {
  return (
    <div className="flex flex-col rounded-sm border border-dark-blue-800 overflow-hidden">
      <div className="w-full grid grid-cols-[1fr_2fr] py-4 px-8 bg-dark-blue-800 text-white text-center">
        <h4 className='font-extrabold text-base sm:text-xl'>Language</h4>
        <h4 className='font-extrabold text-base sm:text-xl'>Translation</h4>
      </div>
      <div>
        {Object.keys(translations.en).map((id, index) => (
          <TableRow key={id} id={id} translations={translations} />
        ))}
      </div>
    </div >
  )
}

const TableRow = ({ id, translations }) => {
  const supportedLngs = {
    English: "en",
    Russian: "ru",
    Chinese: "zh",
    Turkish: "tr",
    Uyghurche: "ug"
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [formData, setFormData] = useState({
    lng: "",
    key: "",
    translation: ""
  });

  const resetForm = () => {
    setFormData({
      lng: "",
      key: "",
      translation: ""
    });
  }

  const handleEditTranslation = async (e) => {
    e.preventDefault();

    try {
      // await editTranslation(formData.lng, formData.key, formData.translation);
      resetForm();
    } catch (error) {
      console.error("handleEditTranslation failed:", error);
    }
  }

  return (
    <div className="w-full text-base sm:text-lg border-t border-dark-blue-800">
      <div className='flex items-center'>
        <div className='w-full grid grid-cols-[1fr_2fr]'>
          <div className="relative w-full border-r border-dark-blue-800 h-full px-3 py-4 flex items-center justify-center">
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <IoChevronDownOutline className={`text-xl text-dark-blue-800 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <p className="text-center px-10">English</p>
          </div>
          <div className='w-full text-left px-5 py-4 flex gap-x-4 items-center justify-between'>
            <p>{translations.en[id]}</p>
            <button
              className='p-2 h-fit'
              onClick={() => setShowEditOverlay(true)}
            >
              <IoCreateOutline className='text-2xl text-dark-blue-800' />
            </button>
          </div>
          <div
            className={`
          col-span-2 overflow-hidden transition-[max-height] duration-300 ease-in-out
          ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}
        `}
          >
            <div className="grid grid-cols-[1fr_2fr]">
              {Object.keys(supportedLngs).slice(1).map((lng) => (
                <React.Fragment key={lng}>
                  <div className="w-full border-r border-t border-dark-blue-800 h-full flex items-center justify-between">
                    <div className="w-14 h-full bg-dark-blue-800"></div>
                    <p className="px-3 py-4">{lng}</p>
                    {/* use invisible div to keep text centered */}
                    <div className="w-14 h-full"></div>
                  </div>
                  <div className="w-full border-t border-dark-blue-800 h-full text-left px-5 py-4 flex gap-x-4 items-center justify-between">
                    <p>{translations[supportedLngs[lng]][id]}</p>
                    <button className='p-2 h-fit'>
                      <IoCreateOutline className='text-2xl text-dark-blue-800' />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEditOverlay && <Overlay>
        <form action={handleEditTranslation}>
          {/* make fields required */}
          <div className="grid grid-cols-2 gap-x-2">
            <Button
              label="Cancel"
              isOutline={true}
              onClick={() => {
                setShowEditOverlay(false);
                resetForm();
              }}
            />
            <Button label="Save" type="submit" />
          </div>
        </form>
      </Overlay>}
    </div>
  )
}

export default AdminTranslations;