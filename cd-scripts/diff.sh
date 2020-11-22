#!/bin/bash
echo "obtaining commits"
git rev-list --remotes > all_commits.txt
echo "filtering commits"
last=$(cat last-commit.txt)
if [ -z $last ]
then
    cat all_commits.txt > new_commits.txt
else
    echo "last commit: $last"
    cat all_commits.txt | sed "/$last/Q" > new_commits.txt
fi

echo "new commits:"
cat new_commits.txt

echo "obtaning changes"

truncate -s 0 changes.txt

while read -r line; do
    git diff-tree --no-commit-id --name-only -r $line >> changes.txt
done < new_commits.txt

cat changes.txt | grep .*.json > json_files_changed.txt


node process.js json_files_changed.txt