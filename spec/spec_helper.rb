ENV['RACK_ENV'] = 'test'

# bootstrap our app
require './app'

require 'rack/test'
require 'factory_girl'
require 'factories/factories'

RSpec.configure do |conf|
  conf.include Rack::Test::Methods
end

