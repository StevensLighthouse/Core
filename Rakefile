require_relative 'app'
require 'sinatra/activerecord/rake'

require 'rspec/core'
require 'rspec/core/rake_task'

desc "Perform rspec tests ('spec') directory"
RSpec::Core::RakeTask.new(:spec)

task :default => :spec

desc 'Load the seed data from db/seeds.rb'
namespace :db do
  task :seed do
    seed_file = "./db/seeds.rb"
    puts "Seeding database from: #{seed_file}"
    load(seed_file) if File.exist?(seed_file)
  end
end

