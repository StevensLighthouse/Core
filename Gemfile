# Specify source for gems
source 'http://rubygems.org'

group :default do
  gem 'sinatra', '1.4.4'
  gem 'rspec'
  gem 'rack-test'
  gem 'factory_girl'
end

group :development do
	gem 'shotgun'
  gem 'sqlite3'
end

group :production do
	gem 'unicorn'
  gem 'mysql2'
end

# these gems won't be autoloaded
gem 'activerecord', :require => false 
gem 'sinatra-activerecord', :require => false
