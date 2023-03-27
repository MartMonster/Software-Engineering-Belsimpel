# Software-Engineering-Belsimpel
## Back-End
### Documentation/API specification
inside the `Documentation` directory there a file `openapi.yaml`. This is our API specification
in regard to the API endpoints.
You can open this file either with your editor of choice, where you might need an add-on/plugin
to view this file correctly, or open [https://editor.swagger.io/](https://editor.swagger.io/) and pasting the contents
of our file into it.

### How to run
First make sure you are in the `foosball-ranking` directory
#### Linux
```bash
composer update
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
