# Specify source for gems
source 'http://rubygems.org'

group :default do
  gem 'sinatra', '1.4.4'
  gem 'sinatra-activerecord'
  gem 'sinatra-respond_to'
  gem 'sinatra-contrib'
  gem 'rspec'
  gem 'rack-test'
  gem 'factory_girl'
  gem 'protected_attributes', '1.0.3'
  gem 'bcrypt-ruby'
  gem 'carrierwave'
end

group :development do
  gem 'capistrano'
  gem 'capistrano-rvm'
	gem 'shotgun'
  gem 'sqlite3'
  gem 'guard'
  gem 'guard-rspec'
  gem 'terminal-notifier-guard'  
  gem 'capistrano-bundler'
end

group :production do
	gem 'unicorn'
  gem 'mysql2'
  gem 'pg'
end

group :test do
  gem 'database_cleaner'
end

gem 'rake'
