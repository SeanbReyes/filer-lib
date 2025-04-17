import { FilerManager, FolderType } from "../src/index";

const filer = new FilerManager({ name: "docs" });
filer.newFolder({
  config: {
    name: "pictures",
    type: FolderType.PUBLIC,
  },
});
