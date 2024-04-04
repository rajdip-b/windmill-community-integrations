# Accelo Integration

## Environment variables and credentials setup

- Create an account on [Accelo](https://www.accelo.com/).
- Keep a note of the deployment name
- Create a new service application by going into the `Settings` -> `API` -> `Register Application`
- Copy the `Client ID` and `Client Secret` and keep them handy
- Make a curl request to get the access token
  ```bash
  curl -X POST https://windmill-digital.api.accelo.com/oauth2/v0/token \          1 ↵
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'authorization: Basic base64(client_id:client_secret)' \
    -d 'grant_type=client_credentials' \
    -d 'scope=write(all)'
  ```
- Add `ACCELO_ACCESS_TOKEN`, `ACCELO_COMPANY_ID`, `ACCELO_DEPLOYMENT_NAME` to the .env file. `ACCELLO_COMPANY_ID` being the ID of any company you want to run the tests against.
