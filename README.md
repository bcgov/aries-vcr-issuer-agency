[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

# Aries VCR Issuer Agency
A scalable, multi-tenanted issuer service based on Aries Cloud Agent Python to facilitate issuing verifiable credentials to an Aries VCR instance.

## Running the Agency
### Prerequisites

#### Docker

Ensure that you have Docker and Docker Compose installed in your environment. This is all you will need to run the Agency.

_Please see instructions [here](https://docs.docker.com/desktop/#download-and-install) for installing Docker and instructions [here](https://docs.docker.com/compose/install/) for installing Docker Compose on your system._

#### VON network

You will need to have a ledger setup in order to use the Agency. If you are running [Aries VCR](#aries-vcr), you should already have a locally running instance of the VON network.

_Otherwise, please see the instructions [here](https://github.com/bcgov/von-network) to get a VON network up and running on your system._

#### Aries VCR

The Agency will issue credentials to an instance of Aries VCR running in the same network. Therefore, you will need to have a running instance of Aries-VCR.

_Please see the instructions [here](https://github.com/bcgov/aries-vcr/tree/master/docs) to get Aries VCR up and running on your system._

### Starting the Agency

1. Open a terminal and navigate to the `./docker` directory.

2. Run the command: `./manage build` in your terminal. This command will build all the relevant container environments for the application. Please wait while this completes.

3. Once containers have completed building, run the command: `./manage start` in your terminal. This command will start up the agency. Please wait while this completes.

4. Once the Agency has started, open your browser to `http:localhost:8080`. This is the Issuer web interface. Open another browser tab to `http://localhost:3030/swagger/docs`. This is the Swagger API interface for the Agency Admin. You will need to register an Issuer using the Agency Admin API in order to obtain an Issuer API key. The API key will allow you to log into the Issuer web iterface, create schemas and issue credentials. The Agency Admin API can be authenticated using the API key: `'controller-api-key'`.

### Stopping the Agency

1. Navigate to the `./docker` directory if you aren't already in it.

2. Run the command: `./manage stop` in your terminal. This will stop the running application containers. _Note: this will not remove the containers from your environment._

3. (Opitonal) Run the command: `./manage down` in your terminal. This will remove the applciation containers from your environment and free up resources.
