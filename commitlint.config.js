module.exports = {
  extends: ["git-commit-emoji"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "๐ init",
        "โจ feat",
        "๐ fix",
        "๐ docs",
        "๐ style",
        "โป๏ธ refactor",
        "๐ perf",
        "๐งช test",
        "๐๏ธ build",
        "๐ฆ ci",
        "๐งน chore",
        "โฉ revert",
      ],
    ],
  },
};
