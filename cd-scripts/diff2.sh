#!/bin/bash
echo "starting..."

mkdir ./temp/

echo "obtaining commits"
git rev-list --remotes > ./temp/all_commits.txt

echo "filtering commits"
last=$(cat last-commit.txt)

echo $last

if [ -z "$last" ]
then
    cat ./temp/all_commits.txt | tac > ./temp/new_commits.txt
else
    cat ./temp/all_commits.txt | sed -n "/$last/q;p" | tac > ./temp/new_commits.txt
fi

echo "obtaning changes"

truncate -s 0 ./temp/changes.txt

while read -r line; do
    echo "fetching "$line
    echo "COMMIT "$line >> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=A -r $line | sed 's/^/ADDED /' >> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=M -r $line | sed 's/^/MODIFIED /'>> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=D -r $line | sed 's/^/DELETED /'>> ./temp/changes.txt
    printf "\n" >> ./temp/changes.txt
    
done < ./temp/new_commits.txt

cat ./temp/changes.txt | grep '^COMMIT\|.json$' > changed-json-files.txt

echo "ALL COMMITS_-------------------------------------------------------------"
cat ./temp/all_commits.txt
echo "NEW COMMITS--------------------------------------------------------------"
cat ./temp/new_commits.txt
echo "CHANGES-------------------------------------------------------------------"
cat ./temp/changes.txt
echo "CHANGES-JSON--------------------------------------------------------------"
cat changed-json-files.txt
echo "-------------------------------------------------------------------------"

rm -r ./temp/

#npm i --silent
#node process.js json_files_changed.txt