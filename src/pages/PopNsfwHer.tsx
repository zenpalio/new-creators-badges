import bg from "@/assets/nsfw-her-bg.png.asset.json";

const PopNsfwHer = () => {
  return (
    <div
      className="min-h-screen w-full bg-black bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${bg.url})` }}
    >
      {/* Characters and content coming next */}
    </div>
  );
};

export default PopNsfwHer;
