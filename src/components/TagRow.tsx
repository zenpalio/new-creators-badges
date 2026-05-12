const tags = [
  "Truelook", "Velvetheat", "Fantasy", "Artea", "Aphrodite",
  "Darkfantasy", "Anthro", "Dreammix", "Furry", "Cartoon", "Anime3d",
];

const TagRow = () => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
    {tags.map((tag) => (
      <button
        key={tag}
        className="flex-shrink-0 px-4 py-2 rounded-full bg-tag-v2 text-tag-v2-foreground text-sm hover:bg-accent-v2 transition-colors"
      >
        {tag}
      </button>
    ))}
  </div>
);

export default TagRow;
