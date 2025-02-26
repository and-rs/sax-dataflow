#!/bin/bash
# One of the best and most commonly used tools is cURL.
# For example, to test a GET endpoint:
curl -X GET "http://localhost:3001/" -H "Accept: application/json"

# To test a POST endpoint with JSON data:
# curl -X POST "https://api.example.com/resource" \
    #     -H "Content-Type: application/json" \
    #     -d '{"key1": "value1", "key2": "value2"}'
