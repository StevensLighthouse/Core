get '/' do

  'hello'
end

get '/create_tour' do
  # create a sample tour
  t = Tour.create(:name => "Test Tour", :description => "This is a test description", :visibility => true, :lat => 333.999999, :lon => 333.999999) 
  puts t
end
