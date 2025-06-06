import { FilerManager, FolderType } from "../src/index";

const filer = new FilerManager({ name: "docs" });
filer.newFolder({
  config: {
    name: "pictures",
    type: FolderType.PUBLIC,
  },
});

filer.newFolder({
  config: {
    name: "cars",
    type: FolderType.PRIVATE,
  },
});

filer.newFolder({
  config: {
    name: "dogs",
    type: FolderType.PRIVATE,
  },
});

filer.newFolder({
  config: {
    name: "cats",
    type: FolderType.PRIVATE,
  },
});
