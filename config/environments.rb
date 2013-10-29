# Set default rack_env; necessary for Rakefile
ENV['RACK_ENV'] ||= 'development'

# Retrieve db config from config/database.yml
db_config = Hash.new

YAML::load(File.open('config/database.yml'))[ENV['RACK_ENV']].each do |k, v|
  db_config[k.to_sym] = v
end

# Set up activerecord database connection
ActiveRecord::Base.establish_connection(db_config)
