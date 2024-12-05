
import dummyBg from '@/assets/dummy-bg.png';
import Button from '@/components/Button/Button';

const sections = [
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg1",
        title: "Choose your class level",
        description: "Take a quick assessment to see what your English level is like!",
    },
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg2",
        title: "Find a time and instructor",
        description: "Browse our list of classes to find one that works!",
    },
    {
        imgSrc: dummyBg,
        imgAlt: "dummy-bg3",
        title: "Start Learning!",
        description: "Go to class and start learning English. You'll be fluent in no time!",
    },
];

const Home = () => {
    return (
        <>
            <div className="bg-gradient-to-r from-white via-blue-1000 to-blue-900 p-4 min-h-[60dvh] flex items-center justify-center">
                <div className="text-center md:text-left mb-12 mt-12 px-5 justify-items-center">
                    <p className="text-2xl text-blue-600 mb-3">Stop Learning. Start Knowing.</p>
                    <h1 className="text-5xl font-extrabold mb-6 ">Dillar English Academy</h1>
                    <p className="text-lg">Free English education for Uyghurs around the world.</p>
                    <p className="text-sm mb-4"><b>300+</b> students and growing!</p>
                    <div className="flex flex-col md:flex-row items-center space-x-3">
                        <Button
                            label={"Start Learning"}
                            onClick={() => alert('Dummy button-1 clicked!')}
                            isOutline={false}
                        />
                        <Button
                            label={"Learn More"}
                            onClick={() => alert('Dummy button-2 clicked!')}
                            isOutline={true}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 mt-4">
                <h1 className="text-4xl font-extrabold mb-10 text-center">How It Works</h1>
                {sections.map((section, index) => (
                    <div key={index} className={`flex flex-col md:flex-row items-center justify-evenly px-4 md:px-2 mb-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <img src={section.imgSrc} alt={section.imgAlt} className="mb-4 md:mb-8 md:w-1/3 rounded-lg shadow-md" />
                        <div className={`px-2 md:px-0 text-center md:text-left md:w-1/3`}>
                            <h2 className="text-3xl font-semibold mb-5">{section.title}</h2>
                            <p className="text-lg mb-4">{section.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Home;
