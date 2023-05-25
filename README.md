# Software-Engineering-Belsimpel
## Prerequisites:
To run this project you need `node` with `npm`, and `composer`. To run this project you need to follow both of the "how to run" instructions below on the same physical device, otherwise it will not work.

## Back-End
### Documentation/API specification
inside the `Documentation` directory there a file `openapi.yaml`. This is our API specification
in regard to the API endpoints.
You can open this file either with your editor of choice, where you might need an add-on/plugin
to view this file correctly, or open [https://editor.swagger.io/](https://editor.swagger.io/) and pasting the contents
of our file into it.

### How to run
First make sure you are in the `foosball-ranking` directory, and rename the `.env.example` file to `.env`
#### Linux
```bash
composer update
sudo chmod o+w ./storage/ -R # This is to give permission to sail to read/write into log files
./vendor/laravel/sail/bin/sail up -d
./vendor/laravel/sail/bin/sail artisan migrate --seed
```
#### Windows
```bash
cd foosball-ranking
composer update
bash ./vendor/laravel/sail/bin/sail up -d
bash ./vendor/laravel/sail/bin/sail artisan migrate --seed
```

## Front-End
### How to run
First make sure you are in the `foosball-front-end` directory
```bash
npm update
npm start
```
## Running on your local IP
To get it working for every device (including your phone) on your local network, you need to make some changes:
- First get the local ip address of the computer you will host the project on.
- Change the `.env` file (in the `foosball-ranking` directory) variable `FRONTEND_URL` to have your local ip instead of localhost. That will most likely look something like the following: `FRONTEND_URL=http://192.168.X.XXX:3000`
- Change the `Login.ts` file (in directory `foosball-front-end/src/components/endpoints`) to use the baseURL of your own ip, which will most likely look something like the following: `axios.defaults.baseURL = 'http://192.168.X.XXX:8000';`

After this you can run the project like normal, and navigate to the URL you specified in the `.env` file. (localhost does not work with these changes)