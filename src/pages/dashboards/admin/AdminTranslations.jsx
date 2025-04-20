import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import SearchBar from '@/components/SearchBar';
import Overlay from '@/components/Overlay';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import Alert from '@/components/Alert';
import { IoChevronDownOutline, IoCreateOutline } from "react-icons/io5";
import { getTranslations, editTranslation } from '@/api/translation-wrapper';

const AdminTranslations = () => {
  const { user } = useContext(UserContext);
  const { isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();
  const [allowRender, setAllowRender] = useState(false);
  const [defaultTranslations, setDefaultTranslations] = useState({
    en: {},
    ru: {},
    tr: {},
    ug: {},
    zh: {},
  });
  const [levelTranslations, setLevelTranslations] = useState({
    en: {},
    ru: {},
    tr: {},
    ug: {},
    zh: {},
  });
  const [classTranslations, setClassTranslations] = useState({
    en: {},
    ru: {},
    tr: {},
    ug: {},
    zh: {},
  });
  const [conversationTranslations, setConversationTranslations] = useState({
    en: {},
    ru: {},
    tr: {},
    ug: {},
    zh: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchDefaultTranslations();
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

  const fetchDefaultTranslations = async () => {
    const enJson = await getTranslations("en", "default");
    const trJson = await getTranslations("tr", "default");
    const ruJson = await getTranslations("ru", "default");
    const ugJson = await getTranslations("ug", "default");
    const zhJson = await getTranslations("zh", "default");
    setDefaultTranslations({
      en: enJson.data,
      tr: trJson.data,
      ru: ruJson.data,
      ug: ugJson.data,
      zh: zhJson.data,
    })
  }

  const fetchLevelTranslations = async () => {

  }

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
          <h3 className="font-extrabold mb-6">Levels</h3>
          {/* <TranslationTable

          /> */}
        </div>
        <div>
          <h3 className="font-extrabold mb-6">Classes</h3>
        </div>
        <div>
          <h3 className="font-extrabold mb-6">Conversations</h3>
        </div>
      </div>

      <div>
        <h2 className='font-extrabold mb-6'>Edit general and student page translation</h2>
        <TranslationTable
          translations={defaultTranslations}
          fetchTranslations={fetchDefaultTranslations}
        />
      </div>
    </div>
  )
}

const TranslationTable = ({ translations, fetchTranslations }) => {
  const [searchInput, setSearchInput] = useState('');

  const filterTranslations = (translations, filter) => {
    const filterInsensitive = filter.toLowerCase();
    const filteredTranslations = {}

    const keys = Object.keys(translations.en)
    for (const key of keys) {
      const matches = Object.entries(translations).some(([lang, keys]) => {
        const value = keys[key];
        return value && value.toLowerCase().includes(filterInsensitive);
      });

      if (matches) {
        // Add this key and its value for each language
        for (const [lang, keys] of Object.entries(translations)) {
          if (!filteredTranslations[lang]) filteredTranslations[lang] = {};
          filteredTranslations[lang][key] = keys[key];
        }
      }
    }

    return Object.keys(filteredTranslations).length === 0 ? { en: {}, tr: {}, ru: {}, ug: {}, zh: {} } : filteredTranslations;
  }

  const filteredTranslations = filterTranslations(translations, searchInput);

  return (
    <div className='space-y-4'>
      <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for translation" />
      <div className="flex flex-col rounded-sm border border-dark-blue-800 overflow-hidden">
        <div className="w-full grid grid-cols-[1fr_2fr] py-4 px-8 bg-dark-blue-800 text-white text-center">
          <h4 className='font-extrabold text-base sm:text-xl'>Language</h4>
          <h4 className='font-extrabold text-base sm:text-xl'>Translation</h4>
        </div>
        <div>
          {Object.keys(filteredTranslations.en).map(id => (
            <TableRow
              key={id} id={id}
              translations={filteredTranslations}
              namespace={"default"}
              fetchTranslations={fetchTranslations} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TableRow = ({ id, translations, namespace, fetchTranslations }) => {
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

  const handleOpenOverlay = (target, value) => {
    setFormData(prev => ({
      ...prev,
      [target]: value,
    }));
  };

  const handleTranslationChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditTranslation = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await editTranslation(formData.lng, namespace, formData.key, formData.translation);
      resetForm();
      await fetchTranslations();
      setShowEditOverlay(false);
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
              onClick={() => {
                console.log(id)
                handleOpenOverlay("lng", "en");
                handleOpenOverlay("key", id);
                handleOpenOverlay("translation", translations.en[id])
                setShowEditOverlay(true);
              }}
            >
              <IoCreateOutline className='text-2xl text-dark-blue-800' />
            </button>
          </div>
          {/* <div
            className={`
          col-span-2 overflow-hidden transition-[max-height] duration-300 ease-in-out
          ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}
        `}
          > */}
          {/* <div className="grid grid-cols-[1fr_2fr]"> */}
          {isExpanded && Object.keys(supportedLngs).slice(1).map(lng => (
            <React.Fragment key={supportedLngs[lng]}>
              <div className="w-full border-r border-t border-dark-blue-800 h-full flex items-center justify-between">
                <div className="w-14 h-full bg-dark-blue-800"></div>
                <p className="px-3 py-4">{lng}</p>
                {/* use invisible div to keep text centered */}
                <div className="w-14 h-full"></div>
              </div>
              <div className="w-full border-t border-dark-blue-800 h-full text-left px-5 py-4 flex gap-x-4 items-center justify-between">
                <p>{translations[supportedLngs[lng]][id]}</p>
                <button
                  className='p-2 h-fit'
                  onClick={() => {
                    console.log(id)
                    handleOpenOverlay("lng", supportedLngs[lng]);
                    handleOpenOverlay("key", id);
                    handleOpenOverlay("translation", translations[supportedLngs[lng]][id])
                    setShowEditOverlay(true);
                  }}
                >
                  <IoCreateOutline className='text-2xl text-dark-blue-800' />
                </button>
              </div>
            </React.Fragment>
          ))}
          {/* </div>
          </div> */}
        </div>
      </div>

      {showEditOverlay && <Overlay width='w-1/2'>
        <form onSubmit={handleEditTranslation} className='space-y-6'>
          <h4 className='font-extrabold text-base sm:text-lg'>Language: {Object.keys(supportedLngs).find(lng => supportedLngs[lng] === formData.lng)}</h4>
          <div className="space-y-2">
            <label>Edit Translation</label>
            <FormInput
              type="textarea"
              name="translation"
              placeholder="Enter translated text"
              value={formData.translation}
              onChange={handleTranslationChange}
              isRequired={true}
            />
          </div>
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