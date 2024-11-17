
const StyleGuide = () => {
  const colorPalette = [
    {
      hex: "#59BCF5",
      name: "blue",
      variations: [
        {
          number: 100,
          hex: "#ECF7FE",
        },
        {
          number: 200,
          hex: "#B7E2FB",
        },
        {
          number: 300,
          hex: "#87CEF8",
        },
        {
          number: 400,
          hex: "#59BCF5",
        },
        {
          number: 500,
          hex: "#22A6F2",
        },
        {
          number: 600,
          hex: "#0D8ED8",
        },
        {
          number: 700,
          hex: "#0A6FA8",
        },
        {
          number: 800,
          hex: "#074F78",
        },
      ]
    },
    {
      hex: "#0F084B",
      name: "dark-blue",
      variations: [
        {
          number: 100,
          hex: "#EEEDFD",
        },
        {
          number: 200,
          hex: "#C5BEF8",
        },
        {
          number: 300,
          hex: "#9B90F3",
        },
        {
          number: 400,
          hex: "#7163EE",
        },
        {
          number: 500,
          hex: "#4735E9",
        },
        {
          number: 600,
          hex: "#2112A6",
        },
        {
          number: 700,
          hex: "#180D78",
        },
        {
          number: 800,
          hex: "#0F084B",
        },
      ]
    },
    {
      hex: "#26769B",
      name: "turquoise",
      variations: [
        {
          number: 100,
          hex: "#F7FBFD",
        },
        {
          number: 200,
          hex: "#CEE7F3",
        },
        {
          number: 300,
          hex: "#A5D3E9",
        },
        {
          number: 400,
          hex: "#53ACD5",
        },
        {
          number: 500,
          hex: "#3096C5",
        },
        {
          number: 600,
          hex: "#26769B",
        },
        {
          number: 700,
          hex: "#1C5773",
        },
        {
          number: 800,
          hex: "#12384A",
        },
      ]
    },
    {
      hex: "#4C4B63",
      name: "neutral",
      variations: [
        {
          number: 200,
          hex: "#E8E8ED",
        },
        {
          number: 300,
          hex: "#B4B4C6",
        },
        {
          number: 400,
          hex: "#7B7A9A",
        },
        {
          number: 500,
          hex: "#626180",
        },
        {
          number: 600,
          hex: "#4C4B63",
        },
        {
          number: 700,
          hex: "#2A2A37",
        },
      ]
    },
    {
      hex: "#FFFFFF",
      name: "white",
    },
    {
      hex: "#000000",
      name: "black",
    },
  ]

  const fontStyles = [
    {
      name: "Heavy",
      weightStyle: "font-extrabold",
      weightNum: 800,
    },
    // {
    //   name: "Medium",
    //   weightStyle: "font-medium",
    // },
    {
      name: "Roman",
      weightStyle: "text-normal",
      weightNum: 400,
    },
    {
      name: "Book",
      weightStyle: "text-light",
      weightNum: 300,
    },
  ]

  const h2Style = `text-3xl mb-2 font-extrabold`
  const sectionStyle = `py-6 px-8`

  return (
    <div className="py-6 h-full">
      <h1 className="px-8 text-4xl my-6 font-extrabold">Style Guide</h1>
      {/* color palette */}
      <section className={`${sectionStyle} bg-indigo-100`}>
        <h2 className={h2Style}>Color Palette</h2>
        <p>Lists the tailwind color name, opacities, and hex codes. The colors have all been added to the Tailwind config so you can use them like any Tailwind color class</p>
        <p>Ex: <code className="bg-blue-200 text-dark-blue-500">className="bg-blue-200 text-dark-blue-500"</code></p>
        <div className="flex">
          {colorPalette.map((color, index) => (
            <div key={index} className="flex-auto flex flex-col gap-y-4 items-center p-5 min-h-fit">
              <h3 className="text-xl whitespace-nowrap">Color name: {color.name}</h3>
              {color.variations ? (
                color.variations.map((variation, variationIndex) => (
                  <div key={variationIndex} className="flex items-center space-x-5">
                    <div style={{ backgroundColor: variation.hex }} className={`h-20 w-20`}></div>
                    <div className="flex flex-col">
                      <p>Number: {variation.number}</p>
                      <p>Hex: {variation.hex}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-5 whitespace-nowrap">
                  <div style={{ backgroundColor: color.hex }} className={`h-20 w-20`}></div>
                  <p>Hex: {color.hex}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* fonts */}
      <section className={`${sectionStyle}`}>
        <h2 className={h2Style}>Font: Avenir</h2>
        <p>Font styles</p>
        <div className="flex flex-col my-3 space-y-3">
          {fontStyles.map((style, index) => (
            <div className={`flex space-x-2 items-end ${style.weightStyle}`}>
              <p className={`text-2xl leading-tight`}>{style.name}</p>
              <p>Tailwind weight style: {style.weightStyle}</p>
              <p>Weight Number: {style.weightNum}</p>
            </div>
          ))}
        </div>
      </section>
      {/* icons */}
      <section className={`${sectionStyle}`}>
        <h2 className={h2Style}>Icon pack: Ionicons 5</h2>
        <a href="https://react-icons.github.io/react-icons/icons/io5/" className="text-blue-500 text-xl">Link to icons</a>
        <p>To access the Ionicons 5 icons we will be using the react-icon library. To add an icon, click on the icon on the page, copy the import statement, and then use the icon like a regular component.</p>
        <p className="text-red-400 text-xl mt-3">Note: react-icons is a library containing a bunch of icon packs, make sure the icon you import is from <code>react-icons/io5</code>!</p>
      </section>
    </div>
  )
}

export default StyleGuide