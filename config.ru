require 'bundler'
Bundler.setup(:default, ENV['RACK_ENV'])

require './app'

run LighthouseCore.new

