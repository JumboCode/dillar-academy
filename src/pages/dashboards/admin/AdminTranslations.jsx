import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import SearchBar from '@/components/SearchBar';
import Overlay from '@/components/Overlay';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Form/FormInput';
import Alert from '@/components/Alert';
import Unauthorized from "@/pages/Unauthorized";
import SkeletonTranslationRow from '@/components/Skeletons/SkeletonTranslationRow';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';
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

  const nsSetters = {
    default: setDefaultTranslations,
    levels: setLevelTranslations
  }

  useEffect(() => {
    const fetchData = async () => {
      const defaultTranslations = await fetchNamespaceTranslations("default");
      setDefaultTranslations(defaultTranslations);
      const levelTranslations = await fetchNamespaceTranslations("levels");
      setLevelTranslations(levelTranslations);
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

  const fetchNamespaceTranslations = async (ns) => {
    const enJson = await getTranslations("en", ns);
    const trJson = await getTranslations("tr", ns);
    const ruJson = await getTranslations("ru", ns);
    const ugJson = await getTranslations("ug", ns);
    const zhJson = await getTranslations("zh", ns);
    return ({
      en: enJson.data,
      tr: trJson.data,
      ru: ruJson.data,
      ug: ugJson.data,
      zh: zhJson.data,
    });
  }

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <h1 className="font-extrabold">Edit Translations</h1>
      <div className='flex'>
        <p className='text-gray-400'>
          Note: the {'{{...}}'} in translations represent where values are plugged in (ie. by replacing {'{{num}}'} with 1 in Level {'{{num}}'} we get L
          evel 1.)
          &nbsp;
          <span className='text-red-400'>It's best to leave the brackets alone or some text may not display properly!</span>
        </p>
      </div>
      <div className='space-y-16'>
        <TranslationTable
          label={"Edit translations for levels"}
          translations={levelTranslations}
          ns="levels"
          fetchTranslations={fetchNamespaceTranslations}
          setters={nsSetters}
          allowRender={allowRender}
        />
        <TranslationTable
          label={"Edit translations for general and student pages"}
          translations={defaultTranslations}
          ns="default"
          fetchTranslations={fetchNamespaceTranslations}
          setters={nsSetters}
          allowRender={allowRender}
        />
      </div>
    </div>
  )
}

const TranslationTable = ({ label, translations, ns, fetchTranslations, setters, allowRender }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const showSkeleton = useDelayedSkeleton(!allowRender);

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

  const condensedTranslations = (translations, end) => {
    const slicedKeys = Object.keys(translations.en).slice(0, end);

    const condensed = { en: {}, tr: {}, ru: {}, ug: {}, zh: {} }
    for (const key of slicedKeys) {
      condensed.en[key] = translations.en[key];
      condensed.tr[key] = translations.tr[key];
      condensed.ru[key] = translations.ru[key];
      condensed.ug[key] = translations.ug[key];
      condensed.zh[key] = translations.zh[key];
    }

    return condensed;
  }

  const filteredTranslations =
    isFullyExpanded
      ? filterTranslations(translations, searchInput)
      : condensedTranslations(filterTranslations(translations, searchInput), 5);

  return (
    <div className='flex flex-col items-center gap-y-5'>
      <div className='space-y-4 w-full'>
        <h2 className='font-extrabold mb-2'>{label}</h2>
        <SearchBar input={searchInput} setInput={setSearchInput} placeholder="Search for translation" />
        <div className="flex flex-col rounded-sm border border-dark-blue-800 overflow-hidden">
          <div className="w-full grid grid-cols-[1fr_2fr] py-4 px-8 bg-dark-blue-800 text-white text-center">
            <h4 className='font-extrabold text-base sm:text-xl'>Language</h4>
            <h4 className='font-extrabold text-base sm:text-xl'>Translation</h4>
          </div>
          <div>
            {allowRender
              ? Object.keys(filteredTranslations.en).map(id => (
                <TableRow
                  key={id}
                  id={id}
                  translations={filteredTranslations}
                  ns={ns}
                  fetchTranslations={fetchTranslations}
                  setters={setters} />
              ))
              : showSkeleton && <SkeletonTranslationRow count={5} />}
          </div>
        </div>
      </div>
      <Button
        label={isFullyExpanded ? "Minimize" : "View All"}
        onClick={() => setIsFullyExpanded(!isFullyExpanded)}
        isOutline
      />
    </div>
  )
}

const TableRow = ({ id, translations, ns, fetchTranslations, setters }) => {
  // const [alertMessage, setAlertMessage] = useState("");

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
    try {
      console.log(formData)
      console.log(ns)
      await editTranslation(formData.lng, ns, formData.key, formData.translation);
      const updatedTranslations = await fetchTranslations(ns);
      const setTranslations = setters[ns];
      setTranslations(updatedTranslations);
      setShowEditOverlay(false);
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
          {/* {alertMessage !== "" && <p className='text-red-500'>{alertMessage}</p>} */}
        </form>
      </Overlay>}
    </div>
  )
}

export default AdminTranslations;