# Upload NEXORA to GitHub

This ZIP contains the complete NEXORA source project. After extracting it, open a terminal inside the `nexora` folder and run the commands below while signed in to GitHub as **HARSHA-1504**.

```bash
git init
git add .
git commit -m "Publish NEXORA project source"
git branch -M main
git remote add origin https://github.com/HARSHA-1504/job-board.git
git push -u origin main
```

If Git reports that `origin` already exists, replace the `git remote add` command with:

```bash
git remote set-url origin https://github.com/HARSHA-1504/job-board.git
```

After the push completes, refresh <https://github.com/HARSHA-1504/job-board> to see the project files.
