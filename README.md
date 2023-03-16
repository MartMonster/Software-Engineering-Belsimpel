# Software-Engineering-Belsimpel

## How to run
First make sure you are in the `foosball-ranking` directory
### Linux
```bash
composer update
./vendor/laravel/sail/bin/sail up -d
./vendor/laravel/sail/bin/sail artisan migrate --seed
```
### Windows
```bash
cd foosball-ranking
composer update
bash ./vendor/laravel/sail/bin/sail up -d
bash ./vendor/laravel/sail/bin/sail artisan migrate --seed
```