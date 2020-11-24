#!/bin/bash
echo -e "starting...\n"

mkdir ./temp/

echo -e "obtaining commits...\n"
git rev-list --remotes > ./temp/all_commits.txt

last=$(cat last-commit.txt)

if [ -z "$last" ]
then
    cat ./temp/all_commits.txt | tac > ./temp/new_commits.txt
else
    echo -e "filtering commits older than $last\n"
    cat ./temp/all_commits.txt | sed -n "/$last/q;p" | tac > ./temp/new_commits.txt
fi

echo -e "obtaning changes...\n"

truncate -s 0 ./temp/changes.txt

while read -r line; do
    #echo "fetching "$line
    echo "COMMIT "$line >> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=A -r $line | sed 's/^/ADDED /' >> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=M -r $line | sed 's/^/MODIFIED /'>> ./temp/changes.txt
    git diff-tree --no-commit-id --name-only --diff-filter=D -r $line | sed 's/^/DELETED /'>> ./temp/changes.txt
    printf "\n" >> ./temp/changes.txt
    
done < ./temp/new_commits.txt

echo ""

echo -e "filtering changes...\n"

cat ./temp/changes.txt | grep '^COMMIT\|exercicios.*.json$' > changed-json-files.txt

echo -e "result:\n"

cat changed-json-files.txt

rm -r ./temp/