#!/bin/bash

DOMAIN="notarx.com"

npm run build
aws s3 cp build/ s3://notarx.com --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --recursive

CLDID=`aws cloudfront list-distributions --query "DistributionList.Items[].{OriginDomainName: Origins.Items[0].DomainName, OriginId: Id }[?contains(OriginDomainName, '$DOMAIN')] | [0]" --output text | cut -f 2`
sleep 5
aws cloudfront create-invalidation --distribution-id $CLDID --paths '/*'
