#!/bin/bash
# This script is used to create the gchr versions for the project.
#
# https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
#
# CR_PAT is the token for the container registry.
# USERNAME is the owner for the container registry.

set -eux

echo "$CR_PAT" | docker login ghcr.io -u $USERNAME --password-stdin

TAGS=(v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 latest)

for TAG in ${TAGS[@]}; do
    docker build --build-args VERSION=$TAG -t ghcr.io/$USERNAME/delete-ghcr-version/test-version:$TAG .
    docker push ghcr.io/$USERNAME/delete-ghcr-version/test-version:$TAG
done
