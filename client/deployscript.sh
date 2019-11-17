#!/bin/bash

npm run build
aws s3 cp build/ s3://notarx.com --grants read=uri=http://acs.amazon.com/groups/global/AllUsers --recursive
