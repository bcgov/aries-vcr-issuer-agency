[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

# Aries VCR Issuer Agency
A scalable, multi-tenanted issuer service based on Aries Cloud Agent Python to facilitate issuing verifiable credentials to an Aries VCR instance.

## Running the Agency
### Prerequisites

#### Docker

Ensure that you have Docker and Docker Compose installed in your environment.

_Please see instructions [here](https://docs.docker.com/desktop/#download-and-install) for installing Docker and instructions [here](https://docs.docker.com/compose/install/) for installing Docker Compose on your system._

#### VON network

You will need to have a ledger setup in order to use the Agency. If you are running [Aries VCR](#aries-vcr), you should already have a locally running instance of the VON network.

_Otherwise, please see the instructions [here](https://github.com/bcgov/von-network) to get a VON network up and running on your system._

#### Aries VCR

The Agency will issue credentials to an instance of Aries VCR running in the same network. Therefore, you will need to have a running instance of Aries-VCR.

_Please see the instructions [here](https://github.com/bcgov/aries-vcr/tree/master/docs) to get Aries VCR up and running on your system._

### Starting the Agency

1. Open a terminal and navigate to the `./docker` directory.

2. Run the command: `./manage build` in your terminal. This command will build all the relevant container services for the application. Please wait while this completes.

3. Once containers have completed building, run the command: `./manage start` in your terminal. This command will start up the Agency. Please wait while this completes.

4. Once the Agency has started, open your browser to `http:localhost:8090`. This is the Issuer web interface. Open another browser tab to `http://localhost:3030/swagger/docs`. This is the Swagger API interface for the Agency Admin. You will need to register an Issuer using the Agency Admin API in order to obtain an Issuer API key. The API key will allow you to log into the Issuer web interface, create schemas and issue credentials. The Agency Admin API can be authenticated using the API key: `'controller-api-key'`.  See the detailed instructions below.


#### Instructions for Creating a New Issuer

1. Open a browser tab to `http://localhost:3030/swagger/docs` - this is the Swagger API interface for the Agency Admin.

2. Click on the `Authorize` button, enter the "APIKeyHeader (apiKey)": `controller-api-key` and click on "Authorize" and then "Close".  Note that this authorizes the Agency (which can create new Issuers) but does not authorize any Issuers.

3. Create an issuer - select the `POST /admin` endpoint and enter a value for "name" in the request body - this will be the name of the Issuer.  Submit this request.  For example:

```
{
  "name": "Ians Test Issuer"
}
```

This request will return the api key for the Issuer, for example:

```
{
  "name": "Ians Test Issuer",
  "api-key": "06d0cc5e-2858-4130-aefb-b88f8b070433"
}
```

4. Click on the `Authorize` button again (same as in step 2 above) and enter the "IssuerAPIKeyHeader (apiKey)": `06d0cc5e-2858-4130-aefb-b88f8b070433` (based on the previous step, your mileage will vary) and click on "Authorize" and then "Close".  This will authorize your new Issuer for the next series of steps.

5. Enter Issuer Profile info - select the `POST /issuer/profile` endpoint and enter values for the profile attributes.  Submit this request.  For example:

```
{
  "abbreviation": "ianco",
  "url": "https://anon-solutions.ca",
  "email": "test@mail.com",
  "logo": "https://anon-solutions.ca/assets/images/Anon5-greylime.png"
}
```

This request will also return the DID and Verkey of your issuer, which you may want to make note of:

```
{
  "did": "7qsq2ZBgmZvU3xHgXfRXVx",
  "verkey": "4jK3Xx6ZtaUSDAJabiQCqstUJwK4hxjzxTtKvg6sE9hx",
  "name": "Ians Test Issuer",
  "abbreviation": "ianco",
  "url": "https://anon-solutions.ca",
  "email": "test@mail.com",
  "logo": "https://anon-solutions.ca/assets/images/Anon5-greylime.png"
}
```

6. Next step is to setup any schemas you plan to issue - `POST /issuer/schema`.  Submit with some schema data, for example:

```
{
  "schema_name": "ianco-permit",
  "schema_version": "1.0.0",
  "attributes": [
    "corp_num", "corp_name", "permit_no", "issue_date",
    "addressee", "civic_address", "city", "province", "postal_code", "country",
    "effective_date", "revoked_date"
  ],
  "metadata": {
    "topic": [
      {
        "name": "corp_num",
        "topic_type": "string"
      }
    ],
    "cardinality": [
      "permit_no"
    ],
    "date_fields": {
      "effective_date": "effective_date",
      "revoked_date": "revoked_date",
      "other_date_fields": [
        "issue_date"
      ]
    },
    "address_fields": [
      {
        "addressee": "addressee",
        "civic_address": "civic_address",
        "city": "city",
        "province": "province",
        "postal_code": "postal_code",
        "country": "country"
      }
    ],
    "search_fields": [
      "corp_name"
    ],
    "labels": {
      "schema": {
        "en": "Ianco Permit",
        "fr": "Permit de Ianco"
      },
      "attributes": [
        {
          "name": "corp_num",
          "translations": {
            "en": {
              "label": "Corp Number",
              "description": "Corp Number assigned by the registrar"
            },
            "fr": {
              "label": "Le Numero de Corp",
              "description": "Asignee par la registrar"
            }
          }
        },
        {
          "name": "corp_name",
          "translations": {
            "en": {
              "label": "Corp Name",
              "description": "Name under which this corp does business"
            },
            "fr": {
              "label": "Le Name de Corp",
              "description": "Le name de corp"
            }
          }
        },
        {
          "name": "permit_no",
          "translations": {
            "en": {
              "label": "Permit Number",
              "description": "Permit Number assigned by the issuer"
            },
            "fr": {
              "label": "Le Numero de Permit",
              "description": "Asignee par la issuer"
            }
          }
        }
      ]
    }
  }
}
```

This is a firly verbose example, but it illustrates the main features of the Issuer Schema:

- schema name and version
- list of attributes that will be included in the issued credentials
- metadata for the schema, including attribute definitions (data type, etc) and translated names and descriptions to display in OrgBook

Obviously translations can be included for *a;;* schema attributes.

The response will include the Schema and Cred Def ID's:

```
{
  "schema_id": "7qsq2ZBgmZvU3xHgXfRXVx:2:ianco-permit:1.0.0",
  "credential_definition_id": "7qsq2ZBgmZvU3xHgXfRXVx:3:CL:14:Ians_Test_Issuer"
}
```

7. Finall you (the Issuer) can issue a credential - `POST /issuer/credential`:

```
{
  "schema_name": "ianco-permit",
  "schema_version": "1.0.0",
  "attributes": {
    "corp_num": "BC1234567",
    "corp_name": "Ians Test Company",
    "permit_no": "123465",
    "issue_date": "2021-01-01",
    "addressee": "Mr Big Wig",
    "civic_address": "123 Any Street",
    "city": "Vancouver",
    "province": "BC",
    "postal_code": "V1V 1V1",
    "country": "Canada",
    "effective_date": "2021-04-01",
    "revoked_date": ""
  }
}
```

### Stopping the Agency

1. Navigate to the `./docker` directory if you aren't already there.

2. Run the command: `./manage stop` in your terminal. This will stop the running application containers. _Note: this will not remove the containers from your environment._

3. (Opitonal) Run the command: `./manage down` in your terminal. This will remove the applciation containers from your environment and free up resources.
