// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
require("dotenv").config();

// eslint-disable-next-line no-undef
module.exports = {
  packagerConfig: {
    name: "MsgBox",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "msgbox",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        // eslint-disable-next-line no-undef
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: "seanwash",
          name: "msgbox-app",
        },
        prerelease: true,
      },
    },
  ],
};
