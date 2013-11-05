require 'sinatra'
require 'sinatra/activerecord'
require 'yaml'

require './config/environments'

class LighthouseCore < Sinatra::Application

  configure do
    set :root, File.dirname(__FILE__)
    set :app_file, __FILE__
  end

end

%w(models controllers helpers).each do |path|
  Dir[File.join(File.dirname(__FILE__), "app", path, "*.rb")].each do |f|
    require f
  end
end

