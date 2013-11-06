require 'erb'
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/respond_to'
require 'sinatra/content_for'
require 'yaml'

require './config/environments'

Sinatra::Application.register Sinatra::RespondTo

class LighthouseCore < Sinatra::Application

  configure do
    set :app_file, __FILE__
    set :root, File.dirname(__FILE__)
    set :views, File.join(settings.root, "app/views")
    set :public_folder, 'public'
  end

end

%w(models controllers helpers).each do |path|
  Dir[File.join(File.dirname(__FILE__), "app", path, "*.rb")].each do |f|
    require f
  end
end

