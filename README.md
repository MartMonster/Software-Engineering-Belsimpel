# Software-Engineering-Belsimpel
## HTML coverage reports
The coverage report for the front end can be found [here](https://github.com/MartMonster/Software-Engineering-Belsimpel/tree/Refactoring/foosball-front-end/coverage/lcov-report), and the coverage report for the back end can be found [here](https://github.com/MartMonster/Software-Engineering-Belsimpel/tree/Refactoring/foosball-ranking/coverage)
## Hosting on an ip/domain
To host this application on an ip address, or domain, change the `APP_URL` and `FRONTEND_URL` in the `.env` file in the `foosball-ranking` directory to reflect on where you want to host it (for example `APP_URL=http://foosball.belsimpel.nl:8000` and `FRONTEND_URL=http://foosball.belsimpel.nl`).

After that, change `axios.defaults.baseURL` (line 4 of `Login.ts` in the following directory: `foosball-front-end/src/components/endpoints/`) to the `APP_URL` you have defined in the `.env` file (for example `axios.defaults.baseURL = 'http://foosball.belsimpel.nl:8000'`).

To see the changes you probably need to rebuild the docker containers, and refresh your browser.
## Docker (no live update)
### Prerequisites
To run the dockerized version of this project you need `docker` and `docker-compose`.

### How to run
In **both** the root directory **and** in the `foosball-ranking` directory rename the `default.env` file to `.env`. If you want to change the database properties make sure to rename them in both files (and run `docker-compose down -v` if you have started the database before), otherwise it will not work.

Then run `docker-compose up` in the root directory.
To see changes after editing project (or `.env`) files, you need to either restart the application by running `docker-compose up --build` or following the `How to run` instructions in the `Dev` section.

## Dev (with live update)
### Prerequisites
To run this project you need `node` with `npm`, `composer` (`php`), and `docker` installed. To run this project you need to follow both of the "how to run" instructions below on the same physical device, otherwise it will not work.

### Back-End
#### Documentation/API specification
inside the `Documentation` directory there a file `openapi.yaml`. This is our API specification
in regard to the API endpoints.
You can open this file either with your editor of choice, where you might need an add-on/plugin
to view this file correctly, or open [https://editor.swagger.io/](https://editor.swagger.io/) and pasting the contents
of our file into it.

#### How to run
First make sure you are in the `foosball-ranking` directory, and rename the `.env.example` file to `.env`
##### Linux
```bash
composer update
sudo chmod o+w ./storage/ -R # This is to give permission to sail to read/write into log files
./vendor/laravel/sail/bin/sail up -d
./vendor/laravel/sail/bin/sail artisan migrate --seed
```
##### Windows
```bash
cd foosball-ranking
composer update
bash ./vendor/laravel/sail/bin/sail up -d
bash ./vendor/laravel/sail/bin/sail artisan migrate --seed
```

### Front-End
#### How to run
First make sure you are in the `foosball-front-end` directory
```bash
npm update
npm start
```
### Running on your local IP
To get it working for every device (including your phone) on your local network, you need to make some changes:
- First get the local ip address of the computer you will host the project on.
- Change the `.env` file (in the `foosball-ranking` directory) variable `FRONTEND_URL` to have your local ip instead of localhost. That will most likely look something like the following: `FRONTEND_URL=http://192.168.X.XXX:3000`
- Change the `Login.ts` file (in directory `foosball-front-end/src/components/endpoints`) to use the baseURL of your own ip, which will most likely look something like the following: `axios.defaults.baseURL = 'http://192.168.X.XXX:8000';`

After this you can run the project like normal, and navigate to the URL you specified in the `.env` file. (localhost does not work with these changes)