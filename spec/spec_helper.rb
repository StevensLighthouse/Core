ENV['RACK_ENV'] = 'test'

# bootstrap our app
require './app'

require 'rack/test'
require 'factory_girl'
require 'factories/factories'
require 'database_cleaner'

RSpec.configure do |conf|
  conf.include Rack::Test::Methods

  conf.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  conf.before(:each) do
    DatabaseCleaner.start
  end

  conf.after(:each) do
    DatabaseCleaner.clean
  end

  def app
    LighthouseCore.new
  end
end


