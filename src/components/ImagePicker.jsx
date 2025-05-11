
import Overlay from "@/components/Overlay";
import Button from "@/components/Button/Button";

const ImagePicker = ({ images, selectedImage, setImage, setPickerOpen }) => {

  return (
    <Overlay width={"w-2/3"}>
      <h3 className="font-extrabold">Select image to use as level background</h3>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setImage(img)}
            className={`h-40 overflow-hidden ${selectedImage === img && "border-4 border-dark-blue-700 rounded-sm"}`}>
            <img
              src={`/images/${img}`}
              alt={`level image ${i}`}
              loading="lazy"
              className="w-full h-full object-cover p-1 rounded-sm"
            />
          </button>
        ))}
      </div>
      <Button label="Close" onClick={() => setPickerOpen(false)} />
    </Overlay>
  )
}

export default ImagePicker
