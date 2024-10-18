import founder from '../assets/founder.jpg'


function About() {

  return (
    <>
    <div className="flex flex-col p-10 mx-5 my-10 lg:flex-row-reverse lg:justify-between">
        <div className="flex items-center justify-center lg:w-1/3">
            <img src = {founder} alt = "dummy founder image" title = "dummy image" className = "w-full h-auto"></img>
        </div>
        <div className="my-auto text-2xl lg:w-7/12 lg:text-lg lg:mr-5">
            <h1 className ="text-5xl text-center py-5 lg:text-4xl lg:text-left">About Us</h1>
            <p>Dillar English Academy was founded by Dilnawa and Dilziba Dilmurat 
                Kizghin to help Uyghurs around the world learn English without cost. 
                With the help and commitment of our volunteer teachers, our goal is 
                to bridge the educational disparity gap among Uyghurs worldwide.
            </p>
            <br />
            <p>Dillar Academy has grown exponentially in a short time! Recognizing a 
                need in the international Uyghur community, we have recruited Uyghur 
                college students in America to volunteer their time and teach various 
                levels of English. Although our teachers are not certified English 
                language instructors, they are native English speakers who invest 
                time into teaching the best information that they can.
            </p>
        </div>
    </div>
    
    </>
  )
}

export default About
