#!/bin/bash
echo "obtaining commits"
git rev-list --remotes > all_commits.txt
echo "filtering commits"
last=$(cat last-commit.txt)
if [ -z $last ]
then
    cat all_commits.txt | tac > new_commits.txt
else
    echo "last commit: $last"
    cat all_commits.txt | sed "/$last/Q" | tac > new_commits.txt
fi

echo "new commits:"
cat new_commits.txt

echo "obtaning changes"

truncate -s 0 changes.txt

while read -r line; do
    echo "fetching "$line
    echo "COMMIT "$line >> changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=A -r $line | sed 's/^/ADDED /' >> changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=M -r $line | sed 's/^/MODIFIED /'>> changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=D -r $line | sed 's/^/DELETED /'>> changes.txt
    printf "\n" >> changes.txt
    
done < new_commits.txt

cat changes.txt | grep .*.json$ > json_files_changed.txt

echo "global changes"
cat changes.txt

echo "changes on json files"
cat json_files_changed.txt

#npm i --silent
#node process.js json_files_changed.txt