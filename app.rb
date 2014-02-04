require 'erb'
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/respond_to'
require 'sinatra/content_for'
require 'yaml'
require 'bcrypt'
require 'protected_attributes' # needed for attr_accessible

require './config/environments'

Sinatra::Application.register Sinatra::RespondTo

class LighthouseCore < Sinatra::Application

  configure do
    set :app_file, __FILE__
    set :root, File.dirname(__FILE__)
    set :views, File.join(settings.root, "app/views")
    set :public_folder, 'public'
    set :sessions, true
    set :session_secret, 'secret'

    set :protection, :except => [:json_csrf]
  end

end

%w(models controllers helpers).each do |path|
  Dir[File.join(File.dirname(__FILE__), "app", path, "*.rb")].each do |f|
    require f
  end
end


